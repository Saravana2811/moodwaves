// Spotify integration removed. This stub provides no-op implementations
// so other parts of the app that import this file won't crash.

export default {
  isConfigured() { return false; },
  async getAccessToken() { return null; },
  async searchTracks() { return []; },
  async searchTracksByMood() { return []; },
  async getMoodBasedTracks() { return []; }
};