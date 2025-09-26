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

    setLoading(true);
    try {
      const res = await submitSolution(payload);
      setResult(res);
      if (res.status?.toLowerCase().includes('accept')) {
        localStorage.setItem(`accepted_problem_${parsedId}`, 'true');
      }
    } catch (err) {
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
    <div className="p-6 bg-gray-900 rounded-2xl shadow-xl max-w-6xl mx-auto text-gray-100">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500"
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-5 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow hover:from-green-600 hover:to-teal-600 disabled:opacity-50 transition font-semibold"
        >
          {loading ? 'Running...' : 'Run Code'}
        </button>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition font-semibold"
        >
          Reset
        </button>
      </div>

      {/* Editor */}
      <Suspense fallback={<div className="animate-pulse p-6 bg-gray-800 rounded-lg">Loading editor...</div>}>
        <MonacoEditor
          height="400px"
          language={language}
          value={code}
          onChange={setCode}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            scrollBeyondLastLine: false,
            theme: 'vs-dark',
          }}
          className="rounded-lg shadow-inner"
        />
      </Suspense>

      {/* Results */}
      {result && (
        <div className="mt-6">
          <TestResultsCard result={result} />
        </div>
      )}
    </div>
  );
};

export default EditorCard;