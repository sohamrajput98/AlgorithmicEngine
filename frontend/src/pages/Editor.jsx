import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { fetchProblemById, submitSolution } from '../services/problems';

console.log("🧠 Editor.jsx mounted");

const Editor = () => {
  const { id } = useParams();
  console.log("🧩 Editor loaded with ID:", id);

  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    data: problem,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['problem', id],
    queryFn: () => fetchProblemById(id),
    enabled: !!id,
    staleTime: 1000 * 60,     // ✅ 1 minute
    cacheTime: 1000 * 300,    // ✅ 5 minutes
    retry: false,             // ✅ disables retry loop
  });

  if (isLoading) return <div className="p-6">Loading problem...</div>;
  if (error) return <div className="p-6 text-red-600">Problem not found or failed to load.</div>;

  console.log("🔍 Query status:", { isLoading, error, problem });

  const handleSubmit = async () => {
    console.log("Submit button clicked");

    if (!code.trim()) {
      console.warn("Code input is empty");
      setResult({ status: 'error', reason: 'Code input is empty' });
      return;
    }

    setLoading(true);
    try {
      console.log("Submitting:", { problem_id: parseInt(id), code, language });
      const res = await submitSolution({ problem_id: parseInt(id), code, language });
      console.log("Response:", res);
      setResult(res);
    } catch (err) {
      console.error("Submission error:", err);
      setResult({
        status: 'error',
        reason: err.response?.data?.detail || err.message || 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      {problem && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">{problem.title}</h2>

          <div className="text-sm text-gray-600 mb-1">
            ⭐ {problem.stars} | Tags: {problem.tags?.join(', ')}
          </div>

          {problem.difficulty_notes && (
            <div className="text-xs italic text-gray-500 mb-2">
              Difficulty: {problem.difficulty_notes}
            </div>
          )}

          <h3 className="text-lg font-semibold mt-4 mb-1">Problem Statement</h3>
          <p className="text-gray-800 whitespace-pre-line">{problem.statement}</p>
        </div>
      )}

      <select
        value={language}
        onChange={e => setLanguage(e.target.value)}
        className="mb-2"
      >
        <option value="python">Python</option>
        <option value="javascript">JavaScript</option>
      </select>

      <textarea
        value={code}
        onChange={e => setCode(e.target.value)}
        rows={10}
        className="w-full border p-2 mb-2"
        placeholder="Write your code here..."
        spellCheck={false}
         autoCapitalize="off"
        autoCorrect="off"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? 'Submitting...' : 'Run Code'}
      </button>
     
     <button
  onClick={() => setCode('')}
  className="ml-4 bg-gray-300 text-black px-4 py-2 rounded"
>
    Reset
   </button>
      {result && (
        <div className="mt-4 bg-gray-100 p-2 border">
          <p><strong>Status:</strong> {result.status}</p>
          <p><strong>Output:</strong> <pre>{result.output}</pre></p>
          <p><strong>Expected:</strong> <pre>{result.expected}</pre></p>
          <p><strong>Language:</strong> {language}</p>
          {result.stderr && <p><strong>Errors:</strong> <pre>{result.stderr}</pre></p>}
          {result.reason && <p className="text-red-600"><strong>Reason:</strong> {result.reason}</p>}
        </div>
      )}
    </div>
  );
};

export default Editor;