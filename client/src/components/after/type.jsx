import React from "react";
import { ReactTyped } from "react-typed";

function About() {
  const pageStyle = {
   
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
   
    background: "none", 
    color: "#fff",
    fontFamily: "Arial, sans-serif",
   
    textAlign: "center",
  };

  const textStyle = {
    fontSize: "1.5rem",
    lineHeight: "1.8",
    maxWidth: "800px",
    fontFamily: "'Comic Sans MS', cursive, sans-serif",
   
  };

  return (
    <div style={pageStyle}>
      <ReactTyped
        strings={[
          "Welcome to MoodWaves!!Ride the Rhythm of Your Emotions🎶"
        ]}
        typeSpeed={40}      // typing speed
        backSpeed={10}      // backspace speed
        showCursor={true}   // blinking cursor
        loop={false}        // type once
        style={textStyle}
      />
    </div>
  );
}

export default About;
