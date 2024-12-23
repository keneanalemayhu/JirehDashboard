import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});
"O:joji"
// Add request interceptor for logging
api.interceptors.request.use((config) => {
  console.log('Axios Request:', {
    method: config.method,
    url: config.url,
    data: config.data
  });
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for logging
api.interceptors.response.use((response) => {
  console.log('Axios Response:', {
    status: response.status,
    data: response.data
  });
  return response;
}, (error) => {
  console.log('Axios Error:', {
    status: error.response?.status,
    data: error.response?.data,
    message: error.message
  });
  return Promise.reject(error);
});

export default api;