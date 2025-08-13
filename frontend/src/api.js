import axios from 'axios';

const API = axios.create({ 
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
}); 

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear user data and redirect to login
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const deleteProduct = async (productId) => {
  try {
    const response = await API.delete(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default API;
