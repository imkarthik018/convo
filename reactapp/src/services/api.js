import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE ? `${process.env.REACT_APP_API_BASE}api/chats` : 'http://localhost:8080/api/chats';

export const addConversation = async (conversation) => {
  const response = await axios.post(`${API_BASE_URL}/addConversation`, conversation);
  return response.data;
};

export const getAllConversations = async () => {
  const response = await axios.get(`${API_BASE_URL}/allConversations`);
  return response.data;
};

export const getConversationsByCategory = async (category) => {
  const response = await axios.get(`${API_BASE_URL}/byCategory?category=${category}`);
  return response.data;
};

export const getConversationsSortedByTime = async () => {
  const response = await axios.get(`${API_BASE_URL}/sortedByTime`);
  return response.data;
};

export const deleteConversation = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/deleteConversation/${id}`);
  return response.data;
};

export const updateConversation = async (id, conversation) => {
  const response = await axios.put(`${API_BASE_URL}/updateConversation/${id}`, conversation);
  return response.data;
};