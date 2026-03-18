// client/src/services/spinService.js
// Spin wheel service for gamification feature

import api from './api';

export const spinService = {
  // Get smart suggestions for the spin wheel
  getSuggestions: async (userId) => {
    const response = await api.get(`/spin/${userId}`);
    return response.data;
  },

  // Log a spin result
  logSpin: async (data) => {
    const response = await api.post('/spin/log', data);
    return response.data;
  },

  // Get user's spin history
  getSpinHistory: async (userId) => {
    const response = await api.get(`/spin/history/${userId}`);
    return response.data;
  }
};

export default spinService;
