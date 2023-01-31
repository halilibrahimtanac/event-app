const mongoose = require("mongoose");

const FriendSchema = mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamp: true }
);

exports.Friend = mongoose.model("Friend", FriendSchema);
