const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Authorization } = require("../middleware/authorization");
const { Event } = require("../models/event-schema");
const { User } = require("../models/user-schema");
const { Report } = require("../models/report-schema");

const Banned = mongoose.model(
  "banned",
  {
    bannedObject: Object,
  },
  "banned"
);

router.use(Authorization);

router.get("/", async (req, res) => {
  const reports = await Report.find();

  res.status(200).json(reports);
});

router.post("/", (req, res) => {
  const { reportType, reporter, reported, reportDesc } = req.body;

  const report = new Report({
    reportType,
    reporter,
    reported,
    reportDesc,
  });

  report.save((err, repo) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json(repo);
    }
  });
});

router.post("/ban-event", async (req, res) => {
  console.log(req.body);
  const event = await Event.findById(req.body.id);

  const banned = new Banned({
    bannedObject: event,
  });

  await banned.save();
  await Event.findByIdAndDelete(req.body.id);
  await Report.findOneAndDelete({ reported: req.body.id });
  res.status(200).json({ message: "banned" });
});

router.post("/ban-user", async (req, res) => {
  console.log(req.body);
  const user = await User.findById(req.body.id);

  const banned = new Banned({
    bannedObject: user,
  });

  await banned.save();
  await User.findByIdAndDelete(req.body.id);
  await Report.findOneAndDelete({ reported: req.body.id });
  res.status(200).json({ message: "banned" });
});

module.exports = router;
