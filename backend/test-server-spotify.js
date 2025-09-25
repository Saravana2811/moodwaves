// Simple test to verify server startup and basic functionality
console.log('🎵 Testing Server Startup...\n');

async function testServerStartup() {
  try {
    // Test if server is running
    console.log('Testing server connection...');
    const response = await fetch('http://localhost:5000/api/messages', {
      method: 'GET'
    });
    
    if (response.ok) {
      console.log('✅ Server is running and responding!');
      const messages = await response.json();
      console.log(`📊 Found ${messages.length} messages in database`);
    } else {
      console.log('❌ Server responded with error:', response.status);
    }
    
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    console.log('💡 Make sure to run: node server.js in the backend folder');
  }
}

// Test emotion analysis
async function testEmotionAnalysis() {
  try {
    console.log('\n🧠 Testing emotion analysis with Spotify integration...');
    
    const testText = "I'm absolutely thrilled and excited about this amazing day!";
    
    const response = await fetch('http://localhost:5000/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        text: testText, 
        languages: ['English'] 
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Emotion analysis successful!');
      console.log(`📝 Text: "${testText}"`);
      console.log(`🎭 Primary Emotion: ${result.analysis.primaryEmotion}`);
      console.log(`📊 Accuracy: ${Math.round(result.analysis.accuracy.overall * 100)}%`);
      console.log(`💚 Sentiment: ${result.analysis.sentiment.label} (${result.analysis.sentiment.score.toFixed(2)})`);
      
      // Test Spotify track recommendations
      console.log('\n🎵 Testing Spotify track recommendations...');
      
      const playlistResponse = await fetch('http://localhost:5000/api/messages/tracks/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotion: result.analysis.primaryEmotion,
          accuracy: result.analysis.accuracy.overall,
          limit: 3
        })
      });
      
      if (playlistResponse.ok) {
        const playlistData = await playlistResponse.json();
        console.log('✅ Spotify integration working!');
        console.log(`🎧 Found ${playlistData.tracks.length} tracks for ${result.analysis.primaryEmotion} mood`);
        console.log(`🎯 Accuracy Level: ${playlistData.metadata.accuracyLevel}`);
        console.log(`🔥 Intensity: ${playlistData.metadata.intensityModifier}`);
        
        if (playlistData.tracks.length > 0) {
          console.log('\n🎵 Sample tracks:');
          playlistData.tracks.slice(0, 2).forEach((track, i) => {
            console.log(`   ${i + 1}. ${track.name} by ${track.artists[0]?.name}`);
          });
        }
      } else {
        const error = await playlistResponse.json();
        console.log('❌ Spotify integration error:', error.error);
      }
      
    } else {
      const error = await response.json();
      console.log('❌ Emotion analysis failed:', error.error);
    }
    
  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Run tests
async function runAllTests() {
  await testServerStartup();
  await testEmotionAnalysis();
  console.log('\n🎯 Test complete! If server is running, go to your frontend and try: "I am extremely happy!"');
}

runAllTests();