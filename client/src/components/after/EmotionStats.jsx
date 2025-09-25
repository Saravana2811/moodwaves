import React, { useState, useEffect } from 'react';

function EmotionStats() {
  const [stats, setStats] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchEmotionStats();
    fetchMessages();
  }, []);

  const fetchEmotionStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages/stats/emotions');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching emotion stats:', error);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/messages');
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading emotion analytics...
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '40px auto', 
      padding: '0 20px' 
    }}>
      <h2 style={{ 
        textAlign: 'center', 
        color: 'white', 
        marginBottom: '30px',
        fontSize: '2.5rem',
        fontWeight: '700'
      }}>
        📊 Emotion Analytics Dashboard
      </h2>

      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginBottom: '30px',
        gap: '10px',
        flexWrap: 'wrap'
      }}>
        {['overview', 'history'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              borderRadius: '25px',
              border: 'none',
              background: activeTab === tab ? '#ce6714ff' : 'rgba(255,255,255,0.2)',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.3s ease'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && stats && (
        <div style={{ display: 'grid', gap: '25px' }}>
          {/* Summary Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px' 
          }}>
            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#ce6714ff', fontSize: '2rem', margin: '0 0 10px 0' }}>
                {stats.totalAnalyzed}
              </h3>
              <p style={{ color: '#6B7280', margin: 0 }}>Messages Analyzed</p>
            </div>

            <div style={{
              background: 'white',
              padding: '25px',
              borderRadius: '15px',
              textAlign: 'center',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#22C55E', fontSize: '2rem', margin: '0 0 10px 0' }}>
                {Math.round(stats.averageAccuracy * 100)}%
              </h3>
              <p style={{ color: '#6B7280', margin: 0 }}>Average Accuracy</p>
            </div>
          </div>

          {/* Emotion Distribution */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              color: '#374151', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>
              Emotion Distribution
            </h3>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '15px' 
            }}>
              {Object.entries(stats.emotionDistribution).map(([emotion, count]) => (
                <div key={emotion} style={{ textAlign: 'center' }}>
                  <div style={{
                    background: getEmotionColor(emotion),
                    color: 'white',
                    padding: '15px',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    fontSize: '1.2rem',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {emotion}
                  </div>
                  <div style={{ 
                    color: '#374151', 
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}>
                    {count} messages
                  </div>
                  <div style={{ 
                    color: '#6B7280', 
                    fontSize: '0.9rem' 
                  }}>
                    {Math.round((count / stats.totalAnalyzed) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              color: '#374151', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>
              Sentiment Analysis
            </h3>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-around',
              flexWrap: 'wrap',
              gap: '20px'
            }}>
              {Object.entries(stats.sentimentDistribution).map(([sentiment, count]) => (
                <div key={sentiment} style={{ textAlign: 'center' }}>
                  <div style={{
                    background: getSentimentColor(sentiment),
                    color: 'white',
                    padding: '20px',
                    borderRadius: '50%',
                    width: '80px',
                    height: '80px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 15px auto',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                  }}>
                    {count}
                  </div>
                  <div style={{ 
                    color: '#374151', 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {sentiment}
                  </div>
                  <div style={{ 
                    color: '#6B7280', 
                    fontSize: '0.9rem' 
                  }}>
                    {Math.round((count / stats.totalAnalyzed) * 100)}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Keywords */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ 
              color: '#374151', 
              marginBottom: '25px',
              textAlign: 'center',
              fontSize: '1.5rem'
            }}>
              Most Common Emotional Keywords
            </h3>
            <div style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '10px',
              justifyContent: 'center'
            }}>
              {Object.entries(stats.topKeywords).map(([keyword, count]) => (
                <span
                  key={keyword}
                  style={{
                    background: '#F3F4F6',
                    color: '#374151',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '600',
                    border: '2px solid #ce6714ff'
                  }}
                >
                  {keyword} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            color: '#374151', 
            marginBottom: '25px',
            textAlign: 'center',
            fontSize: '1.5rem'
          }}>
            Analysis History
          </h3>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {messages.filter(msg => msg.emotionAnalysis).map((message, index) => (
              <div key={message._id} style={{
                padding: '20px',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                marginBottom: '15px',
                background: '#F9FAFB'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  marginBottom: '15px'
                }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      color: '#374151', 
                      fontSize: '16px',
                      margin: '0 0 10px 0',
                      fontWeight: '600'
                    }}>
                      "{message.text}"
                    </p>
                    <p style={{ 
                      color: '#6B7280', 
                      fontSize: '12px',
                      margin: 0
                    }}>
                      {formatDate(message.createdAt)}
                    </p>
                  </div>
                  <div style={{
                    background: getEmotionColor(message.emotionAnalysis.primaryEmotion),
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '15px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    marginLeft: '15px'
                  }}>
                    {message.emotionAnalysis.primaryEmotion}
                  </div>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  gap: '15px', 
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    background: getSentimentColor(message.emotionAnalysis.sentiment.label),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {message.emotionAnalysis.sentiment.label}
                  </div>
                  
                  <div style={{ 
                    color: '#374151',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    Accuracy: {Math.round(message.emotionAnalysis.accuracy.overall * 100)}%
                  </div>
                  
                  {message.emotionAnalysis.keywords.length > 0 && (
                    <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                      {message.emotionAnalysis.keywords.slice(0, 3).map((keyword, i) => (
                        <span key={i} style={{
                          background: '#E5E7EB',
                          color: '#4B5563',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px'
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmotionStats;