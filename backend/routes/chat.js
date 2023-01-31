const mongoose = require("mongoose");
const { Authorization } = require("../middleware/authorization");
const router = require("express").Router();
const { Message, Chat } = require("../models/chat-schema");

router.post("/user-messages", async (req, res) => {
  const messages = await Message.find({ senderId: req.body.id });

  res.status(200).json(messages);
});

router.use(Authorization);

router.get("/my-chats", async (req, res) => {
  const chats = await Chat.find({ users: { $in: req.userId } });

  if (chats.length === 0)
    return res.status(404).json({ message: "There is no chat" });
  for (let i = 0; i < chats.length; i++) {
    chats[i] = await Chat.aggregate([
      {
        $match: {
          _id: chats[i]._id,
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messages",
        },
      },
    ]);
  }
  console.log(chats);

  res.status(200).json(chats);
});

router.post("/new-chat", async (req, res) => {
  try {
    const users = req.body;

    const docs = await Chat.find({ users: { $all: [...users] } });

    if (docs.length === 0) {
      // Create a new chat
      const chat = new Chat({
        users,
      });
      await chat.save();

      // Send the new chat as a response
      return res.status(201).json(chat);
    }

    console.log(docs);
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/:chatId/messages", async (req, res) => {
  try {
    const { chatId } = req.params;
    const { user, text, receipent } = req.body;

    // Find the chat by its ID
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).send({ error: "Chat not found" });
    }

    // Create a new message
    const message = new Message({
      senderId: user,
      message: text,
      receipent,
    });
    await message.save();

    // Add the message to the chat's messages array
    chat.messages.push(message);
    await chat.save();

    const chatWithMsg = await Chat.aggregate([
      {
        $match: { _id: chat._id },
      },
      {
        $lookup: {
          from: "messages",
          localField: "messages",
          foreignField: "_id",
          as: "messages",
        },
      },
    ]);
    console.log(chatWithMsg);
    // Send the new message as a response
    res.json(chatWithMsg[0]);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
