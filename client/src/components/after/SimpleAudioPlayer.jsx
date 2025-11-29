import React, { useState, useEffect } from "react";

// Simple demo tracks (fallback if no playlist is passed)
const TEST_TRACKS = [
  {
    title: "Sample Piano",
    artist: "MoodWaves Demo",
    url: "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
  },
  {
    title: "Night Owl",
    artist: "Broke For Free",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3",
  },
  {
    title: "Tomorrow",
    artist: "Josh Woodward",
    url: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/Creative_Commons/Josh_Woodward/The_Simple_Life/Josh_Woodward_-_The_Simple_Life_-_08_-_Tomorrow.mp3",
  },
];

const SimpleAudioPlayer = ({ playlist }) => {
  // playlist is expected to be the object returned by MusicService.generatePlaylist()
  // { tracks: [...], playlistName, description, source, moodAnalysis }

  const tracks = playlist?.tracks && playlist.tracks.length > 0
    ? playlist.tracks
    : TEST_TRACKS;

  const [currentTrack, setCurrentTrack] = useState(0);

  // When playlist changes (new mood analyzed), reset to first track
  useEffect(() => {
    setCurrentTrack(0);
  }, [playlist]);

  const current = tracks[currentTrack];

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #0e232aff 0%, #ff0808ff 100%)",
        borderRadius: "15px",
        padding: "20px",
        color: "white",
        maxWidth: "400px",
        margin: "20px auto",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "10px" }}>
        🎵 {playlist?.playlistName || "Simple Audio Player"}
      </h3>

      {playlist?.source && (
        <p
          style={{
            textAlign: "center",
            fontSize: "12px",
            opacity: 0.75,
            marginTop: 0,
            marginBottom: "10px",
          }}
        >
          Source: {playlist.source === "mw-api" ? "MW Music" : playlist.source}
        </p>
      )}

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <h4 style={{ margin: 0 }}>{current.title}</h4>
        <p style={{ opacity: 0.8, marginTop: "4px" }}>{current.artist}</p>
      </div>

      {/* HTML5 Audio Element with Controls */}
      <audio
        key={currentTrack} // Force reload when track changes
        controls
        style={{ width: "100%", marginBottom: "20px" }}
        preload="metadata"
      >
        <source src={current.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Track Selection */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {tracks.map((track, index) => (
          <button
            key={index}
            onClick={() => setCurrentTrack(index)}
            style={{
              background:
                currentTrack === index
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            {track.title.length > 14
              ? track.title.slice(0, 12) + "…"
              : track.title}
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: "15px",
          textAlign: "center",
          fontSize: "12px",
          opacity: 0.8,
        }}
      >
        {playlist?.description || "Use the audio controls to play/pause and seek."}
      </div>
    </div>
  );
};

export default SimpleAudioPlayer;
