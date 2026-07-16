import axios from 'axios';

// Fallback to local development API URL if env variable is not defined
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token to auth headers
axiosInstance.interceptors.request.use(
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

// Response interceptor for handling 401s globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // If the token expires or is invalid, clean state and log out user
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // We don't force page reload here to avoid infinite redirect loops,
      // but the auth context will catch it or the route guard will trigger.
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
