import api from './api'


export const fetchProblems = async (stars, tag) => {
  try {
    const params = {}
    if (stars) params.stars = stars
    if (tag) params.tag = tag
    const res = await api.get('/problems', { params })
    return res.data
  } catch (err) {
    console.error("❌ fetchProblems failed", err)
    return []
  }
}

export const fetchProblemById = async (id) => {
  const res = await api.get(`/problems/${id}`)
  return res.data
}

export const submitSolution = async ({ problem_id, code, language = 'python' }) => {
  const res = await api.post('/submissions', { problem_id, code, language })
  return res.data
}
console.log("✅ problems.js loaded")