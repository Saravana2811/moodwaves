import React, { useState } from 'react';

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is MoodWaves?",
      answer: "MoodWaves is an AI-powered music recommendation platform that curates playlists based on your current mood, emotions, and preferences. Simply describe how you're feeling, and we'll create the perfect soundtrack for your moment."
    },
    {
      question: "How does the mood-based music recommendation work?",
      answer: "Our advanced AI analyzes your mood description, time of day, and listening preferences to suggest songs that match your emotional state. We use natural language processing to understand nuanced emotions and pair them with our extensive music database."
    },
    {
      question: "Is MoodWaves free to use?",
      answer: "MoodWaves offers both free and premium tiers. Free users can generate mood-based playlists with basic features, while premium subscribers get unlimited playlist generation, advanced mood analysis, offline downloads, and exclusive content."
    },
    {
      question: "Can I save my generated playlists?",
      answer: "Yes! All users can save their generated playlists to their personal library. Premium users can also export playlists to Spotify, Apple Music, and other streaming platforms."
    },
    {
      question: "What music streaming services does MoodWaves support?",
      answer: "MoodWaves integrates with major streaming platforms including Spotify, Apple Music, YouTube Music, and Amazon Music. You can connect your accounts to seamlessly transfer playlists and access your existing music library."
    },
    {
      question: "How accurate are the mood recommendations?",
      answer: "Our AI continuously learns from user feedback and listening patterns to improve accuracy. Most users report 85-90% satisfaction with their mood-matched recommendations, and the system gets better as you use it more."
    },
    {
      question: "Can I customize my music preferences?",
      answer: "Absolutely! You can set preferred genres, artists, decades, languages, and even exclude certain types of music. The more you customize your profile, the better our recommendations become."
    },
    {
      question: "Is my data secure with MoodWaves?",
      answer: "We take privacy seriously. Your mood data and listening habits are encrypted and never shared with third parties. You have full control over your data and can delete your account and all associated data at any time."
    }
  ];

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const containerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '40px',
    background: 'white',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  };

  const faqItemStyle = {
    marginBottom: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease'
  };

  const questionStyle = {
    padding: '20px 24px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2d3748',
    backgroundColor: 'transparent',
    transition: 'background-color 0.3s ease'
  };

  const questionHoverStyle = {
    backgroundColor: 'rgba(102, 126, 234, 0.1)'
  };

  const answerStyle = {
    padding: '0 24px 20px 24px',
    fontSize: '1rem',
    lineHeight: '1.6',
    color: '#4a5568',
    backgroundColor: 'rgba(247, 250, 252, 0.8)'
  };

  const iconStyle = {
    fontSize: '1.2rem',
    color: '#667eea',
    transition: 'transform 0.3s ease'
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>Frequently Asked Questions</h2>
      
      <div>
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            style={{
              ...faqItemStyle,
              transform: openIndex === index ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: openIndex === index 
                ? '0 8px 25px rgba(0, 0, 0, 0.15)' 
                : '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div
              style={questionStyle}
              onClick={() => toggleFaq(index)}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = questionHoverStyle.backgroundColor;
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <span>{faq.question}</span>
              <span 
                style={{
                  ...iconStyle,
                  transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              >
                ▼
              </span>
            </div>
            
            {openIndex === index && (
              <div style={answerStyle}>
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;