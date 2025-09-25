// Simple server test to check imports
console.log('🔍 Testing imports...');

try {
  console.log('Testing express import...');
  const express = await import('express');
  console.log('✅ Express imported successfully');

  console.log('Testing mongoose import...');
  const mongoose = await import('mongoose');
  console.log('✅ Mongoose imported successfully');

  console.log('Testing emotion service import...');
  const emotionService = await import('./services/emotionAnalysisService.js');
  console.log('✅ Emotion analysis service imported successfully');

  console.log('Testing Spotify service import...');
  const spotifyService = await import('./services/spotifyService.js');
  console.log('✅ Spotify service imported successfully');

  console.log('Testing message routes import...');
  const messageRoutes = await import('./routes/messageRoutes.js');
  console.log('✅ Message routes imported successfully');

  console.log('\n🎯 All imports successful! Server should be able to start.');

} catch (error) {
  console.error('❌ Import error:', error.message);
  console.error('Stack:', error.stack);
}