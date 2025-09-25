// backend/models/Message.js
import mongoose from "mongoose";

const emotionAnalysisSchema = new mongoose.Schema({
  primaryEmotion: { type: String, required: true },
  emotions: [{
    emotion: { type: String, required: true },
    confidence: { type: Number, required: true, min: 0, max: 1 }
  }],
  sentiment: {
    score: { type: Number, required: true, min: -5, max: 5 }, // Allow wider range for sentiment library scores
    comparative: { type: Number, required: true },
    label: { type: String, enum: ['positive', 'negative', 'neutral'], required: true }
  },
  accuracy: {
    overall: { type: Number, required: true, min: 0, max: 1 },
    textClarity: { type: Number, required: true, min: 0, max: 1 },
    emotionConfidence: { type: Number, required: true, min: 0, max: 1 },
    languageProcessing: { type: Number, required: true, min: 0, max: 1 }
  },
  keywords: [{ type: String }],
  processedAt: { type: Date, default: Date.now }
});

const messageSchema = new mongoose.Schema({
  text: { type: String, required: true },
  languages: [{ type: String, required: true }],
  emotionAnalysis: emotionAnalysisSchema,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Message", messageSchema);
