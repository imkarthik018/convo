import axios from 'axios';

// Force localhost for development
const API_BASE_URL = 'http://localhost:8083/api/chats';

// Configure axios to handle errors globally
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Log the API URL for debugging
console.log('API Base URL:', API_BASE_URL);

// Helper function to handle errors
const handleError = (error) => {
  if (error.response) {
    // Server responded with error
    console.error('API Error:', error.response.data);
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // Request made but no response
    console.error('Network Error:', error.request);
    throw new Error('Unable to connect to the server. Please ensure the backend is running.');
  } else {
    // Something else happened
    console.error('Error:', error.message);
    throw error;
  }
};

export const addConversation = async (conversation) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addConversation`, conversation);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getAllConversations = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/allConversations`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getConversationsByCategory = async (category) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/byCategory?category=${category}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getConversationsSortedByTime = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sortedByTime`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const deleteConversation = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteConversation/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const updateConversation = async (id, conversation) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateConversation/${id}`, conversation);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

// Pagination API methods
export const getConversationsPaginated = async (page = 0, size = 5) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversations?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getConversationsByCategoryPaginated = async (category, page = 0, size = 5) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversationsByCategory?category=${category}&page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};

export const getConversationsSortedByTimePaginated = async (page = 0, size = 5) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/conversationsSortedByTime?page=${page}&size=${size}`);
    return response.data;
  } catch (error) {
    handleError(error);
  }
};