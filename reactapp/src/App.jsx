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

  useEffect(() => {
    if (isAuthenticated) {
      loadConversations();
    }
  }, [isAuthenticated]);

  const loadConversations = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const data = await getAllConversations();
      setConversations(data);
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
    setLoading(true);
    setErrorMessage('');

    try {
      if (value === 'All Conversations') {
        const data = await getAllConversations();
        setConversations(data);
      } else if (value === 'sorted') {
        const data = await getConversationsSortedByTime();
        setConversations(data);
      } else {
        const data = await getConversationsByCategory(value);
        setConversations(data);
      }
    } catch (error) {
      console.error('Error filtering conversations:', error);
      setErrorMessage(error.message || 'Failed to filter conversations');
    } finally {
      setLoading(false);
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
        <select value={filter} onChange={handleFilterChange}>
          <option value="All Conversations">All Conversations</option>
          <option value="General">General</option>
          <option value="Education">Education</option>
          <option value="Coding">Coding</option>
          <option value="Career">Career</option>
          <option value="sorted">Sorted by Time</option>
        </select>
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