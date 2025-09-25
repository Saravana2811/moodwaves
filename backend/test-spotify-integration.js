// Test Spotify integration
import spotifyService from '../services/spotifyService.js';

async function testSpotifyIntegration() {
  console.log('🎵 Testing Spotify Integration...\n');

  // Test cases with different emotions and accuracy levels
  const testCases = [
    { emotion: 'happy', accuracy: 0.85, description: 'High accuracy happy emotion' },
    { emotion: 'sad', accuracy: 0.65, description: 'Medium accuracy sad emotion' },
    { emotion: 'excited', accuracy: 0.45, description: 'Low accuracy excited emotion' },
    { emotion: 'calm', accuracy: 0.90, description: 'Very high accuracy calm emotion' }
  ];

  for (const testCase of testCases) {
    console.log(`\n--- ${testCase.description} ---`);
    console.log(`Emotion: ${testCase.emotion}, Accuracy: ${Math.round(testCase.accuracy * 100)}%`);

    try {
      // Test track recommendations
      console.log('\n🎵 Testing Track Recommendations:');
      const trackData = await spotifyService.getTrackRecommendations(
        testCase.emotion, 
        testCase.accuracy, 
        5
      );

      if (trackData.error) {
        console.error('❌ Track Error:', trackData.error);
      } else {
        console.log(`✅ Found ${trackData.tracks.length} tracks`);
        console.log(`📊 Accuracy Level: ${trackData.accuracyLevel}`);
        console.log(`🔥 Intensity: ${trackData.intensityModifier}`);
        
        // Show top 3 tracks
        trackData.tracks.slice(0, 3).forEach((track, i) => {
          console.log(`   ${i + 1}. ${track.name} by ${track.artists[0]?.name} (${track.matchScore}% match)`);
        });
      }

      // Test playlist recommendations  
      console.log('\n🎧 Testing Playlist Recommendations:');
      const playlistData = await spotifyService.getPlaylistRecommendations(
        testCase.emotion,
        testCase.accuracy,
        3
      );

      if (playlistData.error) {
        console.error('❌ Playlist Error:', playlistData.error);
      } else {
        console.log(`✅ Found ${playlistData.recommendations.length} playlists`);
        
        // Show top 2 playlists
        playlistData.recommendations.slice(0, 2).forEach((playlist, i) => {
          console.log(`   ${i + 1}. ${playlist.name} (${playlist.tracks} tracks, ${playlist.matchScore}% match)`);
        });
      }

    } catch (error) {
      console.error(`❌ Error testing ${testCase.description}:`, error.message);
    }

    // Wait a bit to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log('\n🎵 Spotify Integration Test Complete!');
}

// Run the test
testSpotifyIntegration().catch(console.error);