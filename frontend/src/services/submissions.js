// src/services/submissions.js
import api from './api'; // ✅ uses your existing axios instance

// ✅ Fetch all submissions for a user
export const fetchSubmissions = async (userId) => {
  try {
    const res = await api.get(`/submissions?user_id=${userId}`);
    return res.data;
  } catch (err) {
    console.error("❌ fetchSubmissions failed", err);
    return [];
  }
};

// ✅ Submit a new solution for a problem
export const submitSolution = async ({ user_id, problem_id, code, language }) => {
  try {
    const res = await api.post("/submissions", {
      user_id,
      problem_id,
      code,
      language,
    });
    return res.data;
  } catch (err) {
    console.error("❌ submitSolution failed", err);
    throw err; // Let react-query handle error state
  }
};