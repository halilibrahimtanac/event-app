const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user-schema");
const { Notify } = require("../models/notify-schema");
const fileUpload = require("../middleware/image-upload");
const { Authorization } = require("../middleware/authorization");
const { Friend } = require("../models/friend-schema");

router.get("/all-users", (req, res) => {
  User.find()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.status(404).json({ message: "No user found" }));
});

router.get("/uid/:uid", async (req, res) => {
  const uid = req.params.uid;

  const foundUser = await User.findById(uid);
  if (foundUser) return res.status(200).json(foundUser);
  res.status(404).json({ message: "User not found" });
});

router.get("/profile-pic/:uid", async (req, res) => {
  const { profilePic } = await User.findById(req.params.uid);

  res.status(200).json(profilePic);
});

router.post("/get-by-uids", async (req, res) => {
  const users = await User.find({ _id: { $in: req.body } });

  if (users.length === 0)
    res.status(404).json({ message: "There is no users" });
  res.status(200).json(users);
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email })
    .lean()
    .then((user) => {
      if (!user)
        return res.status(400).json({ message: "User does not exist" });

      // Validate password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch)
          return res.status(400).json({ message: "Invalid credentials" });
        const token = jwt.sign({ userId: user._id }, "token_secret_key");

        res.json({ ...user, token });
      });
    });
});

router.post("/signup", fileUpload.single("image"), (req, res) => {
  const reqUser = req.body;
  // Validate input
  if (
    !reqUser.name ||
    !reqUser.email ||
    !reqUser.password ||
    !reqUser.userName
  ) {
    return res.status(400).json({ message: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email: reqUser.email }).then((user) => {
    if (user) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({
      ...reqUser,
      profilePic: req.file ? req.file.path : "",
    });

    // Create salt & hash
    bcrypt.hash(newUser.password, 10, (err, hash) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Internal server error", error: err });
      newUser.password = hash;
      newUser.save().then((user) => {
        res.status(201).json(user);
      });
    });
  });
});

router.use(Authorization);

router.post("/update-user", fileUpload.single("image"), async (req, res) => {
  const userData = req.body;
  const updateObj = {
    name: userData.name,
    gender: userData.gender,
    birthDate: userData.birthDate,
    location: userData.location,
    description: userData.description,
  };
  if (req.file) Object.assign(updateObj, { profilePic: req.file.path });

  if (updateObj.name === "") {
    return res.status(500).json({ message: "Don't left empty name area" });
  }
  const updatedUser = await User.findOneAndUpdate(
    { _id: userData._id },
    {
      $set: updateObj,
    },
    { new: true }
  );
  console.log(req.file ? req.file.path : "no file provided");
  res.status(201).json(updatedUser);
});

router.post("/add-friend-req", async (req, res) => {
  const { senderId, senderName, to } = req.body;

  const notify = await new Notify({
    notifyType: "friend",
    isSeen: false,
    from: {
      senderId,
      senderName,
    },
    to,
  });

  const n = await notify.save();
  res.status(201).json(n);
});

router.get("/notifications", async (req, res) => {
  const userID = req.userId;

  const notifications = await Notify.find({ to: userID });

  console.log(notifications);
  res.status(200).json(notifications);
});

router.post("/remove-notify", async (req, res) => {
  const notifyId = req.body.id;
  console.log(notifyId);

  const deletedNotify = await Notify.findByIdAndDelete(notifyId);

  if (deletedNotify) return res.status(200).json(deletedNotify);

  res.status(404).json({ message: "Notify not found" });
});

router.post("/friend/:id", async (req, res) => {
  const id = req.params.id;
  const userId = req.userId;

  const friends = await Friend.find({ users: { $all: [id, userId] } });

  if (friends.length === 0) {
    const friend = new Friend({
      users: [id, userId],
    });

    const f = await friend.save();

    return res.status(201).json(f);
  }
  res.status(500).json({ message: "You are already friend with this person!" });
});

router.get("/get-friends", async (req, res) => {
  const userId = req.userId;

  const friends = await Friend.find({ users: { $in: userId } });

  res.status(201).json(friends);
});

router.get("/get-pending-friend", async (req, res) => {
  const pendingFriendReqs = await Notify.find({
    "from.senderId": req.userId,
    notifyType: "friend",
  });

  res.status(200).json(pendingFriendReqs);
});

router.post("/unfriend", async (req, res) => {
  const { id, friend } = req.body;

  await Friend.findOneAndDelete({ users: { $all: [id, friend] } });
  res.status(200).json({ message: "unfriended" });
});

router.get("/:userNameParam", (req, res) => {
  User.find(
    { userName: { $regex: req.params.userNameParam, $options: "i" } },
    (err, users) => {
      if (err) {
        return res.status(500).json([]);
      }
      return res.status(200).json(users);
    }
  );
});

module.exports = router;
