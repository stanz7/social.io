import React, { useState } from 'react';
import './AppPage.css';
import Header from '../../components/Header';
import ViewAgents from './views/ViewAgents';
import AnalyzeAgent from './views/AnalyzeAgent';
import DeployAgent from './views/DeployAgent';
import { List, MagnifyingGlass, Rocket } from '@phosphor-icons/react';

const AppPage = () => {
  const [activeTab, setActiveTab] = useState('view');

  const tabs = [
    { id: 'view', label: 'View Agents/Tokens', icon: <List weight="bold" /> },
    { id: 'analyze', label: 'Analyze Agent', icon: <MagnifyingGlass weight="bold" /> },
    { id: 'deploy', label: 'Deploy Twitter AI Agent', icon: <Rocket weight="bold" /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'view':
        return <ViewAgents />;
      case 'analyze':
        return <AnalyzeAgent />;
      case 'deploy':
        return <DeployAgent />;
      default:
        return <ViewAgents />;
    }
  };

  return (
    <div className="app-page">
      <div className="background-container"></div>
      <div className="background-overlay"></div>
      
      <Header className="header"/>
      
      <main className="app-content">
        <div className="tab-container">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
        
        <div className={`content-container ${activeTab === 'analyze' ? 'analyze-view' : ''}`}>
          {renderContent()}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Socialfy. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AppPage;
