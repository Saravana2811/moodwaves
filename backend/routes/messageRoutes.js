// backend/routes/messageRoutes.js
import express from "express";
import Message from "../models/Message.js";
import { analyzeEmotion, batchAnalyzeEmotions } from "../services/emotionAnalysisService.js";
import spotifyService from "../services/spotifyService.js";

const router = express.Router();

// Save message with emotion analysis
router.post("/", async (req, res) => {
  try {
    const { text, languages } = req.body;

    // Validate input
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required and cannot be empty" });
    }

    // Perform emotion analysis
    const emotionAnalysis = analyzeEmotion(text, languages || ['English']);

    // Create new message with analysis
    const newMessage = new Message({ 
      text, 
      languages: languages || ['English'],
      emotionAnalysis
    });
    
    await newMessage.save();

    res.status(201).json({
      message: newMessage,
      analysis: emotionAnalysis
    });
  } catch (err) {
    console.error('Error saving message with analysis:', err);
    res.status(500).json({ error: "Failed to save message", details: err.message });
  }
});

// Get all messages with their analyses
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Get emotion analysis for a specific message
router.get("/:id/analysis", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // If no analysis exists, perform it now
    if (!message.emotionAnalysis) {
      const analysis = analyzeEmotion(message.text, message.languages);
      message.emotionAnalysis = analysis;
      await message.save();
    }

    res.json({
      messageId: message._id,
      text: message.text,
      analysis: message.emotionAnalysis
    });
  } catch (err) {
    console.error('Error fetching analysis:', err);
    res.status(500).json({ error: "Failed to fetch analysis", details: err.message });
  }
});

// Re-analyze emotion for existing message
router.post("/:id/reanalyze", async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Perform new analysis
    const analysis = analyzeEmotion(message.text, message.languages);
    message.emotionAnalysis = analysis;
    await message.save();

    res.json({
      messageId: message._id,
      text: message.text,
      analysis: analysis,
      message: "Analysis updated successfully"
    });
  } catch (err) {
    console.error('Error re-analyzing message:', err);
    res.status(500).json({ error: "Failed to re-analyze message", details: err.message });
  }
});

// Batch analyze multiple messages
router.post("/batch-analyze", async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds)) {
      return res.status(400).json({ error: "messageIds array is required" });
    }

    const messages = await Message.find({ '_id': { $in: messageIds } });
    const results = await batchAnalyzeEmotions(messages);

    // Update messages with new analyses
    for (const result of results) {
      if (result.analysis) {
        await Message.findByIdAndUpdate(result.messageId, {
          emotionAnalysis: result.analysis
        });
      }
    }

    res.json({
      processed: results.length,
      results: results
    });
  } catch (err) {
    console.error('Error in batch analysis:', err);
    res.status(500).json({ error: "Failed to batch analyze messages", details: err.message });
  }
});

// Get emotion statistics
router.get("/stats/emotions", async (req, res) => {
  try {
    const messages = await Message.find({ emotionAnalysis: { $exists: true } });
    
    const stats = {
      totalAnalyzed: messages.length,
      emotionDistribution: {},
      sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
      averageAccuracy: 0,
      topKeywords: {}
    };

    let totalAccuracy = 0;

    messages.forEach(message => {
      const analysis = message.emotionAnalysis;
      
      // Count primary emotions
      if (analysis.primaryEmotion) {
        stats.emotionDistribution[analysis.primaryEmotion] = 
          (stats.emotionDistribution[analysis.primaryEmotion] || 0) + 1;
      }

      // Count sentiment distribution
      if (analysis.sentiment?.label) {
        stats.sentimentDistribution[analysis.sentiment.label]++;
      }

      // Accumulate accuracy
      if (analysis.accuracy?.overall) {
        totalAccuracy += analysis.accuracy.overall;
      }

      // Count keywords
      if (analysis.keywords) {
        analysis.keywords.forEach(keyword => {
          stats.topKeywords[keyword] = (stats.topKeywords[keyword] || 0) + 1;
        });
      }
    });

    // Calculate average accuracy
    stats.averageAccuracy = messages.length > 0 ? 
      Math.round((totalAccuracy / messages.length) * 1000) / 1000 : 0;

    // Sort top keywords
    stats.topKeywords = Object.entries(stats.topKeywords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .reduce((obj, [keyword, count]) => {
        obj[keyword] = count;
        return obj;
      }, {});

    res.json(stats);
  } catch (err) {
    console.error('Error generating stats:', err);
    res.status(500).json({ error: "Failed to generate emotion statistics", details: err.message });
  }
});

// Get Spotify playlist recommendations for a message
router.get("/:messageId/playlists", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { limit = 5 } = req.query;

    // Find the message
    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Check if message has emotion analysis
    if (!message.emotionAnalysis) {
      return res.status(400).json({ 
        error: "Message must have emotion analysis to get playlist recommendations" 
      });
    }

    const emotion = message.emotionAnalysis.primaryEmotion;
    const accuracy = message.emotionAnalysis.accuracy.overall;

    // Get playlist recommendations
    const playlistData = await spotifyService.getPlaylistRecommendations(emotion, accuracy, parseInt(limit));

    if (playlistData.error) {
      return res.status(500).json({ error: playlistData.error });
    }

    res.json({
      message: {
        id: message._id,
        text: message.text,
        emotion: emotion,
        accuracy: accuracy,
        accuracyLevel: playlistData.accuracyLevel
      },
      playlists: playlistData.recommendations,
      metadata: {
        searchTerms: playlistData.searchTerms,
        intensityModifier: playlistData.intensityModifier,
        totalResults: playlistData.recommendations.length
      }
    });

  } catch (err) {
    console.error('Error getting playlist recommendations:', err);
    res.status(500).json({ 
      error: "Failed to get playlist recommendations", 
      details: err.message 
    });
  }
});

// Get Spotify playlists for any emotion and accuracy combination
router.post("/playlists/search", async (req, res) => {
  try {
    const { emotion, accuracy, limit = 5 } = req.body;

    // Validate input
    if (!emotion) {
      return res.status(400).json({ error: "Emotion is required" });
    }

    if (accuracy === undefined || accuracy < 0 || accuracy > 1) {
      return res.status(400).json({ error: "Accuracy must be a number between 0 and 1" });
    }

    // Get playlist recommendations
    const playlistData = await spotifyService.getPlaylistRecommendations(emotion, accuracy, parseInt(limit));

    if (playlistData.error) {
      return res.status(500).json({ error: playlistData.error });
    }

    res.json({
      query: { emotion, accuracy, limit },
      playlists: playlistData.recommendations,
      metadata: {
        accuracyLevel: playlistData.accuracyLevel,
        searchTerms: playlistData.searchTerms,
        intensityModifier: playlistData.intensityModifier,
        totalResults: playlistData.recommendations.length
      }
    });

  } catch (err) {
    console.error('Error searching playlists:', err);
    res.status(500).json({ 
      error: "Failed to search playlists", 
      details: err.message 
    });
  }
});

// Get Spotify track recommendations for any emotion and accuracy combination
router.post("/tracks/search", async (req, res) => {
  try {
    const { emotion, accuracy, limit = 10 } = req.body;

    // Validate input
    if (!emotion) {
      return res.status(400).json({ error: "Emotion is required" });
    }

    if (accuracy === undefined || accuracy < 0 || accuracy > 1) {
      return res.status(400).json({ error: "Accuracy must be a number between 0 and 1" });
    }

    // Get track recommendations
    const trackData = await spotifyService.getTrackRecommendations(emotion, accuracy, parseInt(limit));

    if (trackData.error) {
      return res.status(500).json({ error: trackData.error });
    }

    res.json({
      query: { emotion, accuracy, limit },
      tracks: trackData.tracks,
      metadata: {
        accuracyLevel: trackData.accuracyLevel,
        searchTerms: trackData.searchTerms,
        intensityModifier: trackData.intensityModifier,
        totalResults: trackData.tracks.length
      }
    });

  } catch (err) {
    console.error('Error searching tracks:', err);
    res.status(500).json({ 
      error: "Failed to search tracks", 
      details: err.message 
    });
  }
});

export default router;
