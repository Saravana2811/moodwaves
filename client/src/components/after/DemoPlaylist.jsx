import React, { useState } from 'react';
import AudioPlayer from './AudioPlayer.jsx';

const DemoPlaylist = () => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  // Demo playlists with sample audio URLs (using free audio samples)
  const demoPlaylists = {
    happy: {
      name: "Happy Vibes",
      description: "Upbeat songs to lift your mood",
      
    },
    sad: {
      name: "Melancholy Moments", 
      description: "Gentle songs for reflection",
      tracks: [
        {
          id: 2,
          title: "Sad Demo Track",
          artist: "MoodWaves",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          image: null
        }
      ]
    },
    calm: {
      name: "Peaceful Mind",
      description: "Relaxing tracks for meditation",
      tracks: [
        {
          id: 3,
          title: "Calm Demo Track", 
          artist: "MoodWaves",
          url: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
          image: null
        }
      ]
    }
  };

  return (
    <div style={{
      background: "rgba(255, 255, 255, 0.95)",
      borderRadius: "15px", 
      padding: "20px",
      margin: "20px auto",
      maxWidth: "500px"
    }}>
      <h3 style={{ textAlign: "center", color: "#333", marginBottom: "20px" }}>
        🎵 Demo Playlists
      </h3>
      
      {!selectedPlaylist ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {Object.entries(demoPlaylists).map(([mood, playlist]) => (
            <button
              key={mood}
              onClick={() => setSelectedPlaylist(playlist)}
              style={{
                padding: "15px",
                border: "none",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #575452ff, #e0be11ff)",
                color: "white",
                cursor: "pointer",
                textAlign: "left",
                transition: "transform 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
                {playlist.name}
              </div>
              <div style={{ fontSize: "12px", opacity: 0.9 }}>
                {playlist.description}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div>
          <button
            onClick={() => setSelectedPlaylist(null)}
            style={{
              background: "rgba(0,0,0,0.1)",
              border: "none",
              borderRadius: "5px",
              padding: "5px 10px",
              marginBottom: "15px",
              cursor: "pointer"
            }}
          >
            ← Back to Playlists
          </button>
          
        </div>
      )}
      
      <div style={{
        marginTop: "20px",
        textAlign: "center",
        fontSize: "12px",
        color: "#666"
      }}>
        💡 Tip: Type your mood above to generate a personalized playlist!
      </div>
    </div>
  );
};

export default DemoPlaylist;