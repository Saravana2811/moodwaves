// backend/routes/messageRoutes.js
import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// Save message
router.post("/", async (req, res) => {
  try {
    const { text, languages } = req.body;

    const newMessage = new Message({ text, languages });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
});

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

export default router;
