// Spotify client-side auth removed. This stub prevents runtime errors
// for any imports but does nothing.

export default {
  startAuth() { console.warn('Spotify auth removed'); },
  async handleCallbackIfNeeded() { return null; },
  getStoredToken() { return null; },
  clear() { /* no-op */ }
};
