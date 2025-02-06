import React, { useState } from 'react';
import './DeployAgent.css';

const BASE_URL = 'http://127.0.0.1:5000';

const DeployAgent = () => {
  const [activeTab, setActiveTab] = useState('credentials');
  const [twitterCreds, setTwitterCreds] = useState({
    api_key: '',
    api_secret: '',
    access_token: '',
    access_secret: '',
    bearer_token: ''
  });
  const [scheduleConfig, setScheduleConfig] = useState({
    prompt: '',
    interval_hours: 1
  });
  const [status, setStatus] = useState('');

  const handleCredsChange = (e) => {
    setTwitterCreds({
      ...twitterCreds,
      [e.target.name]: e.target.value
    });
  };

  const handleScheduleConfigChange = (e) => {
    setScheduleConfig({
      ...scheduleConfig,
      [e.target.name]: e.target.value
    });
  };

  const verifyCredentials = async () => {
    try {
      const response = await fetch(`${BASE_URL}/verify_twitter_credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(twitterCreds)
      });
      const data = await response.json();
      setStatus(data.success ? `Verified as @${data.username}` : `Error: ${data.error}`);
      if (data.success) {
        setActiveTab('actions');
      }
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const generateTweet = async () => {
    try {
      const response = await fetch(`${BASE_URL}/generate_and_post_tweet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(twitterCreds)
      });
      const data = await response.json();
      setStatus(data.success ? `Tweet posted: ${data.tweet}` : `Error: ${data.error}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const scheduleTweets = async () => {
    try {
      const response = await fetch(`${BASE_URL}/schedule_tweets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          twitter_creds: twitterCreds,
          ...scheduleConfig
        })
      });
      const data = await response.json();
      setStatus(data.success ? `Schedule created: ${data.job_id}` : `Error: ${data.error}`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="deploy-agent">
      <h2>Deploy Twitter AI Agent</h2>
      
      <div className="toggle-switch-container">
        <div className="toggle-switch">
          <input 
            type="checkbox" 
            id="switch" 
            checked={activeTab === 'actions'}
            onChange={() => setActiveTab(activeTab === 'credentials' ? 'actions' : 'credentials')}
          />
          <label htmlFor="switch">
            <span className="toggle-label left">Credentials</span>
            <span className="toggle-label right">Actions</span>
          </label>
        </div>
      </div>

      <div className="tab-content">
        <div className={`tab-panel ${activeTab === 'credentials' ? 'active' : ''}`}>
          <div className="credentials-section">
            <h3>Twitter Credentials</h3>
            <div className="form-group">
              <input type="text" name="api_key" placeholder="API Key" value={twitterCreds.api_key} onChange={handleCredsChange} />
              <input type="text" name="api_secret" placeholder="API Secret" value={twitterCreds.api_secret} onChange={handleCredsChange} />
              <input type="text" name="access_token" placeholder="Access Token" value={twitterCreds.access_token} onChange={handleCredsChange} />
              <input type="text" name="access_secret" placeholder="Access Secret" value={twitterCreds.access_secret} onChange={handleCredsChange} />
              <input type="text" name="bearer_token" placeholder="Bearer Token" value={twitterCreds.bearer_token} onChange={handleCredsChange} />
              <button onClick={verifyCredentials}>Verify & Continue</button>
            </div>
          </div>
        </div>

        <div className={`tab-panel ${activeTab === 'actions' ? 'active' : ''}`}>
          <div className="actions-section">
            <h3>Tweet Actions</h3>
            <button onClick={generateTweet}>Generate & Post Single Tweet</button>
            
            <div className="schedule-section">
              <h4>Schedule Tweets</h4>
              <div className="form-group">
                <textarea
                  name="prompt"
                  placeholder="Custom prompt (optional)"
                  value={scheduleConfig.prompt}
                  onChange={handleScheduleConfigChange}
                />
                <input
                  type="number"
                  name="interval_hours"
                  placeholder="Interval (hours)"
                  min="0.0166667"
                  max="24"
                  step="0.0166667"
                  value={scheduleConfig.interval_hours}
                  onChange={handleScheduleConfigChange}
                />
                <button onClick={scheduleTweets}>Schedule Tweets</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {status && <div className="status-message">{status}</div>}
    </div>
  );
};

export default DeployAgent; 