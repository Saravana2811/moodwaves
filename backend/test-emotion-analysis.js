// backend/test-emotion-analysis.js
import { analyzeEmotion } from './services/emotionAnalysisService.js';

// Test different types of emotional texts
const testTexts = [
  "I am so happy and excited today! Everything is going wonderful!",
  "I feel really sad and depressed. Nothing seems to be working out.",
  "I'm furious about what happened at work today. This is so annoying!",
  "I'm scared and anxious about the upcoming presentation tomorrow.",
  "I love spending time with my family. They mean everything to me.",
  "I feel so lonely and isolated from everyone around me.",
  "This brings back so many beautiful memories from my childhood.",
  "I'm confident and ready to take on any challenge that comes my way.",
  "The weather is nice today."
];

console.log('🧠 Testing Emotion Analysis Service\n');
console.log('='.repeat(60));

testTexts.forEach((text, index) => {
  console.log(`\nTest ${index + 1}:`);
  console.log(`Text: "${text}"`);
  console.log('-'.repeat(50));
  
  try {
    const analysis = analyzeEmotion(text, ['English']);
    
    console.log(`Primary Emotion: ${analysis.primaryEmotion}`);
    console.log(`Sentiment: ${analysis.sentiment.label} (score: ${analysis.sentiment.score})`);
    console.log(`Overall Accuracy: ${Math.round(analysis.accuracy.overall * 100)}%`);
    
    if (analysis.emotions.length > 0) {
      console.log('Top Emotions:');
      analysis.emotions.slice(0, 3).forEach(emotion => {
        console.log(`  - ${emotion.emotion}: ${Math.round(emotion.confidence * 100)}%`);
      });
    }
    
    if (analysis.keywords.length > 0) {
      console.log(`Keywords: ${analysis.keywords.join(', ')}`);
    }
    
  } catch (error) {
    console.error(`Error analyzing text: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(60));
console.log('✅ Emotion Analysis Testing Complete!');