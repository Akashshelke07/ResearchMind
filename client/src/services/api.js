// client/src/services/api.js
import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || error.message || 'An error occurred';
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - remove token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.status === 429) {
      // Rate limited
      toast.error(message);
    } else if (error.response?.status >= 500) {
      // Server errors
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      // Timeout
      toast.error('Request timeout. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Helper functions
const apiService = {
  // Set auth token
  setAuthToken: (token) => {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete api.defaults.headers.Authorization;
      localStorage.removeItem('token');
    }
  },

  // Remove auth token
  removeAuthToken: () => {
    delete api.defaults.headers.Authorization;
    localStorage.removeItem('token');
  },

  // Generic API methods
  get: (url, config) => api.get(url, config),
  post: (url, data, config) => api.post(url, data, config),
  put: (url, data, config) => api.put(url, data, config),
  delete: (url, config) => api.delete(url, config),
  patch: (url, data, config) => api.patch(url, data, config),

  // File upload with progress
  uploadFile: (formData, onUploadProgress) => {
    return api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
      timeout: 60000, // 1 minute for file uploads
    });
  },

  // Chat methods
  sendMessage: (message, chatId, context) => {
    return api.post('/chat/message', { message, chatId, context });
  },

  getChatHistory: (chatId) => {
    return api.get(`/chat/history${chatId ? `?chatId=${chatId}` : ''}`);
  },

  deleteChat: (chatId) => {
    return api.delete(`/chat/${chatId}`);
  },

  // Document methods
  getDocuments: () => {
    return api.get('/documents');
  },

  getDocument: (id) => {
    return api.get(`/documents/${id}`);
  },

  deleteDocument: (id) => {
    return api.delete(`/documents/${id}`);
  },

  analyzeDocument: (id, analysisType) => {
    return api.post(`/documents/${id}/analyze`, { analysisType });
  },

  // Analysis methods
  checkPlagiarism: (text) => {
    return api.post('/analysis/plagiarism', { text });
  },

  checkGrammar: (text) => {
    return api.post('/analysis/grammar', { text });
  },

  checkFormatting: (text, style) => {
    return api.post('/analysis/format', { text, style });
  },

  getAnalysisReport: (id) => {
    return api.get(`/analysis/report/${id}`);
  },

  // User methods
  getUsage: () => {
    return api.get('/auth/usage');
  },

  updatePreferences: (preferences) => {
    return api.put('/auth/profile', { preferences });
  }
};

export default apiService;