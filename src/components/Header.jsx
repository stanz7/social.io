import React from 'react';
import { TwitterLogo } from '@phosphor-icons/react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <h1 className="brand-name">SOCIAL.IO</h1>
      <a 
        href="https://twitter.com/socialfy" 
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