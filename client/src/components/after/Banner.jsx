import React from "react";
import b3 from "../../assets/b3.jpg";
const Banner = () => {
  const bannerStyle = {
    backgroundImage: `url(${b3})`,   
    backgroundSize: "cover",
    backgroundPosition: "center",
    width: "100%",
    maxWidth: "1800px",
    margin: "60px auto",
    display: "flex",
    borderRadius: "0.09px",
    padding: "200px 20px",
    position: "relative",
    color: "#fff",
  };

  const contentsStyle = {
    textAlign: "left",
    maxWidth: "600px",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    fontWeight: 800,
    paddingBottom: "1rem",
  };

  const descriptionStyle = {
    fontSize: "1.1rem",
    lineHeight: 1.5,
    marginBottom: "1.5rem",
    color: "#fff",
    textShadow: "0 1px 3px rgba(0, 0, 0, 0.8)",
  };

  const buttonStyle = {
    cursor: "pointer",
    color: "#fff",
    backgroundColor: "rgba(51, 51, 51, 0.6)",
    border: "none",
    fontWeight: 700,
    borderRadius: "0.3rem",
    padding: "0.6rem 1.5rem",
    fontSize: "1rem",
    transition: "all 0.2s",
  };

  const buttonHoverStyle = {
    color: "#000",
    backgroundColor: "#e6e6e6",
  };

  return (
    <div style={bannerStyle}>
      <div style={contentsStyle}>
        <h2 style={titleStyle}>MoodWaves</h2>
        <div style={descriptionStyle}>
        MoodWaves is a smart music application that tailors playlists based on your emotions and vibes. By analyzing user preferences, moods, and activity, it recommends songs that uplift, relax, or energize you at the right time. Whether you’re studying, working out, or unwinding.
        </div>
        <div>
          
        </div>
      </div>
    </div>
  );
};

export default Banner;
