import React, { useState } from "react";

function ChatInput() {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;
    alert("User typed: " + message); // Replace with your logic
    setMessage("");
  };

  return (
    <div
      style={{
        position: "sticky",
        bottom: "20px",        // sticks 20px above bottom until footer pushes it
        margin: "0 auto",
        width: "90%",
        maxWidth: "450px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "white",
        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        borderRadius: "16px",
        padding: "8px",
        zIndex: 10,
      }}
    >
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{
          flexGrow: 1,
          padding: "10px 12px",
          borderRadius: "12px",
          border: "1px solid #ccc",
          outline: "none",
          fontSize: "14px",
        }}
      />
      <button
        onClick={handleSend}
        style={{
          marginLeft: "8px",
          backgroundColor: "#3B82F6",
          color: "white",
          padding: "10px 16px",
          borderRadius: "12px",
          border: "none",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        onMouseOver={(e) => (e.target.style.backgroundColor = "#2563EB")}
        onMouseOut={(e) => (e.target.style.backgroundColor = "#3B82F6")}
      >
        Send
      </button>
    </div>
  );
}

export default ChatInput;
