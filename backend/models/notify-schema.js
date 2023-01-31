const mongoose = require("mongoose");

const NotifySchema = mongoose.Schema(
  {
    notifyType: {
      type: String,
      required: true,
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
    from: {
      type: Object,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    extraInfo: String,
  },
  { timestamps: true }
);

exports.Notify = mongoose.model("Notify", NotifySchema);
