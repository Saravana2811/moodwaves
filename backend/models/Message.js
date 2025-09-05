// backend/models/Message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  languages: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);
