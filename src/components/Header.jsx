import React from 'react';
import { Link } from 'react-router-dom';
import { TwitterLogo } from '@phosphor-icons/react';
import './Header.css';
import gitbookLogo from './gitbook.jpg';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="brand-link">
        <h1 className="brand-name">SOCIAL.IO</h1>
      </Link>
      <div className="social-links">
        <a 
          href="https://twitter.com/socialdotio_" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link"
        >
          <TwitterLogo size={24} weight="bold" />
        </a>
        <a 
          href="https://social-io.gitbook.io/social.io" 
          target="_blank" 
          rel="noopener noreferrer"
          className="social-link"
        >
          <img 
            src={gitbookLogo} 
            alt="GitBook Documentation" 
            className="gitbook-logo"
          />
        </a>
      </div>
    </header>
  );
};

export default Header;