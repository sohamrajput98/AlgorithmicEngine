import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { getToken } from "../services/auth";
import { Link } from "react-router-dom";

// --- Icons ---
const SpinnerIcon = () => (
  <svg className="animate-spin h-8 w-8 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const AlertIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" viewBox="0 0 24 24" fill="currentColor">
    <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.516 12.992a3 3 0 01-2.598 4.504H4.483a3 3 0 01-2.598-4.504L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

// --- Fallback UI ---
const CenteredMessage = ({ icon, title, message }) => (
  <div className="bg-[#0F172A] min-h-screen flex flex-col items-center justify-center text-center text-slate-400 p-4">
    <div className="mb-4">{icon}</div>
    <h2 className="text-xl font-bold text-slate-200 mb-1">{title}</h2>
    <p>{message}</p>
  </div>
);

// --- Main Component ---
export default function Submissions() {
  const [authError, setAuthError] = React.useState(false);

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) setAuthError(true);
        throw err;
      }
    },
    retry: false,
  });

  const { data: submissions, isLoading, error } = useQuery({
    queryKey: ["submissions", user?.id],
    queryFn: async () => {
      const res = await api.get(`/submissions?user_id=${user.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    },
    enabled: !!user,
    retry: false,
  });

  if (authError) {
    return <CenteredMessage icon={<AlertIcon />} title="Access Denied" message="Please log in to view your submissions." />;
  }

  if (loadingUser || isLoading) {
    return <CenteredMessage icon={<SpinnerIcon />} title="Loading Submissions" message="Fetching your data, please wait..." />;
  }

  if (error) {
    return <CenteredMessage icon={<AlertIcon />} title="An Error Occurred" message={`Could not load submissions: ${error.message}`} />;
  }

  if (!submissions || submissions.length === 0) {
    return <CenteredMessage icon={<AlertIcon />} title="No Submissions Found" message="You haven't submitted any solutions yet. Keep coding!" />;
  }

  return (
    <div className="bg-[#0F172A] min-h-screen p-4 sm:p-6 lg:p-8 text-slate-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white text-center mb-8 tracking-wide">
          Your Submissions
        </h1>

        <div className="space-y-6">
          {submissions.map((sub) => {
            const isAccepted = sub.status.toLowerCase().includes("accept");
            const log = Array.isArray(sub.result_log) ? sub.result_log[0] : {};
            const mismatch = log.output !== undefined && log.expected !== undefined && log.output !== log.expected;

            return (
              <div
                key={sub.id}
                className={`bg-slate-800/50 backdrop-blur-sm border-2 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-indigo-500/20 hover:border-indigo-500/70 ${
  isAccepted ? "border-green-500/50" : "border-red-500/50"
}`}
              >
                {/* Header */}
                <div className="p-4 sm:p-5 flex flex-wrap justify-between items-center border-b border-slate-700/50">
                 <span className={`font-bold text-lg sm:text-xl ${isAccepted ? "text-green-400" : "text-red-400"}`}>
  {isAccepted ? "Accepted" : "Failed"}
</span>
                 <span className="text-xs font-mono bg-violet-600/30 text-white px-4 py-1 rounded-full border border-violet-500/50 shadow-sm transition duration-200 hover:bg-violet-600/50 hover:border-violet-400 hover:shadow-md">
  {sub.language ?? "N/A"}
</span>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-semibold text-slate-400 mb-1">Your Output</div>
                      <pre className="bg-[#0F172A] p-3 border border-slate-700 rounded-lg mt-1 whitespace-pre-wrap text-slate-300 font-mono text-xs sm:text-sm">
                        {log.output?.trim() ? log.output : "—"}
                      </pre>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-400 mb-1">Expected Output</div>
                      <pre className="bg-[#0F172A] p-3 border border-slate-700 rounded-lg mt-1 whitespace-pre-wrap text-slate-300 font-mono text-xs sm:text-sm">
                        {log.expected?.trim() ? log.expected : "—"}
                      </pre>
                    </div>
                  </div>

                  {mismatch && (
                    <p className="text-sm text-yellow-500 font-semibold flex items-center gap-2">
                      ⚠️ Output does not match expected
                    </p>
                  )}

                  {sub.stderr && (
                    <div>
                      <div className="font-semibold text-red-400 mb-1">Standard Error</div>
                      <pre className="bg-red-900/20 text-red-300 p-3 border border-red-500/30 rounded-lg mt-1 whitespace-pre-wrap font-mono text-xs sm:text-sm">
                        {sub.stderr}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-5 border-t border-slate-700/50 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-400">
                    <span>Time Complexity: <strong className="text-slate-200">{log.time_complexity ?? "N/A"}</strong></span>
                    <span>Space Complexity: <strong className="text-slate-200">{log.space_complexity ?? "N/A"}</strong></span>
                    {sub.runtime > 0 && <span>Runtime: <strong className="text-slate-200">{sub.runtime} ms</strong></span>}
                    {sub.memory > 0 && <span>Memory: <strong className="text-slate-200">{sub.memory} MB</strong></span>}
                  </div>
                  <Link to={`/problems/${sub.problem_id}`} className="nav-gradient-button text-xs py-2 px-4 rounded-md">
                    View Problem
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}