import React, { useState, useEffect, useRef } from 'react';
import './SpotifyPlayer.css';

const SpotifyPlayer = ({ message, accuracy, emotion }) => {
  const [tracks, setTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Get tracks based on emotion and accuracy
  const getTrackRecommendations = async () => {
    if (!emotion || accuracy === undefined) return;
    
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/messages/tracks/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emotion, accuracy, limit: 6 })
      });
      
      const data = await response.json();
      if (data.tracks) {
        console.log('🎵 Received tracks:', data.tracks);
        setTracks(data.tracks);
        if (data.tracks.length > 0) {
          setSelectedTrack(data.tracks[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching tracks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (emotion && accuracy !== undefined) {
      getTrackRecommendations();
    }
  }, [emotion, accuracy]);

  // Get Spotify embed URL
  const getSpotifyEmbedUrl = (track) => {
    if (!track) return null;
    
    let trackId = null;
    
    if (track.uri && track.uri.includes('spotify:track:')) {
      trackId = track.uri.split(':').pop();
    } else if (track.id) {
      trackId = track.id;
    } else if (track.external_urls?.spotify) {
      const matches = track.external_urls.spotify.match(/track\/([a-zA-Z0-9]+)/);
      if (matches) trackId = matches[1];
    }
    
    if (trackId) {
      return `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0&autoplay=1&hide=0`;
    }
    
    return null;
  };

  // Get Spotify web URL
  const getSpotifyWebUrl = (track) => {
    if (!track) return null;
    
    if (track.external_urls?.spotify) {
      return track.external_urls.spotify;
    }
    
    let trackId = null;
    if (track.uri && track.uri.includes('spotify:track:')) {
      trackId = track.uri.split(':').pop();
    } else if (track.id) {
      trackId = track.id;
    }
    
    if (trackId) {
      return `https://open.spotify.com/track/${trackId}`;
    }
    
    return null;
  };

  // Play audio preview
  const playPreview = (track) => {
    console.log('🎵 Attempting to play preview for:', track);
    
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
      setCurrentTime(0);
    }

    // Try preview_url first
    if (track.preview_url) {
      console.log('🎵 Using preview_url:', track.preview_url);
      const audio = new Audio(track.preview_url);
      
      audio.addEventListener('loadedmetadata', () => {
        setDuration(audio.duration);
      });

      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        setCurrentTime(0);
      });

      audio.play().then(() => {
        console.log('🎵 Preview playing successfully!');
        setCurrentAudio(audio);
        setIsPlaying(true);
        setSelectedTrack(track);
      }).catch(e => {
        console.warn('Preview playback failed:', e);
        // Fallback to Spotify web
        openSpotifyWeb(track);
      });
    } else {
      console.log('🎵 No preview_url, opening Spotify web');
      openSpotifyWeb(track);
    }
  };

  // Open in Spotify web
  const openSpotifyWeb = (track) => {
    const webUrl = getSpotifyWebUrl(track);
    if (webUrl) {
      console.log('🎵 Opening Spotify web:', webUrl);
      window.open(webUrl, '_blank');
      setSelectedTrack(track);
    } else {
      console.error('No Spotify URL available for track:', track);
    }
  };

  // Stop current playback
  const stopPlayback = () => {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Format time display
  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{
        background: "linear-gradient(135deg, #1DB954, #1ED760)",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        color: "white",
        textAlign: "center"
      }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "10px" }}>🎵</div>
        <div>Finding the perfect songs for your {emotion} mood...</div>
      </div>
    );
  }

  if (!tracks.length) {
    return null;
  }

  return (
    <div style={{
      background: "linear-gradient(135deg, #1DB954, #1ED760)",
      padding: "20px",
      borderRadius: "12px",
      marginTop: "20px",
      color: "white",
      boxShadow: "0 4px 15px rgba(29, 185, 84, 0.3)"
    }}>
      {/* Header */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "20px"
      }}>
        <div style={{ fontSize: "1.8rem" }}>🎵</div>
        <div>
          <div style={{ fontSize: "16px", fontWeight: "700" }}>
            Music for Your {emotion.charAt(0).toUpperCase() + emotion.slice(1)} Mood
          </div>
          <div style={{ fontSize: "12px", opacity: "0.9" }}>
            Based on {Math.round(accuracy * 100)}% emotion accuracy
          </div>
        </div>
      </div>

      {/* Now Playing Section */}
      {selectedTrack && (
        <div style={{
          background: "rgba(0,0,0,0.3)",
          borderRadius: "12px",
          padding: "15px",
          marginBottom: "20px",
          border: isPlaying ? "2px solid #1DB954" : "2px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "10px"
          }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: "700" }}>
                {isPlaying ? '🎵 NOW PLAYING' : '🎵 READY TO PLAY'}
              </div>
              <div style={{ fontSize: "16px", fontWeight: "bold", marginTop: "5px" }}>
                {selectedTrack.name}
              </div>
              <div style={{ fontSize: "14px", opacity: "0.9" }}>
                by {selectedTrack.artist}
              </div>
            </div>
            
            {isPlaying && (
              <div style={{
                fontSize: "12px",
                color: "#1DB954",
                fontWeight: "600",
                background: "rgba(29, 185, 84, 0.2)",
                padding: "4px 8px",
                borderRadius: "12px"
              }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            )}
          </div>

          {/* Playback Controls */}
          <div style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            marginBottom: "15px"
          }}>
            {selectedTrack.preview_url ? (
              <>
                <button
                  onClick={() => playPreview(selectedTrack)}
                  disabled={isPlaying}
                  style={{
                    background: isPlaying ? "#666" : "#1DB954",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    cursor: isPlaying ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    fontWeight: "600"
                  }}
                >
                  {isPlaying ? '🎵 Playing...' : '▶️ Play Preview (30s)'}
                </button>
                
                {isPlaying && (
                  <button
                    onClick={stopPlayback}
                    style={{
                      background: "#e74c3c",
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "20px",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontWeight: "600"
                    }}
                  >
                    ⏹️ Stop
                  </button>
                )}
              </>
            ) : (
              <div style={{
                fontSize: "12px",
                opacity: "0.8",
                padding: "8px 16px",
                background: "rgba(255,255,255,0.1)",
                borderRadius: "20px"
              }}>
                No preview available
              </div>
            )}
            
            <button
              onClick={() => openSpotifyWeb(selectedTrack)}
              style={{
                background: "rgba(255,255,255,0.2)",
                color: "white",
                border: "none",
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: "600"
              }}
            >
              🎧 Open in Spotify
            </button>
          </div>

          {/* Spotify Embed (as backup) */}
          {(() => {
            const embedUrl = getSpotifyEmbedUrl(selectedTrack);
            if (embedUrl) {
              return (
                <div style={{
                  borderRadius: "8px",
                  overflow: "hidden",
                  marginTop: "10px"
                }}>
                  <iframe
                    src={embedUrl}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allowtransparency="true"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    style={{
                      borderRadius: "8px"
                    }}
                  />
                </div>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Track List */}
      {tracks.length > 0 && (
        <div>
          <h3 style={{ 
            fontSize: "14px", 
            fontWeight: "700", 
            marginBottom: "15px",
            opacity: "0.9"
          }}>
            All Recommendations ({tracks.length} songs):
          </h3>
          
          <div style={{
            display: "grid",
            gap: "10px"
          }}>
            {tracks.map((track, index) => (
              <div
                key={index}
                style={{
                  background: selectedTrack === track 
                    ? "rgba(29, 185, 84, 0.3)" 
                    : "rgba(0,0,0,0.2)",
                  padding: "12px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: selectedTrack === track 
                    ? "1px solid #1DB954" 
                    : "1px solid rgba(255,255,255,0.1)"
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: "13px",
                    fontWeight: "600",
                    marginBottom: "2px"
                  }}>
                    {track.name}
                  </div>
                  <div style={{
                    fontSize: "11px",
                    opacity: "0.8"
                  }}>
                    by {track.artist}
                  </div>
                </div>
                
                <div style={{
                  display: "flex",
                  gap: "6px",
                  alignItems: "center"
                }}>
                  {track.preview_url && (
                    <button
                      onClick={() => playPreview(track)}
                      style={{
                        background: "rgba(29, 185, 84, 0.8)",
                        color: "white",
                        border: "none",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontSize: "10px",
                        fontWeight: "600"
                      }}
                      title="Play 30s preview"
                    >
                      ▶️
                    </button>
                  )}
                  
                  <button
                    onClick={() => openSpotifyWeb(track)}
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "10px",
                      fontWeight: "600"
                    }}
                    title="Open in Spotify"
                  >
                    🎧
                  </button>
                  
                  <button
                    onClick={() => setSelectedTrack(track)}
                    style={{
                      background: selectedTrack === track 
                        ? "#1DB954" 
                        : "rgba(255,255,255,0.3)",
                      color: "white",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "12px",
                      cursor: "pointer",
                      fontSize: "10px",
                      fontWeight: "600"
                    }}
                  >
                    {selectedTrack === track ? '✓' : 'Select'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Info */}
      {selectedTrack && (
        <div style={{
          marginTop: "15px",
          fontSize: "10px",
          opacity: "0.7",
          background: "rgba(0,0,0,0.2)",
          padding: "8px",
          borderRadius: "6px"
        }}>
          <strong>Debug:</strong> Preview URL: {selectedTrack.preview_url ? '✓ Available' : '❌ Not available'}
          | Spotify URL: {getSpotifyWebUrl(selectedTrack) ? '✓ Available' : '❌ Not available'}
        </div>
      )}
    </div>
  );
};

export default SpotifyPlayer;