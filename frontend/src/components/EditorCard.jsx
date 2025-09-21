import { useState, Suspense, lazy } from 'react';
import { submitSolution } from '../services/problems';
import TestResultsCard from './TestResultsCard';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

const EditorCard = ({ problemId, language: initialLang = 'python' }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(initialLang);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const trimmedCode = code.trim();
    const parsedId = Number(problemId);

    // 🛡️ Guard against invalid input
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
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <div className="flex flex-wrap gap-2 mb-3 items-center">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Running...' : 'Run Code'}
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 transition"
        >
          Reset
        </button>
      </div>

      <Suspense fallback={<div className="animate-pulse p-4 bg-gray-100 rounded">Loading editor...</div>}>
        <MonacoEditor
          height="300px"
          language={language}
          value={code}
          onChange={setCode}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
          }}
        />
      </Suspense>

      {result && <TestResultsCard result={result} />}
    </div>
  );
};

export default EditorCard;