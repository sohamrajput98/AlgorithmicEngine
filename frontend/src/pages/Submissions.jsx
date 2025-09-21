// Submissions.jsx (visual enhancement only)
import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { getToken } from "../services/auth";
import { Link } from "react-router-dom";

export default function Submissions() {
  const [authError, setAuthError] = React.useState(false); // ✅ Added

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const res = await api.get("/auth/me", {
          headers: { Authorization: `Bearer ${getToken()}` },
        });
        return res.data;
      } catch (err) {
        if (err.response?.status === 401) {
          setAuthError(true); // ✅ Trigger fallback UI
        }
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
    return (
      <div className="text-center mt-20 text-red-600">
        🔒 Please log in to view your submissions.
      </div>
    );
  }

  if (loadingUser || isLoading)
    return <div className="text-center mt-20 text-gray-500">Loading submissions...</div>;

  if (error)
    return (
      <div className="text-center mt-20 text-red-600">
        Error loading submissions: {error.message}
      </div>
    );

  if (!submissions || submissions.length === 0)
    return (
      <div className="text-center mt-20 text-gray-500">
        No submissions yet.
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
        Your Submissions
      </h1>

      {submissions.map((sub) => {
        const isAccepted = sub.status.toLowerCase().includes("accept");
        const mismatch =
          sub.output !== undefined &&
          sub.expected !== undefined &&
          sub.output !== sub.expected;

        return (
          <div
            key={sub.id}
            className={`bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition border ${
              isAccepted ? "border-green-400" : "border-red-400"
            }`}
          >
            <div className="flex flex-wrap justify-between items-center mb-3">
              <span
                className={`font-bold text-lg ${
                  isAccepted ? "text-green-600" : "text-red-600"
                }`}
              >
                Status: {sub.status}
              </span>
              <span className="text-sm text-gray-500">
                Language: {sub.language ?? "—"}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold">Output</div>
                <pre className="bg-gray-50 p-3 border rounded mt-1 whitespace-pre-wrap">
                  {sub.output ?? "—"}
                </pre>
              </div>
              <div>
                <div className="font-semibold">Expected</div>
                <pre className="bg-gray-50 p-3 border rounded mt-1 whitespace-pre-wrap">
                  {sub.expected ?? "—"}
                </pre>
              </div>
            </div>

            {mismatch && (
              <p className="mt-2 text-yellow-700 font-semibold">
                ⚠️ Output does not match expected
              </p>
            )}

            {sub.stderr && (
              <div className="mt-3">
                <div className="font-semibold text-red-600">Errors</div>
                <pre className="bg-red-100 p-3 border rounded mt-1 whitespace-pre-wrap">
                  {sub.stderr}
                </pre>
              </div>
            )}

            <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-600">
              <span>
                <strong>Time Complexity:</strong> {sub.time_complexity ?? "—"}
              </span>
              <span>
                <strong>Space Complexity:</strong> {sub.space_complexity ?? "—"}
              </span>
              {sub.runtime && (
                <span>
                  <strong>Runtime:</strong> {sub.runtime}
                </span>
              )}
              {sub.memory && (
                <span>
                  <strong>Memory:</strong> {sub.memory}
                </span>
              )}
              <span>
                <Link
                  to={`/problems/${sub.problem_id}`}
                  className="text-blue-600 hover:underline"
                >
                  View Problem
                </Link>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}