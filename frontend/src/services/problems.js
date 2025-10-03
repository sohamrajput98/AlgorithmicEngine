// File: frontend/src/services/problems.js
import axios from './api';
import { getToken } from './auth';

export const fetchProblems = async ({ stars, tags, search, sort_by, order, page, limit }) => { // 🧠 Renamed 'tag' to 'tags'
  const params = new URLSearchParams();
  if (stars) params.append('stars', stars);
  if (tags) params.append('tags', tags); // 🧠 Renamed 'tag' to 'tags'
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

// Note: This submitSolution function seems to be for a different purpose,
// as the primary submission logic is in `services/submissions.js`.
// I am leaving it here as it was in your original file.
export const submitSolution = async ({ problem_id, code, language = "python" }) => {
  console.log("📡 submitSolution called with:", { problem_id, code, language });

  if (!problem_id || !code) {
    console.warn("⚠️ Skipping submission due to missing fields");
    throw new Error("❌ Missing problem_id or code in submission payload");
  }

  console.log("📤 About to POST /submissions");

  const res = await axios.post('/submissions/', { problem_id, code, language });
  return res.data;
};

export const fetchProblemTestcases = async (problemId) => {
  if (!problemId) throw new Error("❌ Missing problemId for testcase fetch");

  const res = await axios.get(`/testcases/problem/${problemId}`); // ✅ Corrected path
  return res.data;
};
