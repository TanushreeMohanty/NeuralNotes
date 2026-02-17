import axios from 'axios';

const API_URL = "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
});

// Automatically add the JWT token to every request for data isolation
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await api.post('/token', formData);
  localStorage.setItem('token', response.data.access_token);
  return response.data;
};

export const signup = (username, password) => 
  api.post(`/signup?username=${username}&password=${password}`);

// Fixed to use Query Parameters as per your main.py logic
export const saveNote = (title, content) => 
  api.post(`/notes?title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}`);

// Added for the fetch logic in App.jsx
export const getNotes = () => api.get('/notes');

export const searchNotes = (query) => api.get(`/notes/search?query=${encodeURIComponent(query)}`);

export default api;