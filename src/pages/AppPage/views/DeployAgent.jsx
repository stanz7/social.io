import React, { useState, useEffect } from 'react';
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
  const [scheduledJobs, setScheduledJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCredsChange = (field, value) => {
    setTwitterCreds(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScheduleConfigChange = (e) => {
    setScheduleConfig({
      ...scheduleConfig,
      [e.target.name]: e.target.value
    });
  };

  const verifyCredentials = async () => {
    try {
      setIsVerifying(true);
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
        fetchScheduledJobs();
      } else {
        setIsVerified(false);
        setCredentialsStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setIsVerified(false);
      setCredentialsStatus(`Error: ${error.message}`);
    } finally {
      setIsVerifying(false);
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
        const response = await fetch(`${BASE_URL}/schedule_tweet`, {
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

  const fetchScheduledJobs = async () => {
    if (!twitterCreds.api_key) return;
    
    setIsLoadingJobs(true);
    try {
      const response = await fetch(`${BASE_URL}/get_scheduled_jobs/${twitterCreds.api_key}`);
      const data = await response.json();
      setScheduledJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching scheduled jobs:', error);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const deleteJob = async (jobId) => {
    try {
      const response = await fetch(`${BASE_URL}/delete_scheduled_job/${jobId}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.message) {
        setScheduledJobs(jobs => jobs.filter(job => job.job_id !== jobId));
        setActionsStatus('Job deleted successfully');
      }
    } catch (error) {
      setActionsStatus(`Error deleting job: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isVerified && twitterCreds.api_key) {
      fetchScheduledJobs();
    }
  }, [isVerified, twitterCreds.api_key]);

  useEffect(() => {
    if (!isScheduling) {
      fetchScheduledJobs();
    }
  }, [isScheduling]);

  const ScheduledJobsList = () => (
    <div className="scheduled-jobs">
      <div className="scheduled-jobs-header">
        <h4>Scheduled Jobs</h4>
        <button 
          className="refresh-jobs-button"
          onClick={fetchScheduledJobs}
          disabled={isLoadingJobs}
        >
          {isLoadingJobs ? 'Refreshing...' : 'Refresh Jobs'}
        </button>
      </div>
      {isLoadingJobs ? (
        <div>Loading scheduled jobs...</div>
      ) : scheduledJobs.length > 0 ? (
        <div className="jobs-list">
          {scheduledJobs.map(job => (
            <div key={job.job_id} className="job-item">
              <div className="job-details">
                <div className="job-interval">
                  Posts every {job.interval_hours} hours
                </div>
                {job.prompt && (
                  <div className="job-prompt">
                    Prompt: {job.prompt}
                  </div>
                )}
                <div className="job-created">
                  Created: {new Date(job.created_at).toLocaleString()}
                </div>
              </div>
              <button 
                className="delete-job" 
                onClick={() => deleteJob(job.job_id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>No scheduled jobs found</div>
      )}
    </div>
  );

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
                  type="password"
                  value={twitterCreds.api_key || ''}
                  onChange={(e) => handleCredsChange('api_key', e.target.value)}
                  placeholder="Enter API Key"
                />
              </div>
              <div className="input-group">
                <label>API Secret</label>
                <input
                  type="password"
                  value={twitterCreds.api_secret || ''}
                  onChange={(e) => handleCredsChange('api_secret', e.target.value)}
                  placeholder="Enter API Secret"
                />
              </div>
              <div className="input-group">
                <label>Access Token</label>
                <input
                  type="password"
                  value={twitterCreds.access_token || ''}
                  onChange={(e) => handleCredsChange('access_token', e.target.value)}
                  placeholder="Enter Access Token"
                />
              </div>
              <div className="input-group">
                <label>Access Secret</label>
                <input
                  type="password"
                  value={twitterCreds.access_secret || ''}
                  onChange={(e) => handleCredsChange('access_secret', e.target.value)}
                  placeholder="Enter Access Secret"
                />
              </div>
              <div className="input-group">
                <label>Bearer Token</label>
                <input
                  type="password"
                  value={twitterCreds.bearer_token || ''}
                  onChange={(e) => handleCredsChange('bearer_token', e.target.value)}
                  placeholder="Enter Bearer Token"
                />
              </div>
              <button onClick={verifyCredentials} disabled={isVerifying}>
                {isVerifying ? 'Verifying...' : 'Verify Credentials'}
              </button>
              {credentialsStatus && <div className="status-message">{credentialsStatus}</div>}
            </div>
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
                    placeholder="E.g., 'Leaving this empty will default to our preset prompt, which is to find outliers in the mindshare metrics'"
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

            <ScheduledJobsList />

            {actionsStatus && <div className="status-message">{actionsStatus}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeployAgent; 