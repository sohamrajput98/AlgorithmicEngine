import React, { useState } from 'react';
import { FiCheckCircle, FiXCircle, FiClock, FiTerminal, FiInfo } from 'react-icons/fi';

const statusMap = {
  accepted: { text: "Accepted", color: "text-green-400", icon: <FiCheckCircle /> },
  "wrong answer": { text: "Wrong Answer", color: "text-red-400", icon: <FiXCircle /> },
  "time limit exceeded": { text: "Time Limit Exceeded", color: "text-yellow-400", icon: <FiClock /> },
  "runtime error": { text: "Runtime Error", color: "text-red-400", icon: <FiTerminal /> },
  "client error": { text: "Client Error", color: "text-gray-400", icon: <FiInfo /> },
  error: { text: "Evaluation Error", color: "text-gray-400", icon: <FiInfo /> },
};

const TestResultsCard = ({ result, isLoading }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (isLoading) {
    return (
      <div className="p-6 rounded-2xl bg-gray-800 text-center text-gray-400 animate-pulse">
        Judging...
      </div>
    );
  }
  if (!result) return null;

  const logs = Array.isArray(result.result_log) ? result.result_log : JSON.parse(result.result_log || '[]');
  const overallStatusKey = (result.status || 'error').toLowerCase();
  const overallStatus = statusMap[overallStatusKey] || statusMap.error;
  const isAccepted = overallStatusKey === 'accepted';

  return (
    <div className={`p-6 rounded-2xl shadow-xl border ${isAccepted ? 'bg-gray-800/50 border-green-500/30' : 'bg-gray-800/50 border-red-500/30'} text-white`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`flex items-center gap-2 font-bold text-lg ${overallStatus.color}`}>
          {overallStatus.icon}
          <span>{overallStatus.text}</span>
        </div>
        <span className="text-sm text-gray-400">Language: {result.language || 'N/A'}</span>
      </div>

      <div className="text-sm text-gray-400 mb-4">
        Runtime: {result.runtime} ms · Cases Passed: {result.passes}/{result.total}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
        <div className="p-2 bg-gray-900/50 rounded-lg">
          <div className="text-xs text-gray-400">Cases Passed</div>
          <div className="text-lg font-bold">{result.passes || 0} / {result.total || 0}</div>
        </div>
        <div className="p-2 bg-gray-900/50 rounded-lg">
          <div className="text-xs text-gray-400">Total Runtime</div>
          <div className="text-lg font-bold">{result.runtime > 0 ? `${result.runtime} ms` : "—"}</div>
        </div>
      </div>

      {logs.length > 0 && (
        <div>
          <div className="flex items-center border-b border-gray-700 mb-4 overflow-x-auto">
            {logs.map((log, index) => (
              <button
                key={log.testcase_id || index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === index ? 'border-b-2 border-purple-400 text-white' : 'text-gray-400'}`}
              >
                Case {log.case_number}
              </button>
            ))}
          </div>

          {logs.map((log, index) => (
            <div key={log.testcase_id || index} className={`${activeTab === index ? 'block' : 'hidden'}`}>
              <div className="space-y-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-400">Status: </span>
                  <span className={log.status === 'Accepted' ? 'text-green-400' : 'text-red-400'}>{log.status}</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-400 mb-1">Input</p>
                  <pre className="p-3 bg-gray-900 rounded text-xs whitespace-pre-wrap">{log.input ?? '—'}</pre>
                </div>
                <div>
                  <p className="font-semibold text-gray-400 mb-1">Your Output</p>
                  <pre className="p-3 bg-gray-900 rounded text-xs whitespace-pre-wrap">{log.output ?? '—'}</pre>
                </div>
                {log.status !== 'Accepted' && (
                  <div>
                    <p className="font-semibold text-gray-400 mb-1">Expected</p>
                    <pre className="p-3 bg-gray-900 rounded text-xs whitespace-pre-wrap">{log.expected ?? '—'}</pre>
                  </div>
                )}
                {result.total > 1 && log.runtime_ms !== undefined && (
                  <div>
                    <p className="font-semibold text-gray-400 mb-1">Runtime</p>
                    <pre className="p-3 bg-gray-900 rounded text-xs whitespace-pre-wrap">
                      {log.runtime_ms > 0 ? `${log.runtime_ms} ms` : "—"}
                    </pre>
                  </div>
                )}
                {log.error && (
                  <div>
                    <p className="font-semibold text-red-400 mb-1">Error</p>
                    <pre className="p-3 bg-red-900/20 text-red-300 rounded text-xs whitespace-pre-wrap">{log.error}</pre>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TestResultsCard;