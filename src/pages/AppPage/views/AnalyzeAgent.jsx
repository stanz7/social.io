import React, { useState, useEffect } from 'react';
import { Terminal, ArrowUp, ArrowDown, ChartLineUp, Users, Brain, Coin, ChartBar, Eye, Target } from '@phosphor-icons/react';
import './AnalyzeAgent.css';

const LOADING_MESSAGES = [
  "Did you try to deploy an AI Twitter agent yet? 🤖",
  "Analyzing on-chain data and social signals... 📊",
  "Fun fact: The first AI agent was deployed in 2023 🎮",
  "Scanning Twitter for agent mentions... 🔍",
  "Did you know? Some agents have over 100k followers! 🚀",
  "Crunching the numbers and social metrics... 📈",
  "Analyzing market sentiment and mindshare... 🧠",
  "Pro tip: Agents with high mindshare often perform better 💡",
  "Looking for viral tweets and engagement... 🌟",
  "Thanks for waiting, almost done! ⚡️"
];

const AnalyzeAgent = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [history, setHistory] = useState([
    {
      type: 'system',
      content: 'Welcome to Social.io Agent Analysis Terminal'
    },
    {
      type: 'system',
      content: 'Enter a contract address to analyze an agent...'
    }
  ]);

  useEffect(() => {
    let intervalId;
    if (loading) {
      // Set initial message
      setLoadingMessage(LOADING_MESSAGES[0]);
      
      // Rotate through messages
      let messageIndex = 0;
      intervalId = setInterval(() => {
        messageIndex = (messageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[messageIndex]);
      }, 2000); // Changed from 3000 to 2000 for faster cycling
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [loading]);

  const formatMetric = (value, includeDecimals = true) => {
    if (typeof value === 'number') {
      return includeDecimals 
        ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
        : Math.round(value).toLocaleString();
    }
    return value;
  };

  const renderAnalysisBlock = (analysis) => {
    return analysis.split('\n').map((line, index) => {
      if (line.startsWith('###')) {
        return <h3 key={index}>{line.replace('###', '').trim()}</h3>;
      } else if (line.startsWith('**')) {
        return <h4 key={index}>{line.replace(/\*\*/g, '').trim()}</h4>;
      } else if (line.startsWith('-')) {
        return <li key={index}>{line.substring(1).trim()}</li>;
      }
      return <p key={index}>{line}</p>;
    });
  };

  const renderMetricsCard = (data) => {
    if (data === undefined) {
      return (
        <div className="metrics-card error">
          <div className="metrics-header">
            <h2>Error Loading Agent Data, please reference agents on cookie.fun</h2>
            <p>{data?.error || 'Unable to fetch agent metrics'}</p>
          </div>
        </div>
      );
    }
    if (!data) {
      return (
        <div className="metrics-card error">
          <div className="metrics-header">
            <h2>Error Loading Agent Data, please reference agents on cookie.fun</h2>
            <p>{data?.error || 'Unable to fetch agent metrics'}</p>
          </div>
        </div>
      );
    }

    const metrics = data.contract_data.ok;
    return (
      <div className="metrics-card">
        <div className="metrics-header">
          <h2>{metrics.agentName}</h2>
          <div className="price-section">
            <Coin size={20} weight="bold" />
            <div className="current-price">${formatMetric(metrics.price, true)}</div>
            <div className={`delta ${metrics.priceDeltaPercent > 0 ? 'positive' : 'negative'}`}>
              {metrics.priceDeltaPercent > 0 ? <ArrowUp weight="bold" /> : <ArrowDown weight="bold" />}
              {Math.abs(metrics.priceDeltaPercent).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-item">
            <label><ChartLineUp size={16} weight="bold" /> Market Cap</label>
            <div>${formatMetric(metrics.marketCap / 1000000)}M</div>
            <span className={`delta ${metrics.marketCapDeltaPercent > 0 ? 'positive' : 'negative'}`}>
              {metrics.marketCapDeltaPercent > 0 ? '↑' : '↓'} {Math.abs(metrics.marketCapDeltaPercent).toFixed(2)}%
            </span>
          </div>

          <div className="metric-item">
            <label><ChartBar size={16} weight="bold" /> 24h Volume</label>
            <div>${formatMetric(metrics.volume24Hours / 1000000)}M</div>
            <span className={`delta ${metrics.volume24HoursDeltaPercent > 0 ? 'positive' : 'negative'}`}>
              {metrics.volume24HoursDeltaPercent > 0 ? '↑' : '↓'} {Math.abs(metrics.volume24HoursDeltaPercent).toFixed(2)}%
            </span>
          </div>

          <div className="metric-item">
            <label><Users size={16} weight="bold" /> Holders</label>
            <div>{formatMetric(metrics.holdersCount, false)}</div>
            <span className={`delta ${metrics.holdersCountDeltaPercent > 0 ? 'positive' : 'negative'}`}>
              {metrics.holdersCountDeltaPercent > 0 ? '↑' : '↓'} {Math.abs(metrics.holdersCountDeltaPercent).toFixed(2)}%
            </span>
          </div>

          <div className="metric-item">
            <label><Brain size={16} weight="bold" /> Mindshare</label>
            <div>{formatMetric(metrics.mindshare)}%</div>
            <span className={`delta ${metrics.mindshareDeltaPercent > 0 ? 'positive' : 'negative'}`}>
              {metrics.mindshareDeltaPercent > 0 ? '↑' : '↓'} {Math.abs(metrics.mindshareDeltaPercent).toFixed(2)}%
            </span>
          </div>
        </div>

        {metrics.topTweets && metrics.topTweets.length > 0 && (
          <div className="top-tweets">
            <h3>Top Tweets</h3>
            <div className="tweets-grid">
              {metrics.topTweets.map((tweet, index) => (
                <a key={index} href={tweet.tweetUrl} target="_blank" rel="noopener noreferrer" className="tweet-card">
                  <img src={tweet.tweetAuthorProfileImageUrl} alt={tweet.tweetAuthorDisplayName} />
                  <div className="tweet-info">
                    <div className="tweet-author">{tweet.tweetAuthorDisplayName}</div>
                    <div className="tweet-stats">
                      <Eye size={14} /> {formatMetric(tweet.impressionsCount, false)} • 
                      <Target size={14} /> {tweet.smartEngagementPoints}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    if (input.toLowerCase() === 'clear') {
      setHistory([
        {
          type: 'system',
          content: 'Welcome to Social.io Agent Analysis Terminal'
        },
        {
          type: 'system',
          content: 'Enter a contract address to analyze an agent...'
        }
      ]);
      setInput('');
      return;
    }

    setHistory(prev => [...prev, { type: 'user', content: input }]);
    setLoading(true);

    try {
      const response = await fetch(`https://socialio-backend-d9b3a48643a2.herokuapp.com/analyze/contract/${input}`);
      const data = await response.json();

      if (!data?.contract_data?.ok) {
        throw new Error(data.error || 'Invalid contract address or agent not found');
      }

      setHistory(prev => [...prev, { 
        type: 'analysis', 
        content: data
      }]);
    } catch (error) {
      setHistory(prev => [...prev, { 
        type: 'error', 
        content: 'Error analyzing agent: ' + error.message 
      }]);
    } finally {
      setLoading(false);
    }

    setInput('');
  };

  return (
    <div className="analyze-agent">
      <div className="terminal-header">
        <Terminal size={20} weight="bold" />
        <span>Agent Analysis Terminal</span>
      </div>
      
      <div className="terminal-window">
        <div className="terminal-output">
          {history.map((entry, index) => (
            <div key={index} className={`terminal-line ${entry.type}`}>
              {entry.type === 'analysis' ? (
                <div className="analysis-container">
                  {renderMetricsCard(entry.content)}
                  <div className="analysis-text">
                    {renderAnalysisBlock(entry.content.analysis)}
                  </div>
                </div>
              ) : (
                <>
                  <span className="prompt">
                    {entry.type === 'user' ? '>' : '$'}
                  </span>
                  <span className="content">{entry.content}</span>
                </>
              )}
            </div>
          ))}
          {loading && (
            <div className="terminal-line loading">
              <span className="prompt">$</span>
              <div className="loading-content">
                <div className="loading-spinner"></div>
                <span className="loading-message">{loadingMessage}</span>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="prompt">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter contract address or type 'clear' to reset..."
            spellCheck="false"
            autoComplete="off"
            disabled={loading}
          />
        </form>
      </div>
    </div>
  );
};

export default AnalyzeAgent; 