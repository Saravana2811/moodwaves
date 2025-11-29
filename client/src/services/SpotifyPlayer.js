// Spotify Web Playback SDK helper removed. Provide a no-op stub.

class SpotifyPlayerStub {
  async fetchToken() { return null; }
  async init() { return false; }
  isReady() { return false; }
  async playSpotifyUri() { return false; }
  async pause() { return false; }
  async resume() { return false; }
  async next() { return false; }
  async previous() { return false; }
}

export default new SpotifyPlayerStub();
