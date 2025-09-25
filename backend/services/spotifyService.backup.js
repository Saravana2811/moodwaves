import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class SpotifyService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID ;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;

    // Log credentials status (without exposing secrets)
    console.log('🎵 Spotify Service initialized');
    console.log('📱 Client ID configured:', this.clientId ? 'Yes' : 'No');
    console.log('� Client Secret configured:', this.clientSecret ? 'Yes' : 'No');
  }

  // Get Spotify access token using Client Credentials flow
  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const tokenUrl = 'https://accounts.spotify.com/api/token';
      console.log('🔑 Requesting Spotify token from:', tokenUrl);
      
      const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(tokenUrl, 
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      console.log('✅ Spotify token obtained successfully');
      return this.accessToken;
    } catch (error) {
      console.error('❌ Error getting Spotify access token:', error.response?.data || error.message);
      return null;
    }
  }

  // Main method to get music recommendations - Focus on tracks instead of playlists
  async getRecommendations(emotion, accuracy, limit = 10) {
    console.log(`🎯 Getting ${limit} track recommendations for emotion: ${emotion} (accuracy: ${Math.round(accuracy * 100)}%)`);
    
    // Use track search which works with Client Credentials
    const tracks = await this.searchTracksByMood('', emotion, limit);
    
    if (tracks.length > 0) {
      console.log(`✅ Successfully found ${tracks.length} tracks for ${emotion} mood`);
      return {
        success: true,
        tracks: tracks,
        emotion: emotion,
        accuracy: accuracy,
        method: 'track-search'
      };
    } else {
      console.log(`⚠️ No tracks found for ${emotion} mood, trying alternative search`);
      
      // Try broader search if specific emotion fails
      const fallbackTracks = await this.searchTracksByMood('music', emotion, limit);
      return {
        success: fallbackTracks.length > 0,
        tracks: fallbackTracks,
        emotion: emotion,
        accuracy: accuracy,
        method: 'fallback-search'
      };
    }
  }

  // Enhanced emotion-to-audio-features mapping for Spotify accuracy
  getEmotionAudioFeatures(emotion, intensity = 0.5) {
    const emotionFeatures = {
      'happy': { valence: 0.8, energy: 0.7, danceability: 0.6, mode: 1, tempo: 120 },
      'joy': { valence: 0.85, energy: 0.75, danceability: 0.7, mode: 1, tempo: 125 },
      'sad': { valence: 0.2, energy: 0.3, acousticness: 0.6, mode: 0, tempo: 80 },
      'sadness': { valence: 0.15, energy: 0.25, acousticness: 0.7, mode: 0, tempo: 75 },
      'angry': { valence: 0.3, energy: 0.9, loudness: -5, mode: 0, tempo: 140 },
      'anger': { valence: 0.25, energy: 0.95, loudness: -4, mode: 0, tempo: 145 },
      'fear': { valence: 0.2, energy: 0.4, instrumentalness: 0.5, mode: 0, tempo: 90 },
      'surprise': { valence: 0.6, energy: 0.6, danceability: 0.5, tempo: 110 },
      'disgust': { valence: 0.2, energy: 0.5, mode: 0, tempo: 95 },
      'calm': { valence: 0.5, energy: 0.3, acousticness: 0.7, instrumentalness: 0.3, tempo: 85 },
      'excited': { valence: 0.8, energy: 0.9, danceability: 0.8, tempo: 130 },
      'romantic': { valence: 0.7, energy: 0.4, acousticness: 0.4, instrumentalness: 0.2, tempo: 90 },
      'love': { valence: 0.75, energy: 0.45, acousticness: 0.3, tempo: 95 },
      'melancholic': { valence: 0.2, energy: 0.3, acousticness: 0.8, mode: 0, tempo: 70 },
      'confident': { valence: 0.7, energy: 0.8, danceability: 0.6, tempo: 115 },
      'lonely': { valence: 0.25, energy: 0.35, acousticness: 0.6, instrumentalness: 0.4, tempo: 75 },
      'nostalgic': { valence: 0.4, energy: 0.4, acousticness: 0.5, tempo: 85 }
    };

    let features = emotionFeatures[emotion.toLowerCase()] || emotionFeatures['calm'];
    
    // Adjust features based on intensity
    const intensityModifier = (intensity - 0.5) * 0.3;
    features = { ...features };
    
    if (features.valence !== undefined) {
      features.valence = Math.max(0, Math.min(1, features.valence + intensityModifier));
    }
    if (features.energy !== undefined) {
      features.energy = Math.max(0, Math.min(1, features.energy + intensityModifier));
    }
    if (features.tempo !== undefined) {
      features.tempo = Math.max(50, Math.min(200, features.tempo + (intensityModifier * 30)));
    }

    return features;
  }

  // Get genre seeds based on emotion for more accurate matching
  getGenreSeeds(emotion) {
    const genreMapping = {
      'happy': 'pop,dance,funk,indie-pop',
      'joy': 'pop,dance,disco,reggae',
      'sad': 'blues,folk,indie,singer-songwriter',
      'sadness': 'blues,alternative,indie-folk,ambient',
      'angry': 'rock,metal,punk,hard-rock',
      'anger': 'metal,hardcore,punk,industrial',
      'calm': 'ambient,chill,acoustic,new-age',
      'excited': 'electronic,dance,edm,house',
      'romantic': 'soul,r-n-b,jazz,pop',
      'love': 'r-n-b,soul,indie-pop,jazz',
      'fear': 'dark-ambient,post-rock,experimental',
      'confident': 'hip-hop,rock,pop,electronic',
      'lonely': 'indie,folk,alternative,singer-songwriter',
      'nostalgic': 'oldies,classic-rock,retro,indie'
    };
    
    return genreMapping[emotion.toLowerCase()] || 'pop,indie,alternative';
  }

  // Get song recommendations based on emotion using Spotify's Recommendations API
  async getRecommendationsByEmotion(emotion, intensity = 0.5, limit = 20) {
    const token = await this.getAccessToken();
    if (!token) throw new Error('Unable to get Spotify access token');

    const audioFeatures = this.getEmotionAudioFeatures(emotion, intensity);
    const genres = this.getGenreSeeds(emotion);
    
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        market: 'US',
        seed_genres: genres,
        ...Object.fromEntries(
          Object.entries(audioFeatures).map(([key, value]) => [`target_${key}`, value.toString()])
        )
      });

      const response = await axios.get(`https://api.spotify.com/v1/recommendations?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      return this.formatTracks(response.data.tracks);
    } catch (error) {
      console.error('Spotify recommendations error:', error.response?.data || error.message);
      // Fallback to search-based recommendations
      return await this.searchTracksByMood('', emotion, limit);
    }
  }

  // Get audio features for multiple tracks to improve matching accuracy
  async getAudioFeatures(trackIds) {
    const token = await this.getAccessToken();
    if (!token || !trackIds.length) return [];
    
    try {
      // Split into chunks of 100 (Spotify API limit)
      const chunks = [];
      for (let i = 0; i < trackIds.length; i += 100) {
        chunks.push(trackIds.slice(i, i + 100));
      }

      const allFeatures = [];
      for (const chunk of chunks) {
        const response = await axios.get(`https://api.spotify.com/v1/audio-features`, {
          headers: { 'Authorization': `Bearer ${token}` },
          params: { ids: chunk.join(',') }
        });
        allFeatures.push(...response.data.audio_features);
      }

      return allFeatures.filter(f => f !== null); // Remove null values
    } catch (error) {
      console.error('Audio features error:', error.response?.data || error.message);
      return [];
    }
  }

  // Search tracks by mood and genre with enhanced filtering
  async searchTracksByMood(query, emotion, limit = 20) {
    const token = await this.getAccessToken();
    if (!token) return [];
    
    const moodKeywords = {
      'happy': 'happy upbeat cheerful positive joyful',
      'joy': 'joyful celebration euphoric blissful',
      'sad': 'sad melancholy blues heartbreak sorrow',
      'sadness': 'sadness melancholic depressing emotional',
      'angry': 'aggressive intense rock metal fury',
      'anger': 'anger rage furious mad hostile',
      'calm': 'chill relaxing ambient peaceful serene',
      'excited': 'energetic party dance electronic pump',
      'romantic': 'love romantic ballad intimate tender',
      'love': 'love affection romantic passion devoted',
      'fear': 'dark atmospheric haunting suspense',
      'confident': 'confident powerful strong determined',
      'lonely': 'lonely isolation solitude melancholy',
      'nostalgic': 'nostalgic memories vintage retro classic'
    };

    const searchQuery = query ? `${query} ${moodKeywords[emotion] || ''}` : moodKeywords[emotion] || emotion;
    const searchUrl = 'https://api.spotify.com/v1/search';
    
    console.log(`🎵 Searching tracks: "${searchQuery}" at ${searchUrl}`);
    
    try {
      const response = await axios.get(searchUrl, {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          q: searchQuery,
          type: 'track',
          limit: Math.min(limit * 2, 50), // Get more results to filter from
          market: 'US'
        }
      });

      console.log(`📊 Found ${response.data.tracks.items.length} tracks for "${searchQuery}"`);
      const tracks = this.formatTracks(response.data.tracks.items);
      
      // Apply additional filtering based on track popularity and features
      const filteredTracks = tracks
        .filter(track => track.popularity > 20) // Filter out very unpopular tracks
        .slice(0, limit);
      
      console.log(`✅ Returning ${filteredTracks.length} filtered tracks`);
      return filteredTracks;
        
    } catch (error) {
      console.error('❌ Search tracks error:', error.response?.data || error.message);
      return [];
    }
  }

  // Format tracks to consistent structure
  formatTracks(tracks) {
    return tracks.map(track => ({
      id: track.id,
      name: track.name,
      artist: track.artists?.map(a => a.name).join(', ') || 'Unknown Artist',
      artists: track.artists || [], // Keep full artists array for frontend
      album: {
        name: track.album?.name || 'Unknown Album',
        images: track.album?.images || []
      },
      preview_url: track.preview_url,
      external_urls: track.external_urls || {},
      external_url: track.external_urls?.spotify || null, // Add both formats
      image: track.album?.images?.[0]?.url || null,
      duration_ms: track.duration_ms,
      popularity: track.popularity || 0,
      explicit: track.explicit || false,
      uri: track.uri || `spotify:track:${track.id}` // Ensure URI is always present
    }));
  }

  // Get playlist search parameters based on emotion and accuracy
  getPlaylistSearchParams(emotion, accuracy) {
    const accuracyLevel = accuracy >= 0.8 ? 'high' : accuracy >= 0.6 ? 'medium' : 'low';
    const intensityModifier = accuracy * 1.5; // Scale intensity based on accuracy

    const baseSearchTerms = {
      'happy': ['happy music', 'upbeat songs', 'feel good playlist', 'positive vibes'],
      'joy': ['joyful music', 'celebration songs', 'euphoric playlist', 'blissful tunes'],
      'sad': ['sad music', 'melancholy songs', 'heartbreak playlist', 'emotional ballads'],
      'sadness': ['sadness playlist', 'depressing music', 'sorrowful songs', 'tear jerker'],
      'angry': ['angry music', 'aggressive songs', 'rage playlist', 'furious beats'],
      'anger': ['anger management', 'hostile music', 'mad songs', 'fury playlist'],
      'calm': ['calm music', 'relaxing songs', 'peaceful playlist', 'serene sounds'],
      'excited': ['excited music', 'energetic songs', 'pump up playlist', 'party beats'],
      'romantic': ['romantic music', 'love songs', 'intimate playlist', 'tender ballads'],
      'love': ['love music', 'affectionate songs', 'passionate playlist', 'devoted tunes'],
      'fear': ['dark music', 'atmospheric songs', 'suspenseful playlist', 'haunting sounds'],
      'confident': ['confident music', 'empowering songs', 'strong playlist', 'powerful beats'],
      'lonely': ['lonely music', 'isolation songs', 'solitude playlist', 'melancholy tunes'],
      'nostalgic': ['nostalgic music', 'throwback songs', 'vintage playlist', 'retro hits']
    };

    const searchTerms = baseSearchTerms[emotion.toLowerCase()] || baseSearchTerms['calm'];

    return {
      searchTerms,
      accuracyLevel,
      intensityModifier
    };
  }

  // Get playlist recommendations based on emotion and accuracy
  async getPlaylistRecommendations(emotion, accuracy, limit = 5) {
    const token = await this.getAccessToken();
    if (!token) {
      return { error: 'Unable to authenticate with Spotify' };
    }

    const { searchTerms, accuracyLevel, intensityModifier } = this.getPlaylistSearchParams(emotion, accuracy);
    const recommendations = [];

    try {
      // Search for playlists using different search terms
      for (let i = 0; i < Math.min(searchTerms.length, 3); i++) {
        const searchQuery = searchTerms[i];
        const searchUrl = 'https://api.spotify.com/v1/search';
        
        console.log(`🔍 Searching playlists: "${searchQuery}" at ${searchUrl}`);
        
        const response = await axios.get(searchUrl, {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            q: searchQuery,
            type: 'playlist',
            limit: 10,
            market: 'US'
          }
        });

        console.log(`📊 Found ${response.data.playlists.items.length} playlists for "${searchQuery}"`);

        if (response.data.playlists.items.length > 0) {
          // Filter and format playlists - Fix null tracks error
          const playlists = response.data.playlists.items
            .filter(playlist => {
              if (!playlist || !playlist.tracks) {
                console.warn('⚠️ Playlist with null tracks found:', playlist?.name || 'Unknown');
                return false;
              }
              return playlist.tracks.total > 10;
            }) // Only playlists with decent number of tracks
            .slice(0, 2) // Take top 2 from each search
            .map(playlist => ({
              id: playlist.id,
              name: playlist.name,
              description: playlist.description || `Perfect for ${emotion} mood`,
              url: playlist.external_urls?.spotify || `https://open.spotify.com/playlist/${playlist.id}`,
              image: playlist.images?.[0]?.url || null,
              tracks: playlist.tracks?.total || 0,
              owner: playlist.owner?.display_name || 'Unknown',
              accuracyMatch: accuracyLevel,
              emotionMatch: emotion,
              searchQuery,
              matchScore: this.calculateMatchScore(playlist, emotion, accuracy)
            }));

          recommendations.push(...playlists);
        }
      }

      // Sort by match score and remove duplicates
      const uniqueRecommendations = recommendations
        .filter((playlist, index, self) => 
          index === self.findIndex(p => p.id === playlist.id)
        )
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      return {
        recommendations: uniqueRecommendations,
        emotion: emotion,
        accuracy: accuracy,
        accuracyLevel: accuracyLevel,
        intensityModifier: intensityModifier,
        searchTerms: searchTerms
      };

    } catch (error) {
      console.error('Error searching Spotify playlists:', error.response?.data || error.message);
      return { 
        error: 'Unable to fetch playlist recommendations',
        recommendations: []
      };
    }
  }

  // Calculate how well a playlist matches the emotion and accuracy
  calculateMatchScore(playlist, emotion, accuracy) {
    let score = 0;
    const name = playlist.name.toLowerCase();
    const description = (playlist.description || '').toLowerCase();
    
    // Emotion matching
    if (name.includes(emotion.toLowerCase())) score += 30;
    if (description.includes(emotion.toLowerCase())) score += 20;
    
    // Accuracy-based intensity matching
    if (accuracy >= 0.8) {
      // High accuracy - look for intense/strong keywords
      if (name.match(/intense|strong|powerful|extreme|deep/)) score += 25;
    } else if (accuracy >= 0.6) {
      // Medium accuracy - look for moderate keywords
      if (name.match(/moderate|good|nice|pleasant|decent/)) score += 20;
    } else {
      // Low accuracy - look for gentle/soft keywords
      if (name.match(/soft|gentle|calm|quiet|chill|ambient/)) score += 25;
    }
    
    // Popular playlists get slight boost
    if (playlist.tracks > 100) score += 10;
    if (playlist.tracks > 1000) score += 5;
    
    // Penalize very long playlist names (often spam)
    if (playlist.name.length > 50) score -= 5;
    
    return score;
  }

  // Search for individual tracks based on emotion and accuracy
  async getTrackRecommendations(emotion, accuracy, limit = 10) {
    const token = await this.getAccessToken();
    if (!token) {
      return { error: 'Unable to authenticate with Spotify' };
    }

    const { searchTerms, accuracyLevel, intensityModifier } = this.getPlaylistSearchParams(emotion, accuracy);
    const tracks = [];

    try {
      // Search for tracks using different search terms
      for (let i = 0; i < Math.min(searchTerms.length, 2); i++) {
        const searchQuery = searchTerms[i];
        
        const response = await axios.get('https://api.spotify.com/v1/search', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            q: searchQuery,
            type: 'track',
            limit: 15,
            market: 'US'
          }
        });

        if (response.data.tracks.items.length > 0) {
          // Filter and format tracks using the consistent formatTracks method
          const trackItems = this.formatTracks(
            response.data.tracks.items
              .filter(track => track.preview_url) // Only tracks with preview
              .slice(0, 5) // Take top 5 from each search
          ).map(track => ({
            ...track,
            accuracyMatch: accuracyLevel,
            emotionMatch: emotion,
            searchQuery,
            matchScore: this.calculateTrackMatchScore(track, emotion, accuracy)
          }));

          tracks.push(...trackItems);
        }
      }

      // Sort by match score and remove duplicates
      const uniqueTracks = tracks
        .filter((track, index, self) => 
          index === self.findIndex(t => t.id === track.id)
        )
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, limit);

      return {
        tracks: uniqueTracks,
        emotion: emotion,
        accuracy: accuracy,
        accuracyLevel: accuracyLevel,
        intensityModifier: intensityModifier,
        searchTerms: searchTerms
      };

    } catch (error) {
      console.error('Error searching Spotify tracks:', error.response?.data || error.message);
      return { 
        error: 'Unable to fetch track recommendations',
        tracks: []
      };
    }
  }

  // Calculate how well a track matches the emotion and accuracy
  calculateTrackMatchScore(track, emotion, accuracy) {
    let score = 0;
    const name = track.name.toLowerCase();
    const artistNames = track.artists.map(a => a.name.toLowerCase()).join(' ');
    const albumName = track.album.name.toLowerCase();
    
    // Emotion matching in track name and artist
    if (name.includes(emotion.toLowerCase())) score += 25;
    if (artistNames.includes(emotion.toLowerCase())) score += 15;
    if (albumName.includes(emotion.toLowerCase())) score += 10;
    
    // Accuracy-based intensity matching
    if (accuracy >= 0.8) {
      // High accuracy - look for intense/energetic keywords
      if (name.match(/intense|power|energy|fire|strong|hard|heavy|loud/)) score += 20;
      if (track.popularity > 70) score += 15; // Popular high-energy tracks
    } else if (accuracy >= 0.6) {
      // Medium accuracy - look for moderate keywords
      if (name.match(/good|nice|feel|love|heart|soul|mind/)) score += 15;
      if (track.popularity > 50 && track.popularity <= 70) score += 10;
    } else {
      // Low accuracy - look for gentle/soft keywords
      if (name.match(/soft|gentle|quiet|calm|peace|still|slow|acoustic/)) score += 20;
      if (track.popularity <= 50) score += 10; // Less mainstream, more ambient
    }
    
    // Bonus for having preview URL
    if (track.preview_url) score += 5;
    
    // Penalty for explicit content in calm moods
    if (track.explicit && (emotion === 'calm' || emotion === 'peaceful')) score -= 5;
    
    return score;
  }

  // Get detailed playlist information
  async getPlaylistDetails(playlistId) {
    const token = await this.getAccessToken();
    if (!token) return null;

    try {
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      console.error('Error getting playlist details:', error.response?.data || error.message);
      return null;
    }
  }
}

export default new SpotifyService();