import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

class SpotifyService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;

    console.log('🎵 Spotify Service initialized');
    console.log('📱 Client ID configured:', this.clientId ? 'Yes' : 'No');
    console.log('🔐 Client Secret configured:', this.clientSecret ? 'Yes' : 'No');
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

  // Search tracks by mood and emotion - This works perfectly with Client Credentials
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
          limit: Math.min(limit * 2, 50),
          market: 'US'
        }
      });

      console.log(`📊 Found ${response.data.tracks.items.length} tracks for "${searchQuery}"`);
      const tracks = this.formatTracks(response.data.tracks.items);
      
      const filteredTracks = tracks
        .filter(track => track.popularity > 20)
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
      artists: track.artists || [],
      album: {
        name: track.album?.name || 'Unknown Album',
        images: track.album?.images || []
      },
      preview_url: track.preview_url,
      external_urls: track.external_urls || {},
      external_url: track.external_urls?.spotify || null,
      image: track.album?.images?.[0]?.url || null,
      duration_ms: track.duration_ms,
      popularity: track.popularity || 0,
      explicit: track.explicit || false,
      uri: track.uri || `spotify:track:${track.id}`
    }));
  }

  // Main method to get music recommendations (focuses on tracks, not playlists)
  async getRecommendations(emotion, accuracy, limit = 10) {
    console.log(`🎯 Getting ${limit} track recommendations for emotion: ${emotion} (accuracy: ${Math.round(accuracy * 100)}%)`);
    
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

  // Simplified track recommendations (no playlist access needed)
  async getTrackRecommendations(emotion, accuracy, limit = 10) {
    console.log(`🎯 Track recommendations for ${emotion} (${Math.round(accuracy * 100)}% accuracy)`);
    
    try {
      const result = await this.getRecommendations(emotion, accuracy, limit);
      
      if (result.success) {
        return {
          tracks: result.tracks,
          emotion: emotion,
          accuracy: accuracy,
          total: result.tracks.length,
          method: result.method
        };
      } else {
        return {
          tracks: [],
          error: 'No tracks found',
          emotion: emotion,
          accuracy: accuracy
        };
      }
    } catch (error) {
      console.error('❌ Error getting track recommendations:', error.message);
      return {
        tracks: [],
        error: error.message,
        emotion: emotion,
        accuracy: accuracy
      };
    }
  }
}

export default new SpotifyService();