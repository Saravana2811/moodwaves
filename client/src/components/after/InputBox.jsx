import React, { useState } from "react";
import MusicService from "../../services/MusicService.js";

// MoodWaves backend (for saving messages), NOT the MW Music API
const MOODWAVES_API_BASE =
  import.meta.env.VITE_MOODWAVES_API_URL || "http://localhost:5000";

function InputBox({ onNewMessage, onPlaylistGenerated }) {
  const [text, setText] = useState("");
  const [languages, setLanguages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setLanguages((prev) => [...prev, value]);
    } else {
      setLanguages((prev) => prev.filter((lang) => lang !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsGenerating(true);

    try {
      // 1️⃣ Ask MusicService to generate playlist based on mood text + languages
      const playlist = await MusicService.generatePlaylist(text, languages);

      // 2️⃣ Save message to MoodWaves backend (optional logging/history)
      let savedMessage = null;
      try {
        const res = await fetch(`${MOODWAVES_API_BASE}/api/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, languages }),
        });

        if (res.ok) {
          savedMessage = await res.json();
        } else {
          console.warn("Saving message failed with status:", res.status);
        }
      } catch (err) {
        console.warn("Could not save message to backend:", err);
      }

      // 3️⃣ Notify parent components
      if (savedMessage && onNewMessage) {
        onNewMessage(savedMessage);
      }
      if (onPlaylistGenerated) {
        onPlaylistGenerated(playlist); // { tracks, playlistName, description, source, ... }
      }

      // 4️⃣ Reset inputs
      setText("");
      setLanguages([]);
    } catch (error) {
      console.error("Error generating playlist:", error);

      let errorMessage = "Sorry, there was an error generating your playlist.";
      if (error.message) {
        errorMessage += ` Details: ${error.message}`;
      }
      errorMessage += " Please try again!";

      alert(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: "#f9f9ff",
        padding: "20px",
        borderRadius: "15px",
        boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        width: "50%",
        maxWidth: "9000px",
        margin: "auto",
      }}
    >
      <input
        type="text"
        placeholder="Type your mood..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          padding: "12px 15px",
          borderRadius: "10px",
          border: "1px solid #ccc",
          fontSize: "16px",
          outline: "none",
          transition: "0.3s",
        }}
        onFocus={(e) => (e.target.style.border = "1px solid #7b61ff")}
        onBlur={(e) => (e.target.style.border = "1px solid #ccc")}
      />


      <button
        type="submit"
        disabled={isGenerating}
        style={{
          padding: "12px",
          border: "none",
          borderRadius: "10px",
          background: isGenerating ? "#999" : "#ce6714ff",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: isGenerating ? "not-allowed" : "pointer",
          transition: "0.3s",
        }}
        onMouseEnter={(e) =>
          !isGenerating && (e.target.style.background = "black")
        }
        onMouseLeave={(e) =>
          !isGenerating && (e.target.style.background = "#ce6714ff")
        }
      >
        {isGenerating ? "🎵 Generating ..." : "🎵 Play Now"}
      </button>
    </form>
  );
}

export default InputBox;
