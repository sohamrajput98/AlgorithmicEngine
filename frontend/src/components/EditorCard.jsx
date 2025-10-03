import React, { useState, Suspense, lazy } from 'react';
import { submitSolution } from '../services/problems'; // ✅ Your original service
import TestResultsCard from './TestResultsCard';
import { FiPlay, FiSend } from 'react-icons/fi';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

const EditorCard = ({ problemId, userId }) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (runSampleOnly) => {
    const trimmedCode = code.trim();
    const parsedId = Number(problemId);

    if (!trimmedCode || isLoading) return;

    if (!parsedId || isNaN(parsedId)) {
      setResult({ status: 'error', reason: '❌ Invalid problemId' });
      return;
    }

    const payload = {
      problem_id: parsedId,
      code: trimmedCode,
      language,
      run_sample_only: runSampleOnly, // ✅ Gemini’s flag
    };

    setIsLoading(true);
    setResult(null);

    try {
      const res = await submitSolution(payload);
      setResult(res);

      // ✅ GPT’s badge tracking logic
      if (res.status?.toLowerCase().includes('accept')) {
        localStorage.setItem(`accepted_problem_${parsedId}`, 'true');
      }
    } catch (err) {
      setResult({
        status: 'error',
        result_log: JSON.stringify([{
          case_number: 1,
          status: 'Client Error',
          error: err.message || 'An unknown error occurred.',
        }]),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCode('');
    setResult(null);
  };

  return (
    <div className="p-6 bg-gray-900 rounded-2xl shadow-xl text-gray-100 border border-gray-700">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
          <option value="javascript">JavaScript</option>
        </select>

        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-semibold"
        >
          Reset
        </button>

        <div className="flex-grow"></div>

        <button
          onClick={() => handleSubmit(true)}
          disabled={isLoading}
          className="px-5 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-600 disabled:opacity-50 transition font-semibold flex items-center gap-2"
        >
          <FiPlay /> {isLoading ? 'Running...' : 'Run Code'}
        </button>
        <button
          onClick={() => handleSubmit(false)}
          disabled={isLoading}
          className="px-5 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg shadow hover:opacity-90 disabled:opacity-50 transition font-semibold flex items-center gap-2"
        >
          <FiSend /> {isLoading ? 'Submitting...' : 'Submit'}
        </button>
      </div>

      {/* Editor */}
      <div className="rounded-lg overflow-hidden border border-gray-700">
        <Suspense fallback={<div className="h-[400px] animate-pulse bg-gray-800"></div>}>
          <MonacoEditor
            height="400px"
            language={language}
            value={code}
            onChange={setCode}
            theme="vs-dark"
            options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
          />
        </Suspense>
      </div>

      {/* Results */}
      {(isLoading || result) && (
        <div className="mt-6">
          <TestResultsCard result={result} isLoading={isLoading && !result} />
        </div>
      )}
    </div>
  );
};

export default EditorCard;