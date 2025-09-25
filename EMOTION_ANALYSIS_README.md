# MoodWaves - NLP Emotion Analysis System

## Overview

MoodWaves now includes advanced NLP-powered emotion analysis that fetches sentences from the database, analyzes human emotions using sophisticated algorithms, and provides accuracy scores based on multiple factors.

## Features Implemented

### 🧠 Emotion Analysis Engine
- **Multi-emotion Detection**: Identifies 12 different emotions (happy, sad, angry, fear, surprise, disgust, excited, calm, love, confident, lonely, nostalgic)
- **Sentiment Analysis**: Provides positive/negative/neutral sentiment scores
- **Keyword Extraction**: Identifies emotional keywords from text
- **Multi-language Support**: Supports English, Tamil, Hindi, Telugu, Malayalam, and Kanadam

### 📊 Accuracy Scoring System
The accuracy score is calculated based on four key factors:

1. **Text Clarity** (30% weight)
   - Text length optimization (5-150 words)
   - Sentence structure quality
   - Emotional punctuation presence

2. **Emotion Confidence** (40% weight)
   - Keyword matching strength
   - Emotion detection confidence levels
   - Context understanding

3. **Language Processing** (30% weight)
   - Language support quality
   - Text preprocessing effectiveness

4. **Overall Accuracy**
   - Combined score from all factors
   - Ranges from 0-100%

### 🎯 API Endpoints

#### Save Message with Emotion Analysis
```
POST /api/messages
Body: {
  "text": "I'm feeling really happy today!",
  "languages": ["English"]
}
```

#### Get Message Analysis
```
GET /api/messages/:id/analysis
```

#### Re-analyze Message
```
POST /api/messages/:id/reanalyze
```

#### Batch Analyze Messages
```
POST /api/messages/batch-analyze
Body: {
  "messageIds": ["id1", "id2", "id3"]
}
```

#### Get Emotion Statistics
```
GET /api/messages/stats/emotions
```

### 🎨 Frontend Components

#### Enhanced Input Box
- Real-time emotion analysis display
- Visual emotion indicators with color coding
- Accuracy score breakdown
- Sentiment analysis results
- Emotional keyword highlighting

#### Emotion Analytics Dashboard
- **Overview Tab**: 
  - Total messages analyzed
  - Average accuracy score
  - Emotion distribution charts
  - Sentiment analysis breakdown
  - Top emotional keywords

- **History Tab**:
  - Complete analysis history
  - Individual message results
  - Timestamp tracking
  - Accuracy trends

### 🎨 Visual Design

#### Emotion Color Coding
- Happy: Gold (#FFD700)
- Sad: Steel Blue (#4682B4)
- Angry: Crimson (#DC143C)
- Fear: Dark Magenta (#8B008B)
- Surprise: Dark Orange (#FF8C00)
- Excited: Deep Pink (#FF1493)
- Calm: Light Sea Green (#20B2AA)
- Love: Hot Pink (#FF69B4)
- Confident: Royal Blue (#4169E1)
- Lonely: Dim Gray (#696969)
- Nostalgic: Plum (#DDA0DD)

#### Sentiment Colors
- Positive: Green (#22C55E)
- Negative: Red (#EF4444)
- Neutral: Gray (#6B7280)

## Database Schema

### Enhanced Message Model
```javascript
{
  text: String,
  languages: [String],
  emotionAnalysis: {
    primaryEmotion: String,
    emotions: [{
      emotion: String,
      confidence: Number (0-1)
    }],
    sentiment: {
      score: Number (-∞ to +∞),
      comparative: Number (-1 to +1),
      label: String (positive/negative/neutral)
    },
    accuracy: {
      overall: Number (0-1),
      textClarity: Number (0-1),
      emotionConfidence: Number (0-1),
      languageProcessing: Number (0-1)
    },
    keywords: [String],
    processedAt: Date
  },
  createdAt: Date
}
```

## Testing

Run the emotion analysis test:
```bash
cd backend
node test-emotion-analysis.js
```

## Usage Examples

### Basic Usage
1. User enters: "I'm so excited about my graduation tomorrow!"
2. System analyzes and returns:
   - Primary Emotion: excited
   - Sentiment: positive (score: 3)
   - Accuracy: 89%
   - Keywords: excited, graduation

### Advanced Analytics
- View emotion trends over time
- Analyze sentiment patterns
- Track accuracy improvements
- Monitor most common emotions

## Accuracy Improvements

The system continuously improves accuracy through:
- Enhanced keyword dictionaries
- Context-aware processing
- Multi-factor scoring
- Language-specific optimizations

## Future Enhancements

- Machine learning model integration
- Advanced NLP libraries (spaCy, transformers)
- Real-time emotion tracking
- Personalized emotion profiles
- Multi-modal analysis (text + voice/image)