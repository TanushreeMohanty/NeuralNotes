import axios from 'axios';

const api = axios.create({
  // This matches the environment variable in docker-compose
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

// Automatically add JWT token if it exists in local storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;