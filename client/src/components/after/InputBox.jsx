import React, { useState } from "react";
import SpotifyPlayer from "../SpotifyPlayer.jsx";

function InputBox({ onNewMessage }) {
  const [text, setText] = useState("");
  const [languages, setLanguages] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [allMessages, setAllMessages] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [processingTime, setProcessingTime] = useState(0);
  const [playlists, setPlaylists] = useState({});

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

    setLoading(true);
    setAnalysis(null);
    setShowResults(false);
    const startTime = Date.now();

    try {
      // First, save the message with emotion analysis
      const res = await fetch("http://localhost:5000/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, languages: languages.length > 0 ? languages : ['English'] }),
      });

      const data = await res.json();
      const endTime = Date.now();
      setProcessingTime(endTime - startTime);
      
      if (res.ok) {
        setAnalysis(data.analysis);
        if (onNewMessage) onNewMessage(data.message);
        
        // Fetch all messages from database to show the stored data
        await fetchAllMessages();
        setShowResults(true);
        setText("");
        setLanguages([]);
      } else {
        console.error('Error:', data.error);
        alert('Error analyzing emotion: ' + data.error);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      alert('Failed to analyze emotion. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllMessages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/messages");
      const messages = await response.json();
      setAllMessages(messages);
      
      // Fetch playlists for each message with emotion analysis
      const playlistPromises = messages
        .filter(message => message.emotionAnalysis)
        .map(async (message) => {
          try {
            const playlistResponse = await fetch(`http://localhost:5000/api/messages/${message._id}/playlists`);
            if (playlistResponse.ok) {
              const playlistData = await playlistResponse.json();
              return { messageId: message._id, playlists: playlistData.playlists };
            }
          } catch (error) {
            console.error(`Error fetching playlists for message ${message._id}:`, error);
          }
          return { messageId: message._id, playlists: [] };
        });

      const playlistResults = await Promise.all(playlistPromises);
      const playlistsMap = {};
      playlistResults.forEach(({ messageId, playlists }) => {
        playlistsMap[messageId] = playlists;
      });
      
      setPlaylists(playlistsMap);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleFetchMessages = async () => {
    setLoading(true);
    await fetchAllMessages();
    setShowResults(true);
    setLoading(false);
  };

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      happy: '#FFD700',
      sad: '#4682B4', 
      angry: '#DC143C',
      fear: '#8B008B',
      surprise: '#FF8C00',
      disgust: '#32CD32',
      excited: '#FF1493',
      calm: '#20B2AA',
      love: '#FF69B4',
      confident: '#4169E1',
      lonely: '#696969',
      nostalgic: '#DDA0DD'
    };
    return emotionColors[emotion] || '#87CEEB';
  };

  const getSentimentColor = (label) => {
    const colors = {
      positive: '#22C55E',
      negative: '#EF4444', 
      neutral: '#6B7280'
    };
    return colors[label] || '#6B7280';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "auto", padding: "20px" }}>
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
          marginBottom: "20px"
        }}
      >
        <input
          type="text"
          placeholder="Type your mood or feelings..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={loading}
          style={{
            padding: "12px 15px",
            borderRadius: "10px",
            border: "1px solid #ccc",
            fontSize: "16px",
            outline: "none",
            transition: "0.3s",
            opacity: loading ? 0.6 : 1
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
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "14px",
                transition: "0.3s",
                userSelect: "none",
                opacity: loading ? 0.6 : 1
              }}
            >
              <input
                type="checkbox"
                value={lang}
                checked={languages.includes(lang)}
                onChange={handleCheckboxChange}
                disabled={loading}
                style={{ display: "none" }}
              />
              {lang}
            </label>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="submit"
            disabled={loading || !text.trim()}
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "10px",
              background: loading || !text.trim() ? "#ccc" : "#ce6714ff",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading || !text.trim() ? "not-allowed" : "pointer",
              transition: "0.3s",
              flex: 1
            }}
          >
            {loading ? "Analyzing..." : "Analyze Emotion & Save to Database"}
          </button>

          <button
            type="button"
            onClick={handleFetchMessages}
            disabled={loading}
            style={{
              padding: "12px 20px",
              border: "none",
              borderRadius: "10px",
              background: loading ? "#ccc" : "#3B82F6",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "0.3s",
            }}
          >
            {loading ? "Loading..." : "Show All Messages"}
          </button>
        </div>
      </form>

      {/* Emotion Analysis Results */}
      {analysis && showResults && (
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb",
            marginBottom: "30px"
          }}
        >
          <h3 style={{ 
            color: "#374151", 
            marginBottom: "20px", 
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "700"
          }}>
            🧠 Emotion Analysis Results
          </h3>

          {/* Accuracy Score Highlight */}
          <div style={{ 
            background: `linear-gradient(135deg, ${analysis.accuracy.overall > 0.8 ? '#10B981' : analysis.accuracy.overall > 0.6 ? '#F59E0B' : '#EF4444'}, ${analysis.accuracy.overall > 0.8 ? '#34D399' : analysis.accuracy.overall > 0.6 ? '#FBBF24' : '#F87171'})`,
            color: "white",
            padding: "25px",
            borderRadius: "20px",
            textAlign: "center",
            marginBottom: "30px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            position: "relative",
            overflow: "hidden"
          }}>
            {/* Background pattern */}
            <div style={{
              position: "absolute",
              top: "-50%",
              left: "-50%",
              width: "200%",
              height: "200%",
              background: "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
              animation: "float 20s ease-in-out infinite",
              pointerEvents: "none"
            }} />
            
            <div style={{ position: "relative", zIndex: 2 }}>
              <div style={{
                fontSize: "1rem",
                fontWeight: "600",
                marginBottom: "10px",
                opacity: "0.9"
              }}>
                🎯 Sentence Processing Accuracy
              </div>
              
              <h1 style={{ 
                margin: "0 0 15px 0", 
                fontSize: "4rem",
                fontWeight: "900",
                textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                letterSpacing: "-2px"
              }}>
                {Math.round(analysis.accuracy.overall * 100)}%
              </h1>
              
              <div style={{
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "15px"
              }}>
                {analysis.accuracy.overall > 0.8 ? "🌟 Excellent Processing Quality" : 
                 analysis.accuracy.overall > 0.6 ? "⚡ Good Processing Quality" : 
                 "🔧 Processing Quality Needs Improvement"}
              </div>

              {/* Mini accuracy indicators */}
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "15px",
                marginTop: "20px",
                flexWrap: "wrap"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "5px" }}>
                    {Math.round(analysis.accuracy.textClarity * 100)}%
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: "0.9" }}>
                    Text Clarity
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "5px" }}>
                    {Math.round(analysis.accuracy.emotionConfidence * 100)}%
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: "0.9" }}>
                    Emotion Detection
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "1.5rem", marginBottom: "5px" }}>
                    {Math.round(analysis.accuracy.languageProcessing * 100)}%
                  </div>
                  <div style={{ fontSize: "0.8rem", opacity: "0.9" }}>
                    Language Processing
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sentence Processing Information */}
          <div style={{
            background: "#F8FAFC",
            border: "2px solid #E2E8F0",
            borderRadius: "15px",
            padding: "20px",
            marginBottom: "25px"
          }}>
            <h4 style={{ 
              color: "#374151", 
              marginBottom: "15px", 
              textAlign: "center",
              fontSize: "1.4rem",
              fontWeight: "700"
            }}>
              📊 Processing Statistics
            </h4>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", 
              gap: "15px",
              textAlign: "center"
            }}>
              <div style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB"
              }}>
                <div style={{ fontSize: "1.5rem", color: "#3B82F6", fontWeight: "700" }}>
                  {processingTime}ms
                </div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  Processing Time
                </div>
              </div>
              
              <div style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB"
              }}>
                <div style={{ fontSize: "1.5rem", color: "#10B981", fontWeight: "700" }}>
                  {analysis.keywords?.length || 0}
                </div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  Keywords Found
                </div>
              </div>
              
              <div style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB"
              }}>
                <div style={{ fontSize: "1.5rem", color: "#F59E0B", fontWeight: "700" }}>
                  {analysis.emotions?.length || 0}
                </div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  Emotions Detected
                </div>
              </div>
              
              <div style={{
                background: "white",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #E5E7EB"
              }}>
                <div style={{ fontSize: "1.5rem", color: "#8B5CF6", fontWeight: "700" }}>
                  {analysis.sentiment?.score || 0}
                </div>
                <div style={{ fontSize: "12px", color: "#6B7280" }}>
                  Sentiment Score
                </div>
              </div>
            </div>
            
            <div style={{
              marginTop: "15px",
              padding: "12px",
              background: "#EFF6FF",
              border: "1px solid #DBEAFE",
              borderRadius: "8px",
              textAlign: "center"
            }}>
              <div style={{ color: "#1E40AF", fontSize: "13px", fontWeight: "600" }}>
                ⚡ Sentence successfully processed using NLP algorithms
              </div>
            </div>
          </div>

          {/* Primary Emotion */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h4 style={{ color: "#4B5563", marginBottom: "10px" }}>Primary Emotion</h4>
            <div
              style={{
                display: "inline-block",
                background: getEmotionColor(analysis.primaryEmotion),
                color: "white",
                padding: "12px 24px",
                borderRadius: "25px",
                fontSize: "18px",
                fontWeight: "bold",
                textTransform: "capitalize",
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
              }}
            >
              {analysis.primaryEmotion}
            </div>
          </div>

          {/* Emotion Breakdown */}
          {analysis.emotions && analysis.emotions.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h4 style={{ color: "#4B5563", marginBottom: "15px" }}>Detected Emotions</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
                {analysis.emotions.map((emotion, index) => (
                  <div
                    key={index}
                    style={{
                      background: `${getEmotionColor(emotion.emotion)}20`,
                      border: `2px solid ${getEmotionColor(emotion.emotion)}`,
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "14px",
                      fontWeight: "600",
                      textTransform: "capitalize"
                    }}
                  >
                    {emotion.emotion}: {Math.round(emotion.confidence * 100)}%
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Analysis */}
          <div style={{ marginBottom: "20px", textAlign: "center" }}>
            <h4 style={{ color: "#4B5563", marginBottom: "10px" }}>Sentiment</h4>
            <div
              style={{
                display: "inline-block",
                background: getSentimentColor(analysis.sentiment.label),
                color: "white",
                padding: "10px 20px",
                borderRadius: "20px",
                fontSize: "16px",
                fontWeight: "600",
                textTransform: "capitalize"
              }}
            >
              {analysis.sentiment.label} ({analysis.sentiment.score > 0 ? '+' : ''}{analysis.sentiment.score})
            </div>
          </div>

          {/* Detailed Accuracy Breakdown */}
          <div style={{ marginBottom: "30px" }}>
            <h4 style={{ 
              color: "#4B5563", 
              marginBottom: "20px", 
              textAlign: "center",
              fontSize: "1.8rem",
              fontWeight: "700"
            }}>
              🔍 Sentence Processing Analysis
            </h4>
            
            {/* Processing Quality Metrics */}
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: "20px",
              marginBottom: "25px"
            }}>
              {Object.entries(analysis.accuracy).map(([key, value]) => {
                if (key === 'overall') return null;
                
                const getMetricInfo = (metricKey) => {
                  switch(metricKey) {
                    case 'textClarity':
                      return {
                        icon: '📝',
                        title: 'Text Clarity',
                        description: 'How clear and well-structured your sentence is',
                        tips: value < 0.7 ? 'Try using more descriptive words or complete sentences' : 'Great sentence structure!'
                      };
                    case 'emotionConfidence':
                      return {
                        icon: '🎭',
                        title: 'Emotion Detection',
                        description: 'How confident we are about the detected emotions',
                        tips: value < 0.7 ? 'Use more emotional words to improve detection' : 'Strong emotional signals detected!'
                      };
                    case 'languageProcessing':
                      return {
                        icon: '🌐',
                        title: 'Language Processing',
                        description: 'How well we can process your chosen language',
                        tips: value < 0.9 ? 'Some languages may have limited processing capabilities' : 'Excellent language processing!'
                      };
                    default:
                      return { icon: '📊', title: key, description: 'Processing metric', tips: 'Good processing' };
                  }
                };
                
                const metricInfo = getMetricInfo(key);
                
                return (
                  <div key={key} style={{
                    background: "white",
                    border: "2px solid #E5E7EB",
                    borderRadius: "15px",
                    padding: "20px",
                    textAlign: "center",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    transition: "transform 0.2s ease",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
                  onMouseLeave={(e) => e.target.style.transform = "translateY(0px)"}
                  >
                    <div style={{ fontSize: "2rem", marginBottom: "10px" }}>
                      {metricInfo.icon}
                    </div>
                    
                    <h5 style={{ 
                      color: "#374151", 
                      margin: "0 0 8px 0",
                      fontSize: "1.2rem",
                      fontWeight: "700"
                    }}>
                      {metricInfo.title}
                    </h5>
                    
                    <div style={{
                      background: "#F3F4F6",
                      borderRadius: "25px",
                      height: "12px",
                      position: "relative",
                      overflow: "hidden",
                      marginBottom: "15px"
                    }}>
                      <div style={{
                        background: value > 0.8 ? "#10B981" : value > 0.6 ? "#F59E0B" : "#EF4444",
                        height: "100%",
                        width: `${value * 100}%`,
                        borderRadius: "25px",
                        transition: "width 1s ease",
                        position: "relative"
                      }}>
                        <div style={{
                          position: "absolute",
                          right: "10px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "white",
                          fontSize: "10px",
                          fontWeight: "700"
                        }}>
                          {Math.round(value * 100)}%
                        </div>
                      </div>
                    </div>
                    
                    <p style={{ 
                      color: "#6B7280", 
                      fontSize: "12px",
                      margin: "0 0 8px 0",
                      lineHeight: "1.4"
                    }}>
                      {metricInfo.description}
                    </p>
                    
                    <div style={{
                      background: value > 0.7 ? "#D1FAE5" : "#FEF3C7",
                      color: value > 0.7 ? "#065F46" : "#92400E",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "600",
                      border: value > 0.7 ? "1px solid #A7F3D0" : "1px solid #FDE68A"
                    }}>
                      {metricInfo.tips}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Overall Processing Summary */}
            <div style={{
              background: analysis.accuracy.overall > 0.8 ? "#F0FDF4" : analysis.accuracy.overall > 0.6 ? "#FFFBEB" : "#FEF2F2",
              border: analysis.accuracy.overall > 0.8 ? "2px solid #BBF7D0" : analysis.accuracy.overall > 0.6 ? "2px solid #FED7AA" : "2px solid #FECACA",
              borderRadius: "15px",
              padding: "20px",
              textAlign: "center"
            }}>
              <h5 style={{
                color: analysis.accuracy.overall > 0.8 ? "#065F46" : analysis.accuracy.overall > 0.6 ? "#92400E" : "#991B1B",
                margin: "0 0 10px 0",
                fontSize: "1.1rem",
                fontWeight: "700"
              }}>
                {analysis.accuracy.overall > 0.8 ? "🎉 Excellent Processing!" : 
                 analysis.accuracy.overall > 0.6 ? "👍 Good Processing!" : 
                 "🔧 Processing Could Improve"}
              </h5>
              <p style={{
                color: analysis.accuracy.overall > 0.8 ? "#065F46" : analysis.accuracy.overall > 0.6 ? "#92400E" : "#991B1B",
                margin: 0,
                fontSize: "14px",
                lineHeight: "1.5"
              }}>
                {analysis.accuracy.overall > 0.8 ? 
                  "Your sentence was processed with high accuracy. The emotion analysis is highly reliable!" :
                 analysis.accuracy.overall > 0.6 ?
                  "Your sentence was processed well. The emotion analysis is fairly reliable with room for improvement." :
                  "The processing accuracy could be improved. Consider using more descriptive emotional language for better results."}
              </p>
            </div>
          </div>

          {/* Keywords */}
          {analysis.keywords && analysis.keywords.length > 0 && (
            <div style={{ textAlign: "center" }}>
              <h4 style={{ color: "#4B5563", marginBottom: "15px" }}>Key Emotional Words</h4>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
                {analysis.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    style={{
                      background: "#F3F4F6",
                      color: "#374151",
                      padding: "6px 12px",
                      borderRadius: "15px",
                      fontSize: "12px",
                      fontWeight: "500",
                      border: "1px solid #D1D5DB"
                    }}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Database Messages Display */}
      {showResults && allMessages.length > 0 && (
        <div
          style={{
            background: "white",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
            border: "1px solid #e5e7eb"
          }}
        >
          <h3 style={{ 
            color: "#374151", 
            marginBottom: "20px", 
            textAlign: "center",
            fontSize: "24px",
            fontWeight: "700"
          }}>
            📚 All Messages from Database ({allMessages.length} total)
          </h3>
          
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {allMessages.map((message, index) => (
              <div key={message._id} style={{
                padding: "20px",
                border: "1px solid #E5E7EB",
                borderRadius: "12px",
                marginBottom: "15px",
                background: index === 0 ? "#F0F9FF" : "#F9FAFB", // Highlight the newest message
                border: index === 0 ? "2px solid #3B82F6" : "1px solid #E5E7EB"
              }}>
                {index === 0 && (
                  <div style={{
                    background: "#3B82F6",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "15px",
                    fontSize: "12px",
                    fontWeight: "600",
                    display: "inline-block",
                    marginBottom: "10px"
                  }}>
                    ✨ Just Added
                  </div>
                )}
                
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start",
                  marginBottom: "15px"
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      color: "#374151", 
                      fontSize: "16px",
                      margin: "0 0 10px 0",
                      fontWeight: "600",
                      background: "#FEFCE8",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid #FDE68A"
                    }}>
                      "{message.text}"
                    </p>
                    <p style={{ 
                      color: "#6B7280", 
                      fontSize: "12px",
                      margin: "0 0 5px 0"
                    }}>
                      📅 {formatDate(message.createdAt)}
                    </p>
                    <p style={{ 
                      color: "#6B7280", 
                      fontSize: "12px",
                      margin: 0
                    }}>
                      🌐 Languages: {message.languages.join(', ')}
                    </p>
                  </div>
                </div>
                
                {/* Display emotion analysis if available */}
                {message.emotionAnalysis && (
                  <div style={{ 
                    background: "#F8FAFC",
                    padding: "20px",
                    borderRadius: "12px",
                    border: "1px solid #E2E8F0",
                    marginTop: "15px"
                  }}>
                    {/* Accuracy Score Header for Each Message */}
                    <div style={{
                      background: `linear-gradient(135deg, ${message.emotionAnalysis.accuracy.overall > 0.8 ? '#10B981' : message.emotionAnalysis.accuracy.overall > 0.6 ? '#F59E0B' : '#EF4444'}, ${message.emotionAnalysis.accuracy.overall > 0.8 ? '#34D399' : message.emotionAnalysis.accuracy.overall > 0.6 ? '#FBBF24' : '#F87171'})`,
                      color: "white",
                      padding: "15px",
                      borderRadius: "10px",
                      textAlign: "center",
                      marginBottom: "20px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
                    }}>
                      <div style={{ fontSize: "2rem", fontWeight: "900", marginBottom: "5px" }}>
                        {Math.round(message.emotionAnalysis.accuracy.overall * 100)}%
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "600", opacity: "0.9" }}>
                        Processing Accuracy
                      </div>
                    </div>

                    {/* Detailed Accuracy Breakdown */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                      gap: "12px",
                      marginBottom: "20px"
                    }}>
                      {Object.entries(message.emotionAnalysis.accuracy).map(([key, value]) => {
                        if (key === 'overall') return null;
                        
                        const getMetricInfo = (metricKey) => {
                          switch(metricKey) {
                            case 'textClarity':
                              return { icon: '📝', title: 'Text Clarity', color: '#3B82F6' };
                            case 'emotionConfidence':
                              return { icon: '🎭', title: 'Emotion Detection', color: '#10B981' };
                            case 'languageProcessing':
                              return { icon: '🌐', title: 'Language Processing', color: '#F59E0B' };
                            default:
                              return { icon: '📊', title: key, color: '#8B5CF6' };
                          }
                        };
                        
                        const metricInfo = getMetricInfo(key);
                        
                        return (
                          <div key={key} style={{
                            background: "white",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #E5E7EB",
                            textAlign: "center"
                          }}>
                            <div style={{ fontSize: "1.2rem", marginBottom: "5px" }}>
                              {metricInfo.icon}
                            </div>
                            <div style={{ 
                              fontSize: "1.1rem", 
                              fontWeight: "700", 
                              color: metricInfo.color,
                              marginBottom: "3px"
                            }}>
                              {Math.round(value * 100)}%
                            </div>
                            <div style={{ 
                              fontSize: "10px", 
                              color: "#6B7280",
                              fontWeight: "600"
                            }}>
                              {metricInfo.title}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Main Analysis Results */}
                    <div style={{ 
                      display: "flex", 
                      gap: "15px", 
                      alignItems: "center",
                      flexWrap: "wrap",
                      marginBottom: "15px"
                    }}>
                      <div style={{
                        background: getEmotionColor(message.emotionAnalysis.primaryEmotion),
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "14px",
                        fontWeight: "700",
                        textTransform: "capitalize",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                      }}>
                        🎭 {message.emotionAnalysis.primaryEmotion}
                      </div>
                      
                      <div style={{
                        background: getSentimentColor(message.emotionAnalysis.sentiment.label),
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textTransform: "capitalize"
                      }}>
                        📊 {message.emotionAnalysis.sentiment.label} ({message.emotionAnalysis.sentiment.score})
                      </div>
                      
                      <div style={{
                        background: "#8B5CF6",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "15px",
                        fontSize: "12px",
                        fontWeight: "600"
                      }}>
                        🔑 {message.emotionAnalysis.keywords.length} keywords
                      </div>
                    </div>

                    {/* Detected Emotions Breakdown */}
                    {message.emotionAnalysis.emotions && message.emotionAnalysis.emotions.length > 0 && (
                      <div style={{ marginBottom: "15px" }}>
                        <div style={{ 
                          fontSize: "12px", 
                          fontWeight: "600", 
                          color: "#4B5563", 
                          marginBottom: "8px" 
                        }}>
                          🎯 Detected Emotions:
                        </div>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {message.emotionAnalysis.emotions.slice(0, 4).map((emotion, i) => (
                            <div key={i} style={{
                              background: `${getEmotionColor(emotion.emotion)}20`,
                              border: `1px solid ${getEmotionColor(emotion.emotion)}`,
                              color: getEmotionColor(emotion.emotion),
                              padding: "4px 10px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: "600",
                              textTransform: "capitalize"
                            }}>
                              {emotion.emotion}: {Math.round(emotion.confidence * 100)}%
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Keywords Display */}
                    {message.emotionAnalysis.keywords.length > 0 && (
                      <div style={{ marginBottom: "10px" }}>
                        <div style={{ 
                          fontSize: "12px", 
                          fontWeight: "600", 
                          color: "#4B5563", 
                          marginBottom: "8px" 
                        }}>
                          🔑 Emotional Keywords:
                        </div>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          {message.emotionAnalysis.keywords.slice(0, 6).map((keyword, i) => (
                            <span key={i} style={{
                              background: "#E5E7EB",
                              color: "#374151",
                              padding: "3px 8px",
                              borderRadius: "10px",
                              fontSize: "10px",
                              fontWeight: "500",
                              border: "1px solid #D1D5DB"
                            }}>
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Processing Quality Summary */}
                    <div style={{
                      background: message.emotionAnalysis.accuracy.overall > 0.8 ? "#D1FAE5" : 
                                message.emotionAnalysis.accuracy.overall > 0.6 ? "#FEF3C7" : "#FEE2E2",
                      color: message.emotionAnalysis.accuracy.overall > 0.8 ? "#065F46" : 
                             message.emotionAnalysis.accuracy.overall > 0.6 ? "#92400E" : "#991B1B",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      fontSize: "11px",
                      fontWeight: "600",
                      textAlign: "center",
                      border: message.emotionAnalysis.accuracy.overall > 0.8 ? "1px solid #A7F3D0" : 
                              message.emotionAnalysis.accuracy.overall > 0.6 ? "1px solid #FDE68A" : "1px solid #FECACA"
                    }}>
                      {message.emotionAnalysis.accuracy.overall > 0.8 ? 
                        "🌟 High-quality emotion analysis with excellent accuracy" :
                       message.emotionAnalysis.accuracy.overall > 0.6 ?
                        "⚡ Good emotion analysis with reliable accuracy" :
                        "🔧 Basic emotion analysis - accuracy could be improved"}
                    </div>

                    {/* Spotify Playlist Recommendations */}
                    {playlists[message._id] && playlists[message._id].length > 0 && (
                      <div style={{
                        background: "linear-gradient(135deg, #1DB954, #1ED760)",
                        padding: "20px",
                        borderRadius: "12px",
                        marginTop: "20px",
                        color: "white",
                        boxShadow: "0 4px 15px rgba(29, 185, 84, 0.3)"
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginBottom: "15px"
                        }}>
                          <div style={{ fontSize: "1.8rem" }}>🎵</div>
                          <div>
                            <div style={{ fontSize: "16px", fontWeight: "700" }}>
                              Spotify Playlists for Your Mood
                            </div>
                            <div style={{ fontSize: "12px", opacity: "0.9" }}>
                              Based on {message.emotionAnalysis.accuracy.overall > 0.8 ? 'high' : 
                                      message.emotionAnalysis.accuracy.overall > 0.6 ? 'medium' : 'low'} accuracy 
                              "{message.emotionAnalysis.primaryEmotion}" analysis
                            </div>
                          </div>
                        </div>

                        <div style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                          gap: "15px"
                        }}>
                          {playlists[message._id].slice(0, 3).map((playlist, idx) => (
                            <div key={idx} style={{
                              background: "rgba(255, 255, 255, 0.15)",
                              backdropFilter: "blur(10px)",
                              padding: "15px",
                              borderRadius: "10px",
                              border: "1px solid rgba(255, 255, 255, 0.2)",
                              transition: "transform 0.3s ease",
                              cursor: "pointer"
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
                            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
                            onClick={() => window.open(playlist.url, '_blank')}
                            >
                              <div style={{
                                display: "flex",
                                gap: "12px",
                                alignItems: "flex-start"
                              }}>
                                {playlist.image && (
                                  <img 
                                    src={playlist.image} 
                                    alt={playlist.name}
                                    style={{
                                      width: "50px",
                                      height: "50px",
                                      borderRadius: "8px",
                                      objectFit: "cover",
                                      border: "2px solid rgba(255, 255, 255, 0.3)"
                                    }}
                                  />
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{
                                    fontSize: "14px",
                                    fontWeight: "700",
                                    marginBottom: "5px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                  }}>
                                    {playlist.name}
                                  </div>
                                  <div style={{
                                    fontSize: "11px",
                                    opacity: "0.9",
                                    marginBottom: "8px",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                  }}>
                                    {playlist.description || `Perfect playlist for your ${message.emotionAnalysis.primaryEmotion} mood`}
                                  </div>
                                  <div style={{
                                    display: "flex",
                                    gap: "8px",
                                    alignItems: "center",
                                    flexWrap: "wrap"
                                  }}>
                                    <div style={{
                                      background: "rgba(255, 255, 255, 0.2)",
                                      padding: "3px 8px",
                                      borderRadius: "12px",
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      border: "1px solid rgba(255, 255, 255, 0.3)"
                                    }}>
                                      🎵 {playlist.tracks} tracks
                                    </div>
                                    <div style={{
                                      background: "rgba(255, 255, 255, 0.2)",
                                      padding: "3px 8px",
                                      borderRadius: "12px",
                                      fontSize: "10px",
                                      fontWeight: "600",
                                      border: "1px solid rgba(255, 255, 255, 0.3)"
                                    }}>
                                      🎯 {playlist.matchScore}% match
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {playlists[message._id].length > 3 && (
                          <div style={{
                            textAlign: "center",
                            marginTop: "15px",
                            fontSize: "12px",
                            opacity: "0.8"
                          }}>
                            + {playlists[message._id].length - 3} more playlists available
                          </div>
                        )}

                        <div style={{
                          textAlign: "center",
                          marginTop: "15px",
                          padding: "10px",
                          background: "rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          fontSize: "11px",
                          fontWeight: "600"
                        }}>
                          🎧 Accuracy-matched playlists • Higher accuracy = More intense mood music
                        </div>
                      </div>
                    )}

                    {/* Spotify Track Player */}
                    <SpotifyPlayer 
                      message={message}
                      accuracy={message.emotionAnalysis.accuracy.overall}
                      emotion={message.emotionAnalysis.primaryEmotion}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default InputBox;
