import React, { useState } from 'react';
import './DeployAgent.css';

const BASE_URL = 'https://socialio-backend-d9b3a48643a2.herokuapp.com/';

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
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [credentialsStatus, setCredentialsStatus] = useState('');
  const [actionsStatus, setActionsStatus] = useState('');
  const [isVerified, setIsVerified] = useState(false);

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
      if (data.success) {
        setIsVerified(true);
        setVerificationStatus(`Verified as @${data.username}`);
        setCredentialsStatus('');
        setActiveTab('actions');
      } else {
        setIsVerified(false);
        setCredentialsStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setIsVerified(false);
      setCredentialsStatus(`Error: ${error.message}`);
    }
  };

  const checkVerifiedAndExecute = (action) => {
    if (!isVerified) {
      window.alert('Please verify your Twitter credentials before performing any actions');
      setActiveTab('credentials');
      return;
    }
    action();
  };

  const generateTweet = async () => {
    checkVerifiedAndExecute(async () => {
      setIsGenerating(true);
      try {
        const response = await fetch(`${BASE_URL}/generate_and_post_tweet`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(twitterCreds)
        });
        const data = await response.json();
        setActionsStatus(data.success ? `Tweet posted: ${data.tweet}` : `Error: ${data.error}`);
      } catch (error) {
        setActionsStatus(`Error: ${error.message}`);
      } finally {
        setIsGenerating(false);
      }
    });
  };

  const scheduleTweets = async () => {
    checkVerifiedAndExecute(async () => {
      setIsScheduling(true);
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
        setActionsStatus(data.success ? `Schedule created: ${data.job_id}` : `Error: ${data.error}`);
      } catch (error) {
        setActionsStatus(`Error: ${error.message}`);
      } finally {
        setIsScheduling(false);
      }
    });
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
        {verificationStatus && (
          <div className="verification-status">{verificationStatus}</div>
        )}
      </div>

      <div className="tab-content">
        <div className={`tab-panel ${activeTab === 'credentials' ? 'active' : ''}`}>
          <div className="credentials-section">
            <h3>Twitter Credentials</h3>
            <div className="section-description">
              Enter your Twitter API credentials to enable the AI agent to post tweets on your behalf.
            </div>
            <div className="form-group">
              <div className="input-group">
                <label>API Key</label>
                <input 
                  type="text" 
                  name="api_key" 
                  placeholder="Enter your API key" 
                  value={twitterCreds.api_key} 
                  onChange={handleCredsChange} 
                />
              </div>

              <div className="input-group">
                <label>API Secret</label>
                <input 
                  type="text" 
                  name="api_secret" 
                  placeholder="Enter your API secret" 
                  value={twitterCreds.api_secret} 
                  onChange={handleCredsChange} 
                />
              </div>

              <div className="input-group">
                <label>Access Token</label>
                <input 
                  type="text" 
                  name="access_token" 
                  placeholder="Enter your access token" 
                  value={twitterCreds.access_token} 
                  onChange={handleCredsChange} 
                />
              </div>

              <div className="input-group">
                <label>Access Secret</label>
                <input 
                  type="text" 
                  name="access_secret" 
                  placeholder="Enter your access token secret" 
                  value={twitterCreds.access_secret} 
                  onChange={handleCredsChange} 
                />
              </div>

              <div className="input-group">
                <label>Bearer Token</label>
                <input 
                  type="text" 
                  name="bearer_token" 
                  placeholder="Enter your bearer token" 
                  value={twitterCreds.bearer_token} 
                  onChange={handleCredsChange} 
                />
              </div>

              <button onClick={verifyCredentials}>Verify & Continue</button>
            </div>
            {credentialsStatus && <div className="status-message">{credentialsStatus}</div>}
          </div>
        </div>

        <div className={`tab-panel ${activeTab === 'actions' ? 'active' : ''}`}>
          <div className="actions-section">
            <h3>Tweet Actions</h3>
            
            <div className="single-tweet-section">
              <div className="section-description">
                Generate and post a single tweet using AI & cookie.fun mindshare metrics. This will immediately create and post a tweet to your account.
              </div>
              <button 
                onClick={generateTweet} 
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate & Post Single Tweet'}
              </button>
            </div>
            
            <div className="schedule-section">
              <h4>Schedule Tweets</h4>
              <div className="section-description">
                Set up automated tweet generation and posting at regular intervals.
              </div>
              <div className="form-group">
                <div className="input-group">
                  <label>Custom Prompt</label>
                  <div className="input-description">
                    Guide the AI with specific topics or style preferences (optional)
                  </div>
                  <textarea
                    name="prompt"
                    placeholder="E.g., 'Write tweets about AI technology with a casual tone'"
                    value={scheduleConfig.prompt}
                    onChange={handleScheduleConfigChange}
                  />
                </div>
                <div className="input-group">
                  <label>Posting Interval</label>
                  <div className="input-description">
                    How often should new tweets be generated and posted (in hours)
                  </div>
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
                </div>
                <button 
                  onClick={scheduleTweets}
                  disabled={isScheduling}
                >
                  {isScheduling ? 'Scheduling...' : 'Schedule Tweets'}
                </button>
              </div>
            </div>

            {actionsStatus && <div className="status-message">{actionsStatus}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployAgent; 