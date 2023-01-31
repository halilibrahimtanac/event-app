const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { Event } = require("../models/event-schema");
const { Authorization } = require("../middleware/authorization");
const imageUpload = require("../middleware/image-upload");
const { Notify } = require("../models/notify-schema");

// Fetch an event from the database by ID
router.get("/event/:id", (req, res) => {
  Event.findById(req.params.id, (err, event) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(event);
    }
  });
});

// Fetch all events from the database by ID
router.get("/all-events", (req, res) => {
  Event.find((err, event) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json(event);
    }
  });
});

//Get participated events
router.get("/participated/:uid", async (req, res) => {
  const events = await Event.find({
    $or: [
      { participators: { $elemMatch: { userId: req.params.uid } } },
      { moderators: { $elemMatch: { userId: req.params.uid } } },
    ],
  });

  console.log("participated", events);

  res.status(200).json(events);
});

router.get("/:id/my-events", (req, res) => {
  Event.find({ "manager.userId": req.params.id }, (error, events) => {
    if (error) return res.status(404).json({ message: "Events not found" });
    console.log(events);
    res.status(200).json(events);
  });
});

router.use(Authorization);

// Extract event information from the request body
router.post("/new-event", imageUpload.single("image"), (req, res) => {
  const { name, date, eventType, description, eventLocation, manager } =
    req.body;
  const event = new Event({
    name,
    date,
    eventType,
    description,
    eventLocation,
    eventPic: req.file.path,
    manager: {
      userId: req.userId,
      userName: manager,
    },
    moderators: [],
    participators: [],
    chat: [],
  });

  // Save the event to the database
  event.save((err, event) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json(event);
    }
  });
});

// Send a message in the event chat
router.post("/:id/chat", (req, res) => {
  const { senderId, senderUserName, message } = req.body;
  const timestamp = new Date();

  // Find the event by its ID and update the chat array with the new message
  Event.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        chat: { senderId, senderUserName, message, timestamp },
      },
    },
    { new: true },
    (err, event) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(event);
      }
    }
  );
});

// Kick a participator from an event
router.delete("/:id/participators/:userId", async (req, res) => {
  // Find the event by its ID and update the participators array

  const event = await Event.find({
    _id: req.params.id,
  });
  if (event.length > 0) {
    event[0].participators = event[0].participators.filter(
      (x) => x.userId !== req.params.userId
    );
    const updatedEvent = await event[0].save();
    return res.status(200).json(updatedEvent);
  }
  return res.status(500).json({ error: "internal server error" });
});

// Kick a moderator from an event
router.delete("/:id/moderators/:userId", (req, res) => {
  // Find the event by its ID and update the participators array
  Event.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        moderators: { userId: req.params.userId },
      },
    },
    { new: true },
    (err, event) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (event.manager.userId !== req.userId) {
        res.status(401).json({
          error: "Only the manager can kick participators from the event.",
        });
      } else {
        res.json(event);
      }
    }
  );
});

router.post("/:id/participator-invitation", async (req, res) => {
  const id = req.params.id;
  const { notifyType, from, sendedId } = req.body;

  const notify = new Notify({
    notifyType: notifyType,
    from: from,
    to: sendedId,
    isSeen: false,
    extraInfo: id,
  });

  const n = await notify.save();
  res.status(201).json(n);
});

router.get("/get-pending-join-reqs", async (req, res) => {
  const notifies = await Notify.find({
    notifyType: { $in: ["join-request", "event-invitation"] },
    $or: [{ "from.senderId": req.userId }, { to: req.userId }],
  });
  res.status(200).json(notifies);
});

router.post("/event-join-req", async (req, res) => {
  const { eventId, userName, managerId } = req.body;
  const notify = new Notify({
    notifyType: "join-request",
    from: {
      senderId: req.userId,
      senderName: userName,
    },
    to: managerId,
    extraInfo: eventId,
  });

  const n = await notify.save();
  res.status(201).json(n);
});

// Add a new participator to an event
router.post("/:id/participators", (req, res) => {
  // Find the event by its ID and update the participators array
  Event.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        participators: {
          userId: req.body.userId,
          userName: req.body.userName,
          profilePic: req.body.profilePic,
        },
      },
    },
    { new: true },
    (err, event) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(200).json(event);
      }
    }
  );
});

router.get("/:id/participators-remove", (req, res) => {
  Event.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        participators: [],
      },
    },
    { new: true },
    (err, event) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (event.manager.userId !== req.userId) {
        res.status(401).json({
          error: "Only the manager can remove participators to the event.",
        });
      } else {
        res.json(event);
      }
    }
  );
});

// Assign a role to a participator in an event
router.patch("/:id/participators/:userId", (req, res) => {
  // Find the event by its ID and update the participator's role
  Event.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        participators: { userId: req.params.userId },
      },
      $push: {
        moderators: {
          userId: req.params.userId,
          userName: req.body.userName,
          profilePic: req.body.profilePic,
        },
      },
    },
    { new: true },
    (err, event) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (event.manager.userId !== req.userId) {
        res.status(401).json({
          error:
            "Only the manager or moderator can assign roles to participators.",
        });
      } else {
        res.json(event);
      }
    }
  );
});

// Unrole a moderator in an event
router.patch("/:id/moderators/:userId", (req, res) => {
  // Find the event by its ID and update the participator's role
  console.log(req.body);
  Event.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        moderators: { userId: req.params.userId },
      },
      $push: {
        participators: {
          userId: req.params.userId,
          userName: req.body.userName,
          profilePic: req.body.profilePic,
        },
      },
    },
    { new: true },
    (err, event) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else if (event.manager.userId !== req.userId) {
        res.status(401).json({
          error:
            "Only the manager or moderator can assign roles to participators.",
        });
      } else {
        res.json(event);
      }
    }
  );
});

router.patch("/events/:id/personal-leave", (req, res) => {
  Event.findByIdAndUpdate(
    req.params.id,
    {
      $pull: {
        participators: { userId: req.userId },
        moderators: { userId: req.userId },
      },
    },
    { new: true },
    (err, event) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(event);
      }
    }
  );
});

router.patch("/events/:id/manager-remove", async (req, res) => {
  const event = await Event.findById(req.params.id);
  const mods = [...event.moderators];
  const participators = [...event.participators];

  if (mods.length > 0) {
    const newCreator = {
      ...mods[Math.ceil(Math.random() * mods.length - 1)],
    };
    event.moderators = mods.filter((x) => x.userId !== newCreator._doc.userId);
    event.manager = newCreator;
    const eventres = await event.save();
    res.status(200).json({ event: eventres });
  } else if (participators.length > 0) {
    const newCreator = {
      ...participators[Math.ceil(Math.random() * participators.length - 1)],
    };
    event.participators = event.participators.filter(
      (x) => x.userId !== newCreator._doc.userId
    );
    console.log("new cre: ", newCreator._doc);
    console.log(
      "filtered participators: ",
      participators.filter((x) => x.userId !== newCreator._doc.userId)
    );
    event.manager = newCreator;
    const eventres = await event.save();
    res.status(200).json(eventres);
  } else {
    Event.findByIdAndDelete(event._id, (err, event) => {
      if (err) {
        res.status(500).json({ error: err });
      } else {
        res.status(200).json({ message: "removed" });
      }
    });
  }
});

// Handle the event creator leaving the event
router.put("/:id/leave", (req, res) => {
  // Get the ID of the event and the user ID of the creator who is leaving
  const id = req.params.id;
  const creatorId = req.body.creatorId;

  // Find the event in the database
  Event.findById(id, (err, event) => {
    if (err) {
      // If there was an error, send a 500 status and the error message
      res.status(500).send(err);
    } else {
      // Get the list of moderators and participators in the event
      const moderators = event.moderators;
      const participators = event.participators;

      // If there are any moderators in the event, assign the creator role to a random moderator
      if (moderators.length > 0) {
        const newCreatorId =
          moderators[Math.floor(Math.random() * moderators.length)];

        // Remove the new creator from the list of moderators and add them to the list of participators
        event.moderators = moderators.filter(
          (userId) => userId !== newCreatorId
        );
        event.participators.push(newCreatorId);

        // Update the event in the database and send a 200 status and the updated event
        event.save((err, updatedEvent) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(updatedEvent);
          }
        });
      } else {
        // If there are no moderators, assign the creator role to a random participator
        const newCreatorId =
          participators[Math.floor(Math.random() * participators.length)];

        // Remove the new creator from the list of participators
        event.participators = participators.filter(
          (userId) => userId !== newCreatorId
        );

        // Update the event in the database and send a 200 status and the updated event
        event.save((err, updatedEvent) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(updatedEvent);
          }
        });
      }
    }
  });
});

module.exports = router;
