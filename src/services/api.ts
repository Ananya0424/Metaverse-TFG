import axios from 'axios';

// Create an Axios instance pointing to our Node backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
