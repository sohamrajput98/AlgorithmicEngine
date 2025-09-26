// Same imports as before
import React, { useState } from "react";
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
  const [viewMode, setViewMode] = useState("detailed");

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

  const { data: analytics } = useQuery({
    queryKey: ["analytics", user?.id],
    queryFn: async () => {
      const res = await api.get(`/analytics/summary?user_id=${user.id}`);
      return res.data;
    },
    enabled: !!user,
  });

  const { data: badges } = useQuery({
    queryKey: ["badges", user?.id],
    queryFn: async () => {
      const res = await api.get(`/badges?user_id=${user.id}`);
      return res.data;
    },
    enabled: !!user,
  });

  if (loadingUser) return <div className="text-center mt-20 text-gray-400">Loading user info...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto text-gray-100">
      <h1 className="text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-xl shadow-lg">
        Analytics Dashboard
      </h1>

      {/* View Mode Toggle */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setViewMode(viewMode === "compact" ? "detailed" : "compact")}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow hover:from-blue-700 hover:to-indigo-700 transition"
        >
          Toggle to {viewMode === "compact" ? "Detailed" : "Compact"} View
        </button>
      </div>

      {/* Quick Stats */}
      {analytics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: "Total Submissions", value: analytics.total_submissions, color: "from-green-600 to-green-400" },
            { label: "Accepted", value: analytics.accepted_submissions, color: "from-blue-600 to-blue-400" },
            { label: "Failed", value: analytics.failed_submissions, color: "from-red-600 to-red-400" },
            { label: "Languages Used", value: analytics.languages_used, color: "from-yellow-600 to-yellow-400" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-r ${stat.color} p-6 rounded-2xl shadow-xl text-center transform hover:scale-105 transition`}
            >
              <h2 className="text-xl font-semibold mb-2">{stat.label}</h2>
              <p className="text-4xl font-bold">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Graphs */}
      {analytics && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Submission Overview</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: "Accepted", value: analytics.accepted_submissions },
                  { name: "Failed", value: analytics.failed_submissions },
                ]}
              >
                <XAxis dataKey="name" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip />
                <Bar dataKey="value" fill="#60a5fa" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Languages Used</h2>
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
                      fill={["#60a5fa", "#f87171", "#34d399", "#fbbf24"][index % 4]}
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

      {/* Problem Stats */}
      {analytics?.problem_stats && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Submissions by Problem</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analytics.problem_stats.map((p) => (
              <div
                key={p.problem_id}
                className="bg-gray-800 p-6 rounded-2xl shadow-xl hover:shadow-2xl transition transform hover:scale-105"
              >
                <h3 className="font-semibold text-lg mb-2 text-white">{p.title}</h3>
                <p className="text-gray-300"><strong>Total:</strong> {p.total}</p>
                <p className="text-green-400"><strong>Accepted:</strong> {p.accepted}</p>
                <p className="text-red-400"><strong>Failed:</strong> {p.failed}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Badges */}
      {badges && badges.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Badges Earned</h2>
          <div className="flex flex-wrap gap-6">
            {badges.map((badge, index) => {
              const earned = index === 0;
              return (
                <div
                  key={badge.key}
                  className={`bg-gray-800 p-4 rounded-2xl shadow-xl w-48 flex flex-col items-center text-center transition-transform transform hover:scale-105 ${
                    earned ? "opacity-100" : "opacity-40 grayscale"
                  }`}
                >
                  <img
                    src={`/badges/${badge.key}.png`}
                    alt={badge.name}
                    className={`w-20 h-20 mb-2 transition-transform ${
                      earned ? "hover:scale-110" : ""
                    }`}
                  />
                  <h3 className={`font-semibold mb-1 ${earned ? "text-white" : "text-gray-400"}`}>
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-400">{badge.description}</p>
                  {!earned && (
                    <span className="mt-2 text-red-400 text-sm font-semibold">🔒 Locked</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}