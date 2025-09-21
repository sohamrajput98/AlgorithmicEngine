import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  console.log("📤 Axios sending:", config.method, config.url, config.data);
  return config;
});

export default api;
