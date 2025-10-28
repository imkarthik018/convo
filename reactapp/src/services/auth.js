import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api/auth';

// Configure axios default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const login = async (username, password) => {
  try {
    // Temporary bypass for authentication - create mock user
    const mockUser = {
      username: username,
      email: `${username}@test.com`,
      role: 'ROLE_USER',
      token: 'mock-token'
    };
    
    // Store user data in localStorage
    localStorage.setItem('token', mockUser.token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return mockUser;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const signup = async (userData) => {
  try {
    // Temporary bypass for authentication - create mock user
    const mockUser = {
      username: userData.username,
      email: userData.email,
      role: userData.role || 'ROLE_USER',
      token: 'mock-token'
    };
    
    // Store user data in localStorage
    localStorage.setItem('token', mockUser.token);
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    return mockUser;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
  } catch (error) {
    console.error('Error reading user from localStorage:', error);
  }
  return null;
};

export const getStoredToken = () => {
  return localStorage.getItem('token');
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUserRole = () => {
  const user = getStoredUser();
  return user ? user.role : null;
};

