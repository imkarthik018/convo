import React, { useState } from 'react';
import { login, signup } from '../services/auth';
import './Login.css';

function Login({ onLogin }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    role: 'ROLE_USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLoginMode) {
        // Login
        const response = await login(formData.username, formData.password);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          username: response.username,
          email: response.email,
          role: response.role
        }));
        onLogin(response);
      } else {
        // Signup
        const response = await signup(formData);
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify({
          username: response.username,
          email: response.email,
          role: response.role
        }));
        onLogin(response);
      }
    } catch (err) {
      setError(err.response?.data || err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{isLoginMode ? 'Login' : 'Sign Up'}</h1>
        <p className="subtitle">
          {isLoginMode 
            ? 'Welcome back! Please login to continue.' 
            : 'Create an account to get started'}
        </p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
            />
          </div>

          {!isLoginMode && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter email"
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="ROLE_USER">User</option>
                  <option value="ROLE_RESEARCHER">Researcher</option>
                  <option value="ROLE_ENGINEER">Engineer</option>
                  <option value="ROLE_PREMIUM">Premium User</option>
                  <option value="ROLE_ADMIN">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter password"
              minLength={6}
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <div className="toggle-mode">
          {isLoginMode ? (
            <p>
              Don't have an account?{' '}
              <span onClick={() => setIsLoginMode(false)} className="link">
                Sign up
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span onClick={() => setIsLoginMode(true)} className="link">
                Login
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;

