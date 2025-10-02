import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// attach auth token if present
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions have been moved to dedicated service files:
// - authService.js for authentication-related API calls
// - docsService.js for document-related API calls


