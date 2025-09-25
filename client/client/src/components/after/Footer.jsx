import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>MoodWaves</h3>
          <p>We Bring Music And Emotions Together</p>
          <div className="contact-info">
            <span></span>
          </div>
        </div>

        <div className="footer-section">
          <h4>Features</h4>
          <ul className="footer-links">
            <li>Mood-Based Songs</li>
            <li>Emotional Analytics</li>
            <li>Seamless Streamng</li>
            <li>AI Recommendation</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Available On</h4>
          <ul className="footer-links">
            <li>Desktop</li>
            <li>Windows</li>
            <li>Ios</li>
            <li>WebPages</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Support</h4>
          <ul className="footer-links">
            <li>FAQs</li>
            <li>Contact Us</li>
            <li>Help Center</li>
            <li className="emergency">24/7 Emergency Service</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 MoodWaves. All rights reserved. Licensed & Insured.</p>
        <p className="design">Designed and Maintained By Saravana M || Shanmuga Patel Kani C</p>
      </div>
    </footer>
  );
};

export default Footer;