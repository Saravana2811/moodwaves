// backend/services/emotionAnalysisService.js
import natural from 'natural';
import Sentiment from 'sentiment';
import compromise from 'compromise';

const sentiment = new Sentiment();

// Emotion keywords mapping
const emotionKeywords = {
  happy: ['happy', 'joy', 'joyful', 'glad', 'cheerful', 'delighted', 'content', 'pleased', 'elated', 'ecstatic', 'blissful', 'euphoric'],
  sad: ['sad', 'unhappy', 'depressed', 'melancholy', 'gloomy', 'sorrowful', 'downcast', 'dejected', 'heartbroken', 'miserable'],
  angry: ['angry', 'mad', 'furious', 'rage', 'irritated', 'annoyed', 'frustrated', 'livid', 'enraged', 'hostile', 'resentful'],
  fear: ['afraid', 'scared', 'fearful', 'anxious', 'worried', 'nervous', 'terrified', 'panicked', 'frightened', 'apprehensive'],
  surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'startled', 'stunned', 'bewildered', 'astounded'],
  disgust: ['disgusted', 'revolted', 'repulsed', 'sick', 'nauseated', 'appalled', 'horrified'],
  excited: ['excited', 'thrilled', 'enthusiastic', 'energetic', 'pumped', 'hyped', 'eager', 'passionate'],
  calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'composed', 'zen', 'balanced'],
  love: ['love', 'adore', 'cherish', 'affection', 'romantic', 'devoted', 'passionate', 'infatuated'],
  confident: ['confident', 'sure', 'certain', 'determined', 'assertive', 'bold', 'self-assured'],
  lonely: ['lonely', 'isolated', 'alone', 'solitary', 'abandoned', 'desolate', 'forlorn'],
  nostalgic: ['nostalgic', 'memories', 'reminisce', 'remember', 'miss', 'yearning', 'wistful']
};

// Language-specific processing
const processMultilingualText = (text, languages) => {
  // For now, we'll focus on English processing
  // In the future, this can be extended for other languages
  const doc = compromise(text);
  
  // Extract key linguistic features
  const adjectives = doc.adjectives().out('array');
  const verbs = doc.verbs().out('array');
  const nouns = doc.nouns().out('array');
  
  return {
    adjectives,
    verbs,
    nouns,
    sentences: doc.sentences().length,
    wordCount: doc.terms().length
  };
};

// Calculate emotion scores based on keyword matching
const calculateEmotionScores = (text, linguisticFeatures) => {
  const lowerText = text.toLowerCase();
  const emotions = {};
  const foundKeywords = [];
  
  // Calculate emotion scores based on keyword presence
  Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
    let score = 0;
    let matches = 0;
    
    keywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        matches++;
        foundKeywords.push(keyword);
        // Weight score based on word importance and frequency
        const frequency = (lowerText.split(keyword).length - 1);
        score += frequency * 0.1;
      }
    });
    
    // Normalize score based on text length and keyword density
    const normalizedScore = Math.min(score / Math.max(linguisticFeatures.wordCount * 0.1, 1), 1);
    emotions[emotion] = {
      confidence: normalizedScore,
      matches: matches
    };
  });
  
  return { emotions, keywords: foundKeywords };
};

// Enhanced text clarity calculation
const calculateTextClarity = (text, linguisticFeatures) => {
  const { wordCount, sentences } = linguisticFeatures;
  let clarity = 0.3; // Lower base score for more variation
  
  // Word count factor - more sophisticated scoring
  if (wordCount >= 3 && wordCount <= 5) {
    clarity += 0.2; // Very short but complete
  } else if (wordCount >= 6 && wordCount <= 15) {
    clarity += 0.35; // Optimal range
  } else if (wordCount >= 16 && wordCount <= 50) {
    clarity += 0.25; // Good range
  } else if (wordCount >= 51 && wordCount <= 100) {
    clarity += 0.15; // Getting verbose
  } else if (wordCount > 100) {
    clarity += 0.05; // Too verbose
  } else {
    clarity -= 0.1; // Too short (1-2 words)
  }
  
  // Sentence structure analysis
  if (sentences > 0) {
    const avgWordsPerSentence = wordCount / sentences;
    if (avgWordsPerSentence >= 4 && avgWordsPerSentence <= 12) {
      clarity += 0.2; // Well-structured sentences
    } else if (avgWordsPerSentence >= 13 && avgWordsPerSentence <= 20) {
      clarity += 0.1; // Moderately complex
    } else if (avgWordsPerSentence > 20) {
      clarity -= 0.1; // Run-on sentences
    }
  }
  
  // Emotional expression indicators
  const exclamations = (text.match(/!/g) || []).length;
  const questions = (text.match(/\?/g) || []).length;
  const emotionalPunctuation = exclamations + questions;
  
  if (emotionalPunctuation === 1) {
    clarity += 0.15; // Good emotional expression
  } else if (emotionalPunctuation === 2) {
    clarity += 0.1; // Moderate expression
  } else if (emotionalPunctuation > 2) {
    clarity -= 0.05; // Over-expressive
  }
  
  // Check for emotional intensity words
  const intensityWords = text.match(/\b(very|extremely|really|so|absolutely|totally|completely|incredibly|amazing|terrible|awful|wonderful|fantastic|horrible)\b/gi);
  if (intensityWords) {
    clarity += Math.min(intensityWords.length * 0.05, 0.15);
  }
  
  return Math.min(Math.max(clarity, 0.1), 1);
};

// Enhanced emotion confidence calculation
const calculateEmotionConfidence = (emotions, text, sentimentScore) => {
  if (!emotions || Object.keys(emotions).length === 0) {
    return 0.2; // Low confidence if no emotions detected
  }
  
  const emotionEntries = Object.entries(emotions);
  const topEmotion = emotionEntries.sort(([,a], [,b]) => b.confidence - a.confidence)[0];
  
  if (!topEmotion) return 0.2;
  
  let confidence = topEmotion[1].confidence;
  
  // Boost confidence based on text characteristics
  const textLower = text.toLowerCase();
  const emotionKeywords = {
    happy: ['happy', 'joy', 'glad', 'excited', 'wonderful', 'amazing', 'great', 'fantastic', 'love'],
    sad: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'heartbroken', 'disappointed'],
    angry: ['angry', 'furious', 'mad', 'annoyed', 'frustrated', 'irritated', 'hate'],
    fear: ['scared', 'afraid', 'anxious', 'worried', 'nervous', 'terrified', 'panic'],
    love: ['love', 'adore', 'cherish', 'care', 'affection', 'heart', 'romantic'],
    excited: ['excited', 'thrilled', 'pumped', 'energetic', 'enthusiastic'],
    calm: ['calm', 'peaceful', 'relaxed', 'serene', 'tranquil', 'zen'],
    confident: ['confident', 'sure', 'ready', 'capable', 'strong', 'determined']
  };
  
  const primaryEmotion = topEmotion[0];
  const keywords = emotionKeywords[primaryEmotion] || [];
  
  let keywordMatches = 0;
  keywords.forEach(keyword => {
    if (textLower.includes(keyword)) {
      keywordMatches++;
    }
  });
  
  // Boost confidence based on keyword matches
  if (keywordMatches >= 2) {
    confidence += 0.3;
  } else if (keywordMatches === 1) {
    confidence += 0.15;
  }
  
  // Consider sentiment alignment
  if (primaryEmotion === 'happy' && sentimentScore > 0.2) {
    confidence += 0.2;
  } else if (primaryEmotion === 'sad' && sentimentScore < -0.2) {
    confidence += 0.2;
  } else if (primaryEmotion === 'angry' && sentimentScore < -0.3) {
    confidence += 0.2;
  }
  
  // Multiple emotion detection reduces confidence
  const significantEmotions = emotionEntries.filter(([,data]) => data.confidence > 0.05);
  if (significantEmotions.length > 3) {
    confidence -= 0.1; // Mixed emotions reduce confidence
  }
  
  return Math.min(Math.max(confidence, 0.1), 1);
};

// Enhanced language processing calculation
const calculateLanguageProcessing = (text, languages, linguisticFeatures) => {
  let processing = 0.4; // Base score
  
  // Language complexity
  if (languages.includes('English')) {
    processing += 0.3; // Better processing for English
  } else {
    processing += 0.2; // Good processing for other languages
  }
  
  // Grammar and structure indicators
  const { wordCount } = linguisticFeatures;
  const capitalLetters = (text.match(/[A-Z]/g) || []).length;
  const properCapitalization = capitalLetters > 0 && capitalLetters <= wordCount * 0.3;
  
  if (properCapitalization) {
    processing += 0.15;
  }
  
  // Check for complete sentences
  const endsWithPunctuation = /[.!?]$/.test(text.trim());
  if (endsWithPunctuation) {
    processing += 0.1;
  }
  
  // Vocabulary richness
  const uniqueWords = new Set(text.toLowerCase().split(/\s+/)).size;
  const vocabularyRichness = uniqueWords / wordCount;
  
  if (vocabularyRichness > 0.8) {
    processing += 0.2; // Very diverse vocabulary
  } else if (vocabularyRichness > 0.6) {
    processing += 0.15; // Good vocabulary
  } else if (vocabularyRichness < 0.4) {
    processing -= 0.1; // Repetitive vocabulary
  }
  
  // Penalize very short or incoherent text
  if (wordCount < 3) {
    processing -= 0.2;
  }
  
  return Math.min(Math.max(processing, 0.1), 1);
};

// Main emotion analysis function
export const analyzeEmotion = (text, languages = ['English']) => {
  try {
    // Process text linguistically
    const linguisticFeatures = processMultilingualText(text, languages);
    
    // Perform sentiment analysis
    const sentimentResult = sentiment.analyze(text);
    
    // Use comparative score (normalized between -1 and 1) instead of raw score
    const sentimentScore = Math.max(-1, Math.min(1, sentimentResult.comparative));
    const sentimentComparative = sentimentResult.comparative;
    
    // Determine sentiment label
    let sentimentLabel = 'neutral';
    if (sentimentComparative > 0.1) sentimentLabel = 'positive';
    else if (sentimentComparative < -0.1) sentimentLabel = 'negative';
    
    // Calculate emotion scores
    const { emotions, keywords } = calculateEmotionScores(text, linguisticFeatures);
    
    // Find primary emotion (highest confidence)
    const sortedEmotions = Object.entries(emotions)
      .sort(([,a], [,b]) => b.confidence - a.confidence)
      .filter(([, data]) => data.confidence > 0);
    
    const primaryEmotion = sortedEmotions.length > 0 ? sortedEmotions[0][0] : 'neutral';
    
    // Calculate enhanced accuracy scores
    const textClarity = calculateTextClarity(text, linguisticFeatures);
    const emotionConfidence = calculateEmotionConfidence(emotions, text, sentimentScore);
    const languageProcessing = calculateLanguageProcessing(text, languages, linguisticFeatures);
    
    // Enhanced overall accuracy with weighted factors
    const overallAccuracy = (
      textClarity * 0.25 +           // Text quality and structure
      emotionConfidence * 0.45 +     // Emotion detection confidence
      languageProcessing * 0.30      // Language processing quality
    );
    
    // Format emotion results
    const formattedEmotions = sortedEmotions.slice(0, 5).map(([emotion, data]) => ({
      emotion,
      confidence: Math.round(data.confidence * 1000) / 1000 // Round to 3 decimal places
    }));
    
    return {
      primaryEmotion,
      emotions: formattedEmotions,
      sentiment: {
        score: sentimentScore,
        comparative: Math.round(sentimentComparative * 1000) / 1000,
        label: sentimentLabel
      },
      accuracy: {
        overall: Math.round(overallAccuracy * 1000) / 1000,
        textClarity: Math.round(textClarity * 1000) / 1000,
        emotionConfidence: Math.round(emotionConfidence * 1000) / 1000,
        languageProcessing: Math.round(languageProcessing * 1000) / 1000
      },
      keywords: [...new Set(keywords)], // Remove duplicates
      processedAt: new Date()
    };
    
  } catch (error) {
    console.error('Error in emotion analysis:', error);
    throw error;
  }
};

// Batch analyze multiple messages
export const batchAnalyzeEmotions = async (messages) => {
  const results = [];
  
  for (const message of messages) {
    try {
      const analysis = analyzeEmotion(message.text, message.languages);
      results.push({
        messageId: message._id,
        analysis
      });
    } catch (error) {
      console.error(`Error analyzing message ${message._id}:`, error);
      results.push({
        messageId: message._id,
        error: error.message
      });
    }
  }
  
  return results;
};