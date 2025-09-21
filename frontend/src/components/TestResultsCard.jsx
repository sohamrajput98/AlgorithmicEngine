const TestResultsCard = ({ result }) => {
  const { status, output, expected, stderr, reason, runtime, memory } = result;
  const isAccepted = status.toLowerCase().includes('accept');

  return (
    <div className={`mt-4 p-4 rounded-lg shadow-md transition-all duration-300
      ${isAccepted ? 'bg-green-50 border-green-400' : 'bg-red-50 border-red-400'} border`}>
      
      <div className="flex items-center justify-between mb-2">
        <span className={`font-bold ${isAccepted ? 'text-green-600' : 'text-red-600'}`}>
          Status: {status}
        </span>
        <span className="text-sm text-gray-500">Language: {result.language ?? '—'}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <div className="font-semibold">Output</div>
          <pre className="bg-white p-2 border rounded mt-1 whitespace-pre-wrap">{output ?? '—'}</pre>
        </div>
        <div>
          <div className="font-semibold">Expected</div>
          <pre className="bg-white p-2 border rounded mt-1 whitespace-pre-wrap">{expected ?? '—'}</pre>
        </div>
      </div>

      {stderr && (
        <div className="mt-3">
          <div className="font-semibold text-red-600">Errors</div>
          <pre className="bg-red-100 p-2 border rounded mt-1 whitespace-pre-wrap">{stderr}</pre>
        </div>
      )}

      {reason && <p className="mt-2 text-red-600"><strong>Reason:</strong> {reason}</p>}

      <div className="mt-3 flex gap-4 text-xs text-gray-600">
        <span><strong>Time Complexity:</strong> {result.time_complexity ?? '—'}</span>
        <span><strong>Space Complexity:</strong> {result.space_complexity ?? '—'}</span>
        {runtime && <span><strong>Runtime:</strong> {runtime}</span>}
        {memory && <span><strong>Memory:</strong> {memory}</span>}
      </div>
    </div>
  );
};

export default TestResultsCard;
