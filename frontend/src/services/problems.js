// frontend/src/services/problems.js
import axios from './api';

export const fetchProblems = async ({ stars, tag, search, sort_by, order, page, limit }) => {
  const params = new URLSearchParams();
  if (stars) params.append('stars', stars);
  if (tag) params.append('tag', tag);
  if (search) params.append('search', search);
  if (sort_by) params.append('sort_by', sort_by);
  if (order) params.append('order', order);
  if (page) params.append('page', page);
  if (limit) params.append('limit', limit);

  const res = await axios.get(`/problems?${params.toString()}`);
  return res.data;
};

export const fetchProblemById = async (id) => {
  const res = await axios.get(`/problems/${id}`);
  return res.data;
};

export const fetchSimilarProblems = async (id, limit = 5) => {
  const res = await axios.get(`/problems/${id}/similar?limit=${limit}`);
  return res.data;
};

export const submitSolution = async ({ problem_id, code, language = "python" }) => {
  const payload = {
    problem_id,
    code,
    language,
  };

  console.log("Submitting payload:", payload);

  // 🛡️ Guard against missing fields
  if (!payload.problem_id || !payload.code) {
    throw new Error("❌ Missing problem_id or code in submission payload");
  }

  const res = await axios.post('/submissions/', payload, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.data;
};
