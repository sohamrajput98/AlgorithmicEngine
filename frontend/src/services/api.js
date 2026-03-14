import axios from 'axios';
import { getToken } from './auth'; // 1. Import your getToken function

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});
console.log(import.meta.env.VITE_API_URL + '/auth/register');

// 2. Add the request interceptor
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // If the token exists, add it to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log("📤 Axios sending:", config.method, config.url);
    return config;
  },
  (error) => {
    // This part is for handling request errors
    return Promise.reject(error);
  }
);

export default api;