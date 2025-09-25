import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import Footer from "../after/footer.jsx";
function BeforeSignIn() {
  const [isLoaded, setIsLoaded] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };


  const navbarStyle = {
    background: "linear-gradient(135deg, #ce6714ff 79%)", // updated to match main background
    position: "sticky",
    top: 0,
    zIndex: 50,
  };


  const navbarInnerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    maxWidth: "1200px",
    margin: "0 auto",
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

  const navActionsStyle = {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  };

  const loginButtonStyle = {
    color: "#ffffff",
    backgroundColor: "transparent",
    padding: "10px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.3)",
    cursor: "pointer",
  };

  const signupButtonStyle = {
   color: "#ffffff",
    backgroundColor: "transparent",
    padding: "10px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.3)",
    cursor: "pointer",
  };

  const containerStyle = {
    minHeight: "calc(100vh - 80px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #ce6714ff 50%, #85d995ff 0%)",
    padding: "80px 24px",
    position: "relative",
    overflow: "hidden",
  };

  const heroStyle = {
    maxWidth: "900px",
    width: "100%",
    textAlign: "center",
    color: "#e2e8f0",
    margin: "0 auto",
    transform: isLoaded ? "translateY(0) scale(1)" : "translateY(20px) scale(0.95)",
    opacity: isLoaded ? 1 : 0,
    transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
  };

  const titleStyle = {
    fontSize: "clamp(32px, 6vw, 64px)",
    lineHeight: 1.1,
    margin: "0 0 24px 0",
    fontWeight: 900,
    background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 50%, #cbd5e1 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    textShadow: "0 4px 20px rgba(255, 255, 255, 0.1)",
  };

  const subtitleStyle = {
    fontSize: "clamp(16px, 2.5vw, 20px)",
    lineHeight: 1.7,
    margin: "0 0 40px 0",
    opacity: 0.9,
    maxWidth: "750px",
    marginInline: "auto",
    color: "#cbd5e1",
  };

  const ctaContainerStyle = {
    marginTop: "32px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  };

  const ctaButtonStyle = {
    padding: "14px 28px",
    borderRadius: "16px",
    fontWeight: 700,
    textDecoration: "none",
    fontSize: "16px",
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
  };

  const primaryCTAStyle = {
    ...ctaButtonStyle,
    color: "#ffffff",
    backgroundColor: "transparent",
    padding: "10px 18px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: 600,
    border: "1px solid rgba(255,255,255,0.3)",
    cursor: "pointer",
  };

  const secondaryCTAStyle = {
    ...ctaButtonStyle,
    backgroundColor: "transparent",
    color: "#ffffff",
    border: "2px solid rgba(255,255,255,0.3)",
  };

  const featuresStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
    marginTop: "60px",
    maxWidth: "800px",
    marginInline: "auto",
  };

  const featureCardStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    borderRadius: "16px",
    padding: "24px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    cursor: "pointer",
  };

  const footerStyle = {
    textAlign: "center",
    padding: "32px 24px",
    fontSize: "14px",
    color: "#94a3b8",
    borderTop: "1px solid rgba(148, 163, 184, 0.1)",
    background: "rgba(15, 23, 42, 0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
  };

  const backgroundDecorStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
    `,
    pointerEvents: "none",
  };

  const features = [
    {
      icon: "🎵",
      title: "AI-Powered Mood Detection",
      description: "Advanced algorithms analyze your preferences to understand your current mood"
    },
    {
      icon: "🎧",
      title: "Smart Playlists",
      description: "Curated tracks that perfectly match your emotional state and music taste"
    },
    {
      icon: "✨",
      title: "Personalized Experience",
      description: "Learn from your listening habits to provide increasingly better recommendations"
    }
  ];

  return (
    <div>
      {/* Navbar */}
      <header style={navbarStyle}>
        <nav style={navbarInnerStyle}>
          <div style={brandStyle} onClick={() => handleNavigation('/')}>
            MoodTunes
          </div>
          <div style={navActionsStyle}>
            <button
              style={loginButtonStyle}
              onClick={() => handleNavigation('/login')}
            >
              Log in
            </button>
            <button
              style={signupButtonStyle}
              onClick={() => handleNavigation('/signup')}
            >
              Sign up
            </button>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <main style={containerStyle}>
        <div style={backgroundDecorStyle}></div>
        <section style={heroStyle}>
          <h1 style={titleStyle}>
            Discover music that matches your mood
          </h1>
          <p style={subtitleStyle}>
            Create the perfect playlist using AI-powered mood detection. Let MoodTunes 
            curate tracks tailored to how you feel, delivering a personalized listening 
            experience that evolves with your emotions.
          </p>

          {/* Call-to-Action */}
          <div style={ctaContainerStyle}>
            <button 
              style={primaryCTAStyle}
              onClick={() => handleNavigation('/home')}
            >
              Get Started Free
            </button>
            <button 
              style={secondaryCTAStyle}
              onClick={() => handleNavigation('/login')}
            >
              Log in
            </button>
          </div>

          {/* Features */}
          <div style={featuresStyle}>
            {features.map((feature, index) => (
              <div 
                key={index} 
                style={{
                  ...featureCardStyle,
                  transform: isLoaded ? "translateY(0)" : "translateY(30px)",
                  opacity: isLoaded ? 1 : 0,
                  transitionDelay: `${0.2 + index * 0.1}s`,
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "16px" }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  color: "#ffffff", 
                  fontSize: "18px", 
                  fontWeight: 700, 
                  marginBottom: "8px" 
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: "#cbd5e1", 
                  fontSize: "14px", 
                  lineHeight: 1.5,
                  margin: 0 
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default BeforeSignIn;