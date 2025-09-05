import React, { useState } from "react";

function InputBox({ onNewMessage }) {
  const [text, setText] = useState("");
  const [languages, setLanguages] = useState([]);

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setLanguages([...languages, value]);
    } else {
      setLanguages(languages.filter((lang) => lang !== value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, languages }),
      });

      const data = await res.json();
      onNewMessage(data);
      setText("");
      setLanguages([]);
    } catch (error) {
      console.error("Error sending message:", error);
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
        maxWidth: "500px",
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

      {/* Language selection */}
      <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
        {["English", "Tamil", "Hindi", "Telugu","Malayalam","Kanadam"].map((lang) => (
          <label
            key={lang}
            style={{
              background: languages.includes(lang) ? "#7b61ff" : "#eee",
              color: languages.includes(lang) ? "#fff" : "#333",
              padding: "8px 12px",
              borderRadius: "20px",
              cursor: "pointer",
              fontSize: "14px",
              transition: "0.3s",
              userSelect: "none",
            }}
          >
            <input
              type="checkbox"
              value={lang}
              checked={languages.includes(lang)}
              onChange={handleCheckboxChange}
              style={{ display: "none" }}
            />
            {lang}
          </label>
        ))}
      </div>

      <button
        type="submit"
        style={{
          padding: "12px",
          border: "none",
          borderRadius: "10px",
          background: "#ce6714ff",
          color: "#fff",
          fontSize: "16px",
          fontWeight: "bold",
          cursor: "pointer",
          transition: "0.3s",
        }}
        onMouseEnter={(e) =>
          (e.target.style.background = "black")
        }
        onMouseLeave={(e) =>
          (e.target.style.background = "#ce6714ff")
        }
      >
        Send
      </button>
    </form>
  );
}

export default InputBox;
