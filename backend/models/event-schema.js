const mongoose = require("mongoose");

// Create a new Event schema
const EventSchema = new mongoose.Schema({
  name: String,
  date: Date,
  eventType: String,
  eventLocation: String,
  eventPic: String,
  description: String,
  manager: {
    userId: String,
    userName: String,
  },
  moderators: [
    {
      userId: String,
      userName: String,
      profilePic: { type: String, default: "" },
    },
  ],
  participators: [
    {
      userId: String,
      userName: String,
      profilePic: { type: String, default: "" },
    },
  ],
  chat: [
    {
      senderId: String,
      senderUserName: String,
      message: String,
      timestamp: Date,
    },
  ],
});

// Create a model for the Event schema
exports.Event = mongoose.model("Event", EventSchema, "events");
