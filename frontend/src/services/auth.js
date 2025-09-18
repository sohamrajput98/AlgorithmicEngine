import api from './api';

const TOKEN_KEY = 'auth_token';

export const login = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password })
    console.log("Login response:", res.data)
    localStorage.setItem(TOKEN_KEY, res.data.access_token)
    return res.data
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message)
    throw err
  }
}

export const register = async (email, display_name, password) => {
  const res = await api.post('/auth/register', { email, display_name, password });
  return res.data;
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const isLoggedIn = () => !!getToken();
