import React, { useState } from 'react';
import { Terminal } from '@phosphor-icons/react';
import './AnalyzeAgent.css';

const AnalyzeAgent = () => {
  const [input, setInput] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;

    // Add user input to history
    setHistory(prev => [...prev, { type: 'user', content: input }]);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`http://127.0.0.1:5000/agents/analyze?address=${input}`);
      const data = await response.json();

      // Add response to history
      setHistory(prev => [...prev, { type: 'system', content: JSON.stringify(data, null, 2) }]);
    } catch (error) {
      setHistory(prev => [...prev, { type: 'error', content: 'Error analyzing agent: ' + error.message }]);
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
              <span className="prompt">
                {entry.type === 'user' ? '>' : '$'}
              </span>
              <span className="content">{entry.content}</span>
            </div>
          ))}
        </div>
        
        <form onSubmit={handleSubmit} className="terminal-input-line">
          <span className="prompt"></span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter contract address..."
            spellCheck="false"
            autoComplete="off"
          />
        </form>
      </div>
    </div>
  );
};

export default AnalyzeAgent; 