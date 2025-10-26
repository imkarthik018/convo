import axios from 'axios';

const API_BASE_URL = 'http://localhost:8083/api/auth';

// Configure axios default headers
axios.defaults.headers.common['Content-Type'] = 'application/json';

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    if (error.response) {
      throw new Error(error.response.data);
    } else {
      throw new Error('Network error: Unable to connect to server');
    }
  }
};

export const signup = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/signup`, {
      username: userData.username,
      password: userData.password,
      email: userData.email,
      role: userData.role || 'ROLE_USER'
    });
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    if (error.response) {
      throw new Error(error.response.data);
    } else {
      throw new Error('Network error: Unable to connect to server');
    }
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

