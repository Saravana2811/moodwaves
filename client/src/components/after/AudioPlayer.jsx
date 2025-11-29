import React, { useState, useRef, useEffect } from 'react';
import SpotifyPlayer from '../../services/SpotifyPlayer.js';

const AudioPlayer = ({ playlist = [] }) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  const currentTrack = playlist[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextTrack();
    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };
    const handleCanPlay = () => {
      setIsLoading(false);
      setError(null);
    };
    const handleError = (e) => {
      setIsLoading(false);
      setIsPlaying(false);
      setError(`Error loading audio: ${currentTrack?.title || 'Unknown track'}`);
      console.error('Audio error:', e);
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [currentTrackIndex]);

  // Initialize Spotify Web Playback for owner (if configured)
  useEffect(() => {
    (async () => {
      try {
        const owner = import.meta.env.VITE_DEFAULT_OWNER_ID || '';
        if (!owner) return;
        await SpotifyPlayer.init({ ownerId: owner });
      } catch (err) {
        console.warn('SpotifyPlayer init failed', err);
      }
    })();
  }, []);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!currentTrack) return;

    // If Spotify Web Playback is ready and track has spotify_url, prefer full playback
    const spotifyReady = SpotifyPlayer.isReady();
    const spotifyTrackIdMatch = currentTrack.spotify_url && currentTrack.spotify_url.match(/track\/(.*?)($|\?)/);
    const spotifyUri = spotifyTrackIdMatch ? `spotify:track:${spotifyTrackIdMatch[1]}` : null;

    try {
      if (spotifyReady && spotifyUri) {
        setIsLoading(true);
        if (isPlaying) {
          await SpotifyPlayer.pause();
          setIsPlaying(false);
        } else {
          await SpotifyPlayer.playSpotifyUri(spotifyUri, 0);
          setIsPlaying(true);
          setError(null);
        }
      } else {
        // Fallback to preview audio element
        if (!audio) return;
        if (isPlaying) {
          audio.pause();
          setIsPlaying(false);
        } else {
          setIsLoading(true);
          await audio.play();
          setIsPlaying(true);
          setError(null);
        }
      }
    } catch (error) {
      console.error('Playback error:', error);
      setError(`Playback failed: ${error.message}`);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const nextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  const prevTrack = () => {
    if (currentTrackIndex > 0) {
      setCurrentTrackIndex(prev => prev - 1);
      setIsPlaying(true);
    }
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
        borderRadius: '15px',
        padding: '20px',
        color: 'white',
        textAlign: 'center',
        margin: '20px auto',
        maxWidth: '400px'
      }}>
        <p>No tracks available. Upload some music or connect to a music service!</p>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
      borderRadius: '15px',
      padding: '20px',
      color: 'white',
      maxWidth: '400px',
      margin: '20px auto',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        crossOrigin="anonymous"
        preload="metadata"
      />

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#ffebee',
          color: '#c62828',
          padding: '10px',
          borderRadius: '8px',
          marginBottom: '15px',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#c62828',
              cursor: 'pointer',
              marginLeft: '10px',
              fontSize: '16px'
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Track Info */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '10px',
          background: currentTrack.image ? `url(${currentTrack.image})` : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          margin: '0 auto 15px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '30px'
        }}>
          {!currentTrack.image && '🎵'}
        </div>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{currentTrack.title}</h3>
        <p style={{ margin: '0 0 5px 0', opacity: 0.7, fontSize: '14px' }}>{currentTrack.artist}</p>
        
        {/* Spotify Link */}
        {currentTrack.spotify_url && currentTrack.spotify_url !== '#' && (
          <a 
            href={currentTrack.spotify_url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              color: '#1DB954',
              fontSize: '12px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            🎵 Open in Spotify
          </a>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '15px' }}>
        <div
          onClick={handleSeek}
          style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
            cursor: 'pointer',
            position: 'relative'
          }}
        >
          <div style={{
            width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ff6b6b, #4ecdc4)',
            borderRadius: '3px',
            transition: 'width 0.1s'
          }} />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          marginTop: '5px',
          opacity: 0.7
        }}>
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        marginBottom: '15px'
      }}>
        <button
          onClick={prevTrack}
          disabled={currentTrackIndex === 0}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: 'white',
            cursor: currentTrackIndex === 0 ? 'not-allowed' : 'pointer',
            opacity: currentTrackIndex === 0 ? 0.5 : 1,
            fontSize: '16px'
          }}
        >
          ⏮
        </button>

        <button
          onClick={togglePlayPause}
          disabled={isLoading}
          style={{
            background: isLoading ? '#999' : 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            color: 'white',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontSize: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLoading ? '⏳' : isPlaying ? '⏸' : '▶'}
        </button>

        <button
          onClick={nextTrack}
          disabled={currentTrackIndex === playlist.length - 1}
          style={{
            background: 'rgba(255,255,255,0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            color: 'white',
            cursor: currentTrackIndex === playlist.length - 1 ? 'not-allowed' : 'pointer',
            opacity: currentTrackIndex === playlist.length - 1 ? 0.5 : 1,
            fontSize: '16px'
          }}
        >
          ⏭
        </button>
      </div>

      {/* Volume Control */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{ fontSize: '16px' }}>🔊</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          style={{
            flex: 1,
            height: '4px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
      </div>

      {/* Playlist Info */}
      <div style={{
        marginTop: '15px',
        textAlign: 'center',
        fontSize: '12px',
        opacity: 0.7
      }}>
        Track {currentTrackIndex + 1} of {playlist.length}
      </div>
    </div>
  );
};

export default AudioPlayer;