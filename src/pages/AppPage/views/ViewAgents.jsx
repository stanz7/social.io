import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ArrowUp, 
  ArrowDown, 
  Users, 
  Brain, 
  CaretLeft, 
  CaretRight, 
  Copy, 
  CheckCircle,
  CaretUp,
  CaretDown 
} from '@phosphor-icons/react';
import './ViewAgents.css';

const ViewAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedStates, setCopiedStates] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInput, setPageInput] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'mindshare',
    direction: 'desc'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://socialio-backend-d9b3a48643a2.herokuapp.com/agents/mindsharePaged?page=${currentPage}`);
        if (response.data.success) {
          setAgents(response.data.ok.data);
          setTotalPages(response.data.ok.totalPages);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleCopy = async (contractAddress, agentName) => {
    try {
      await navigator.clipboard.writeText(contractAddress);
      setCopiedStates({ ...copiedStates, [agentName]: true });
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [agentName]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      setPageInput('');
      window.scrollTo(0, 0);
    }
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e) => {
    if (e.key === 'Enter') {
      const page = parseInt(pageInput);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        handlePageChange(page);
      }
    }
  };

  const handleSort = (key) => {
    setSortConfig((prevSort) => ({
      key,
      direction: prevSort.key === key && prevSort.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const sortedAgents = [...agents].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
  });

  const renderPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    if (start > 1) {
      pages.push(
        <button key={1} className="pagination-button" onClick={() => handlePageChange(1)}>1</button>
      );
      if (start > 2) pages.push(<span key="ellipsis1" className="pagination-ellipsis">...</span>);
    }

    for (let i = start; i <= end; i++) {
      pages.push(
        <button
          key={i}
          className={`pagination-button ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) pages.push(<span key="ellipsis2" className="pagination-ellipsis">...</span>);
      pages.push(
        <button
          key={totalPages}
          className="pagination-button"
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <div className="loading-text">
          Loading agent rankings
          <span className="dot-animation">...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="app-page">
      <h1 className="title">Agent Mindshare Rankings</h1>
      
      <div className="table-container">
        <table className="agents-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('agentName')}>
                Agent Name
                {sortConfig.key === 'agentName' && (
                  <span className="sort-icon">
                    {sortConfig.direction === 'asc' ? <CaretUp /> : <CaretDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('mindshare')}>
                Mindshare
                {sortConfig.key === 'mindshare' && (
                  <span className="sort-icon">
                    {sortConfig.direction === 'asc' ? <CaretUp /> : <CaretDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('followersCount')}>
                Followers
                {sortConfig.key === 'followersCount' && (
                  <span className="sort-icon">
                    {sortConfig.direction === 'asc' ? <CaretUp /> : <CaretDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('smartFollowersCount')}>
                Smart Followers
                {sortConfig.key === 'smartFollowersCount' && (
                  <span className="sort-icon">
                    {sortConfig.direction === 'asc' ? <CaretUp /> : <CaretDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('marketCap')}>
                Market Cap
                {sortConfig.key === 'marketCap' && (
                  <span className="sort-icon">
                    {sortConfig.direction === 'asc' ? <CaretUp /> : <CaretDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('price')}>
                Price
                {sortConfig.key === 'price' && (
                  <span className="sort-icon">
                    {sortConfig.direction === 'asc' ? <CaretUp /> : <CaretDown />}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('volume24Hours')}>
                Volume 24h
                {sortConfig.key === 'volume24Hours' && (
                  <span className="sort-icon">
                    {sortConfig.direction === 'asc' ? <CaretUp /> : <CaretDown />}
                  </span>
                )}
              </th>
              <th>Contract</th>
            </tr>
          </thead>
          <tbody>
            {sortedAgents.map((agent) => (
              <tr key={agent.agentName}>
                <td>{agent.agentName}</td>
                <td>
                  <div className="mindshare-cell">
                    {agent.mindshare.toFixed(2)}%
                    <span className={`delta ${agent.mindshareDeltaPercent > 0 ? 'positive' : 'negative'}`}>
                      {agent.mindshareDeltaPercent > 0 ? <ArrowUp weight="bold" /> : <ArrowDown weight="bold" />}
                      {Math.abs(agent.mindshareDeltaPercent).toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td>{agent.followersCount.toLocaleString()}</td>
                <td>{agent.smartFollowersCount.toLocaleString()}</td>
                <td>
                  <div className="metric-cell">
                    ${(agent.marketCap / 1000000).toFixed(2)}M
                    <span className={`delta-small ${agent.marketCapDeltaPercent > 0 ? 'positive' : 'negative'}`}>
                      {agent.marketCapDeltaPercent > 0 ? '↑' : '↓'} 
                      {Math.abs(agent.marketCapDeltaPercent).toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td>${agent.price.toFixed(6)}</td>
                <td>
                  <div className="metric-cell">
                    ${(agent.volume24Hours / 1000000).toFixed(2)}M
                    <span className={`delta-small ${agent.volume24HoursDeltaPercent > 0 ? 'positive' : 'negative'}`}>
                      {agent.volume24HoursDeltaPercent > 0 ? '↑' : '↓'} 
                      {Math.abs(agent.volume24HoursDeltaPercent).toFixed(2)}%
                    </span>
                  </div>
                </td>
                <td>
                  {agent.contracts && agent.contracts[0] && (
                    <button 
                      className={`copy-button-small ${copiedStates[agent.agentName] ? 'copied' : ''}`}
                      onClick={() => handleCopy(agent.contracts[0].contractAddress, agent.agentName)}
                    >
                      {copiedStates[agent.agentName] ? (
                        <><CheckCircle size={14} weight="bold" /></>
                      ) : (
                        <><Copy size={14} weight="bold" /></>
                      )}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <CaretLeft weight="bold" /> Previous
        </button>
        
        <div className="pagination-numbers">
          {renderPageNumbers()}
        </div>

        <div className="pagination-input">
          <input
            type="number"
            value={pageInput}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputSubmit}
            placeholder={`1-${totalPages}`}
            min="1"
            max={totalPages}
          />
        </div>
        
        <button 
          className="pagination-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next <CaretRight weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default ViewAgents; 