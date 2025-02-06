import React from 'react';
import { Link } from 'react-router-dom';
import { TwitterLogo } from '@phosphor-icons/react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="brand-link">
        <h1 className="brand-name">SOCIAL.IO</h1>
      </Link>
      <a 
        href="https://twitter.com/socialdotio_" 
        target="_blank" 
        rel="noopener noreferrer"
        className="twitter-link"
      >
        <TwitterLogo size={24} weight="bold" />
      </a>
    </header>
  );
};

export default Header;