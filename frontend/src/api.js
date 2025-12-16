// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://lotus-leaf-api.onrender.com/api',
});

// قبل كل request، ضيف Authorization header إذا في token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // نفس الشي اللي حفظناه بـ AuthContext
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;