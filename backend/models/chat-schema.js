const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    senderId: String,
    message: String,
    receipent: String,
  },
  { timestamps: true }
);

exports.Message = mongoose.model("Message", MessageSchema);

const ChatSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  },
  { timestamps: true }
);

exports.Chat = mongoose.model("Chat", ChatSchema);
