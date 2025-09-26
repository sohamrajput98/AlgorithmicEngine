const TestResultsCard = ({ result }) => {
  const { status, output, expected, stderr, reason, runtime, memory } = result;
  const isAccepted = status.toLowerCase().includes('accept');

  return (
    <div className={`mt-4 p-6 rounded-2xl shadow-xl transition-all duration-300 border ${
      isAccepted ? 'bg-gradient-to-r from-green-800 to-green-600 border-green-500' : 'bg-gradient-to-r from-red-800 to-red-600 border-red-500'
    } text-white`}>
      <div className="flex items-center justify-between mb-4">
        <span className="font-bold text-lg">
          Status: {status}
        </span>
        <span className="text-sm text-gray-200">Language: {result.language ?? '—'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
        <div>
          <div className="font-semibold mb-1">Output</div>
          <pre className="bg-gray-900 p-3 rounded-lg whitespace-pre-wrap border border-gray-700">{output ?? '—'}</pre>
        </div>
        <div>
          <div className="font-semibold mb-1">Expected</div>
          <pre className="bg-gray-900 p-3 rounded-lg whitespace-pre-wrap border border-gray-700">{expected ?? '—'}</pre>
        </div>
      </div>

      {stderr && (
        <div className="mt-4">
          <div className="font-semibold text-red-300">Errors</div>
          <pre className="bg-red-900 p-3 rounded-lg whitespace-pre-wrap border border-red-500">{stderr}</pre>
        </div>
      )}

      {reason && <p className="mt-3 text-red-300"><strong>Reason:</strong> {reason}</p>}

      <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-300">
        <span><strong>Time Complexity:</strong> {result.time_complexity ?? '—'}</span>
        <span><strong>Space Complexity:</strong> {result.space_complexity ?? '—'}</span>
        {runtime && <span><strong>Runtime:</strong> {runtime}</span>}
        {memory && <span><strong>Memory:</strong> {memory}</span>}
      </div>
    </div>
  );
};

export default TestResultsCard;