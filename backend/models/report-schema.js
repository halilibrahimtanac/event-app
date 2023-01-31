const mongoose = require("mongoose");

const ReportSchema = mongoose.Schema(
  {
    reportType: String,
    reporter: {
      type: String,
      required: true,
    },
    reported: {
      type: String,
      required: true,
    },
    reportDesc: String,
  },
  { timestamps: true }
);

exports.Report = mongoose.model("Report", ReportSchema);
