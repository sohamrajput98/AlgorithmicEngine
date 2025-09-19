import api from './api'; // ✅ uses your existing axios instance

export const fetchSubmissions = async (userId) => {
  try {
    const res = await api.get(`/submissions?user_id=${userId}`);
    return res.data;
  } catch (err) {
    console.error("❌ fetchSubmissions failed", err);
    return [];
  }
};