import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './pages/Login';
import { getStoredUser, getStoredToken, logout } from './services/auth';
import {
  addConversation,
  getAllConversations,
  getConversationsByCategory,
  getConversationsSortedByTime,
  deleteConversation,
  updateConversation,
  getConversationsPaginated,
  getConversationsByCategoryPaginated,
  getConversationsSortedByTimePaginated,
} from './services/api';

function App() {
  const [conversations, setConversations] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [category, setCategory] = useState('General');
  const [filter, setFilter] = useState('All Conversations');
  const [apiError, setApiError] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!getStoredToken());
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  const loadConversations = async (page = currentPage, size = pageSize) => {
    setLoading(true);
    setErrorMessage('');
    try {
      let data;
      // For now, use the old endpoints and implement client-side pagination
      if (filter === 'All Conversations') {
        data = await getAllConversations();
      } else if (filter === 'sorted') {
        data = await getConversationsSortedByTime();
      } else {
        data = await getConversationsByCategory(filter);
      }
      
      // Client-side pagination
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedData = data.slice(startIndex, endIndex);
      
      setConversations(paginatedData);
      setTotalPages(Math.ceil(data.length / size));
      setTotalElements(data.length);
      setCurrentPage(page);
      setApiError(false);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
      setApiError(true);
      setErrorMessage(error.message || 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || !response.trim()) return;

    setLoading(true);
    setErrorMessage('');
    try {
      const conversationData = {
        prompt,
        response,
        category,
        timestamp: editingId ? conversations.find(c => c.id === editingId)?.timestamp : new Date().toISOString(),
      };
      
      if (editingId) {
        await updateConversation(editingId, conversationData);
        setEditingId(null);
      } else {
        await addConversation(conversationData);
      }
      
      setPrompt('');
      setResponse('');
      setCategory('General');
      await loadConversations();
    } catch (error) {
      console.error('Error saving conversation:', error);
      setErrorMessage(error.message || 'Failed to save conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this conversation?')) return;
    
    setLoading(true);
    setErrorMessage('');
    try {
      await deleteConversation(id);
      await loadConversations();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setErrorMessage(error.message || 'Failed to delete conversation');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (conv) => {
    setPrompt(conv.prompt);
    setResponse(conv.response);
    setCategory(conv.category);
    setEditingId(conv.id);
  };

  const handleCancelEdit = () => {
    setPrompt('');
    setResponse('');
    setCategory('General');
    setEditingId(null);
  };

  const handleFilterChange = async (e) => {
    const value = e.target.value;
    setFilter(value);
    setCurrentPage(0); // Reset to first page when filter changes
    await loadConversations(0, pageSize);
  };

  const handlePageSizeChange = async (e) => {
    const newSize = parseInt(e.target.value);
    setPageSize(newSize);
    setCurrentPage(0); // Reset to first page when page size changes
    await loadConversations(0, newSize);
  };

  const handlePageChange = async (newPage) => {
    await loadConversations(newPage, pageSize);
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      handlePageChange(currentPage + 1);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsAuthenticated(false);
    setConversations([]);
  };

  const getRoleBadge = () => {
    if (!user) return null;
    const roleColors = {
      'ROLE_ADMIN': '#e74c3c',
      'ROLE_RESEARCHER': '#3498db',
      'ROLE_ENGINEER': '#9b59b6',
      'ROLE_PREMIUM': '#f39c12',
      'ROLE_USER': '#95a5a6'
    };
    const roleNames = {
      'ROLE_ADMIN': 'Admin',
      'ROLE_RESEARCHER': 'Researcher',
      'ROLE_ENGINEER': 'Engineer',
      'ROLE_PREMIUM': 'Premium',
      'ROLE_USER': 'User'
    };
    return (
      <span className="role-badge" style={{ backgroundColor: roleColors[user.role] }}>
        {roleNames[user.role]}
      </span>
    );
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <div className="header">
        <div className="header-top">
          <div>
            <h1>ChatGPT Conversation Manager</h1>
            <p>Organize your AI chats efficiently</p>
          </div>
          <div className="user-info">
            <div>
              <span className="username">Welcome, {user.username}!</span>
              {getRoleBadge()}
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
        {apiError && (
          <div style={{color: 'orange', padding: '10px', background: '#fff3cd', border: '1px solid #ffeaa7', borderRadius: '4px', margin: '10px 0'}}>
            ⚠️ Backend API is not available. Please ensure the Spring Boot server is running on port 8081.
          </div>
        )}
        {errorMessage && (
          <div style={{color: '#721c24', padding: '10px', background: '#f8d7da', border: '1px solid #f5c6cb', borderRadius: '4px', margin: '10px 0'}}>
            ❌ {errorMessage}
          </div>
        )}
        {loading && (
          <div style={{color: '#004085', padding: '10px', background: '#cce5ff', border: '1px solid #99ccff', borderRadius: '4px', margin: '10px 0'}}>
            ⏳ Loading...
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          required
        />
        <textarea
          placeholder="Enter response"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          required
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="General">General</option>
          <option value="Education">Education</option>
          <option value="Coding">Coding</option>
          <option value="Career">Career</option>
        </select>
        <button type="submit" disabled={loading}>{editingId ? 'Update' : 'Add'} Conversation</button>
        {editingId && <button type="button" onClick={handleCancelEdit} disabled={loading}>Cancel</button>}
      </form>

      <div className="controls">
        <div className="filter-controls">
          <select value={filter} onChange={handleFilterChange}>
            <option value="All Conversations">All Conversations</option>
            <option value="General">General</option>
            <option value="Education">Education</option>
            <option value="Coding">Coding</option>
            <option value="Career">Career</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="Health">Health</option>
            <option value="Business">Business</option>
            <option value="Environment">Environment</option>
            <option value="sorted">Sorted by Time</option>
          </select>
        </div>
        
        <div className="pagination-controls">
          <div className="page-size-selector">
            <label htmlFor="pageSize">Items per page:</label>
            <select id="pageSize" value={pageSize} onChange={handlePageSizeChange}>
              <option value={5}>5</option>
              <option value={10}>10</option>
            </select>
          </div>
          
          <div className="page-info">
            Showing {conversations.length} of {totalElements} conversations
            (Page {currentPage + 1} of {totalPages})
          </div>
          
          <div className="page-navigation">
            <button 
              onClick={handlePreviousPage} 
              disabled={currentPage === 0 || loading}
              className="page-btn"
            >
              Previous
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i;
                } else if (currentPage < 3) {
                  pageNum = i;
                } else if (currentPage >= totalPages - 3) {
                  pageNum = totalPages - 5 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={loading}
                    className={`page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={handleNextPage} 
              disabled={currentPage >= totalPages - 1 || loading}
              className="page-btn"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="chat-list">
        {conversations.length === 0 ? (
          <p className="empty">No conversations found</p>
        ) : (
          conversations.map((conv) => (
            <div key={conv.id} className="chat-card">
              <h3>{conv.prompt}</h3>
              <div className="response">{conv.response}</div>
              <div className="meta">
                Category: {conv.category} | Time: {new Date(conv.timestamp).toLocaleString()}
              </div>
              <div className="actions">
                <button className="edit-btn" onClick={() => handleEdit(conv)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(conv.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;