import React, { useState, Suspense, lazy, useEffect } from 'react';
import { submitSolution } from '../services/problems';
import TestResultsCard from './TestResultsCard';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

const EditorCard = ({ problemId, language: initialLang = 'python' }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(initialLang);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("🧩 EditorCard mounted with problemId:", problemId);
  }, [problemId]);

  const handleSubmit = async () => {
    const trimmedCode = code.trim();
    const parsedId = Number(problemId);

    console.log("🧪 handleSubmit triggered");

    if (!trimmedCode) {
      setResult({ status: 'error', reason: '❌ Code is empty' });
      return;
    }

    if (!parsedId || isNaN(parsedId)) {
      setResult({ status: 'error', reason: '❌ Invalid problemId' });
      return;
    }

    const payload = {
      problem_id: parsedId,
      code: trimmedCode,
      language,
    };

    console.log("🚀 Submitting payload:", payload);

    setLoading(true);
    try {
      const res = await submitSolution(payload);
      console.log("✅ Submission response:", res);
      setResult(res);

      if (res.status?.toLowerCase().includes('accept')) {
        localStorage.setItem(`accepted_problem_${parsedId}`, 'true');
      }
    } catch (err) {
      console.error("❌ Submission failed:", err);
      setResult({ status: 'error', reason: err.message || 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setResult(null);
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 rounded-2xl shadow-lg max-w-5xl mx-auto">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="border px-3 py-1 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-5 py-1 rounded-lg shadow hover:from-green-600 hover:to-teal-600 disabled:opacity-50 transition"
        >
          {loading ? 'Running...' : 'Run Code'}
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-200 px-4 py-1 rounded-lg hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>

      {/* Editor */}
      <Suspense fallback={<div className="animate-pulse p-6 bg-gray-200 rounded-lg">Loading editor...</div>}>
        <MonacoEditor
          height="350px"
          language={language}
          value={code}
          onChange={setCode}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
          className="rounded-lg shadow-inner"
        />
      </Suspense>

      {/* Results */}
      {result && (
        <div className="mt-5">
          <TestResultsCard result={result} />
        </div>
      )}
    </div>
  );
};

export default EditorCard;