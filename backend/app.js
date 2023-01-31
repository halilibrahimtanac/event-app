const express = require("express");
const mongoose = require("mongoose");
const eventRouter = require("./routes/event");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const reportRouter = require("./routes/report");
const app = express();
const path = require("path");
const cors = require("cors");

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "*");
  next();
});

app.use(cors());

app.use("/uploads/images", express.static(path.join("uploads/images")));

app.use("/event", eventRouter);
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/report", reportRouter);

mongoose.connect(
  "",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (!err) {
      app.listen(5000, () => console.log("Server started at 5000 port"));
    }
  }
);
