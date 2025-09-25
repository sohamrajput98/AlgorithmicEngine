import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { getToken, logout } from "../services/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function Analytics() {
  const navigate = useNavigate();

  // Fetch user info
  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await api.get("/auth/me", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      return res.data;
    },
    retry: false,
  });

  // Fetch detailed analytics
  const { data: analytics } = useQuery({
    queryKey: ["analytics", user?.id],
    queryFn: async () => {
      const res = await api.get(`/analytics/summary?user_id=${user.id}`);
      return res.data;
    },
    enabled: !!user,
  });

  // Fetch badges
  const { data: badges } = useQuery({
    queryKey: ["badges", user?.id],
    queryFn: async () => {
      const res = await api.get(`/badges?user_id=${user.id}`);
      return res.data;
    },
    enabled: !!user,
  });

  if (loadingUser) return <div>Loading user info...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-100 p-6 rounded-2xl shadow text-center hover:scale-105 transform transition">
            <h2 className="text-xl font-bold mb-2">Total Submissions</h2>
            <p className="text-3xl font-semibold">{analytics.total_submissions}</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-2xl shadow text-center hover:scale-105 transform transition">
            <h2 className="text-xl font-bold mb-2">Accepted</h2>
            <p className="text-3xl font-semibold">{analytics.accepted_submissions}</p>
          </div>
          <div className="bg-red-100 p-6 rounded-2xl shadow text-center hover:scale-105 transform transition">
            <h2 className="text-xl font-bold mb-2">Failed</h2>
            <p className="text-3xl font-semibold">{analytics.failed_submissions}</p>
          </div>
          <div className="bg-yellow-100 p-6 rounded-2xl shadow text-center hover:scale-105 transform transition">
            <h2 className="text-xl font-bold mb-2">Languages Used</h2>
            <p className="text-3xl font-semibold">{analytics.languages_used}</p>
          </div>
        </div>
      )}

      {/* Analytics Graphs */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Submissions Bar Chart */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-4">Submission Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Accepted", value: analytics.accepted_submissions },
                  { name: "Failed", value: analytics.failed_submissions },
                ]}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Languages Pie Chart */}
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h2 className="text-xl font-bold mb-4">Languages Used</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.languages_breakdown || []}
                  dataKey="count"
                  nameKey="language"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {(analytics.languages_breakdown || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={["#3b82f6", "#ef4444", "#10b981", "#f59e0b"][index % 4]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Submission Stats by Problem */}
      {analytics?.problem_stats && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Submissions by Problem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analytics.problem_stats.map((p) => (
              <div
                key={p.problem_id}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition transform hover:scale-105"
              >
                <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
                <p><strong>Total Submissions:</strong> {p.total}</p>
                <p><strong>Accepted:</strong> {p.accepted}</p>
                <p><strong>Failed:</strong> {p.failed}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Badges Earned</h2>
          <div className="flex flex-wrap gap-6">
            {badges.map((badge, index) => {
              const earned = index === 0; // first badge visually unlocked
              return (
                <div
                  key={badge.key}
                  className={`bg-white p-4 rounded-2xl shadow-lg w-48 flex flex-col items-center text-center transition-transform transform hover:scale-105 ${
                    earned ? "opacity-100" : "opacity-40 grayscale"
                  }`}
                  style={{ userSelect: "none" }}
                >
                  <img
                    src={`/badges/${badge.key}.png`}
                    alt={badge.name}
                    className={`w-20 h-20 mb-2 transition-transform ${
                      earned ? "hover:scale-110" : ""
                    }`}
                    style={{ userSelect: "none" }}
                  />
                  <h3
                    className={`font-semibold mb-1 transition-colors ${
                      earned ? "hover:text-blue-600" : ""
                    }`}
                    style={{ userSelect: "none" }}
                  >
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-600" style={{ userSelect: "none" }}>
                    {badge.description}
                  </p>
                  {!earned && (
                    <span
                      className="mt-2 text-red-500 text-sm font-semibold"
                      style={{ userSelect: "none" }}
                    >
                      🔒 Locked
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
