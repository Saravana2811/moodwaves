import React, { useState } from "react";
import Type from "./type.jsx";
import Footer from "./footer.jsx";
import Input from "./InputBox.jsx";
import Faq from "./Faq.jsx";
import Review from "./Review.jsx";
import SimpleAudioPlayer from "./SimpleAudioPlayer.jsx";
import DemoPlaylist from "./DemoPlaylist.jsx";
import b1 from "../../assets/b1.png";

function Home() {
  const [currentPlaylist, setCurrentPlaylist] = useState(null);
  const [messages, setMessages] = useState([]);

  const handleNewMessage = (message) => {
    setMessages((prev) => [message, ...prev]);
  };

  const handlePlaylistGenerated = (playlist) => {
    setCurrentPlaylist(playlist); // { tracks, playlistName, description, moodAnalysis, source, ... }
  };

  const pageStyle = {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundImage: `url(${b1})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
    overflowX: "hidden",
  };

  const mainStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  };

  const navbarStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 40px",
    position: "sticky",
    top: 0,
    zIndex: 10,
    boxSizing: "border-box",
  };

  const brandStyle = {
    fontSize: "3.4rem",
    fontWeight: 900,
    fontFamily: "'Pacifico', Segoe Script, cursive",
    letterSpacing: "1px",
    background: "white",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  };

  return (
    <div style={pageStyle}>
      <main style={mainStyle}>
        {/* Navbar */}
        <nav style={navbarStyle}>
          <div style={brandStyle}>MoodWaves</div>
        </nav>

        <Type />

        {/* Input box: generates playlist + saves message */}
        <Input
          onNewMessage={handleNewMessage}
          onPlaylistGenerated={handlePlaylistGenerated}
        />

        {/* When a playlist is generated from mood text */}
        {currentPlaylist && (
          <div style={{ maxWidth: "600px", width: "100%", margin: "20px 0" }}>
            <div
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                borderRadius: "15px",
                padding: "20px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>
                {currentPlaylist.playlistName}
              </h2>
              <p
                style={{
                  margin: "0",
                  color: "#666",
                  fontSize: "14px",
                }}
              >
                {currentPlaylist.description}
              </p>
              {currentPlaylist.moodAnalysis && (
                <p
                  style={{
                    margin: "10px 0 0 0",
                    color: "#888",
                    fontSize: "12px",
                  }}
                >
                  Detected moods: {currentPlaylist.moodAnalysis.join(", ")}
                </p>
              )}
            </div>

            {/* 🎵 Use SimpleAudioPlayer with the generated playlist */}
            <SimpleAudioPlayer playlist={currentPlaylist} />
          </div>
        )}

        {/* When no playlist yet -> demo player + demo playlist */}
        {!currentPlaylist && (
          <>
            <SimpleAudioPlayer /> {/* uses internal TEST_TRACKS fallback */}
            <DemoPlaylist />
          </>
        )}

        <Review />
        <Faq />
        <Footer />
      </main>
    </div>
  );
}

export default Home;
