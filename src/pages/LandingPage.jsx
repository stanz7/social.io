import React, { useEffect, useState } from 'react';
import './LandingPage.css';
import Header from '../components/Header';
import backgroundGif from '../assets/giphy.gif'; // Import the GIF
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="landing-page">
      <div className="cursor-light" style={{
        left: `${mousePosition.x}px`,
        top: `${mousePosition.y}px`
      }}></div>
      <div 
        className="background-container" 
        style={{ backgroundImage: `url(${backgroundGif})` }}
      ></div>
      <div className="background-overlay"></div>
      
      <Header />
      <section className="hero-section">
        <h1 className="hero-title">social.io</h1>
        <p className="hero-subtext">
          Analyze crypto social sentiment and automate your Twitter presence with AI. 
          Deploy intelligent agents that understand market metrics and engage authentically.
        </p>
        <button className="hero-button" onClick={() => navigate('/app')}>
          Launch App
        </button>
        <span className="powered-by">powered by cookie.fun</span>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Socialfy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
