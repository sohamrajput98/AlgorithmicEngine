// Dashboard.jsx (visual enhancement only)
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { getToken, logout } from "../services/auth";
import Badges from "./Badges";

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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

  if (loadingUser)
    return <div className="text-center text-gray-500 mt-20">Loading user info...</div>;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 mb-6 text-center">
        Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap border-b border-gray-200">
        {["overview", "analytics", "badges", "actions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content wrapper */}
      <div className="space-y-6">
        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user && (
              <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition">
                <h2 className="font-semibold text-xl mb-3 text-gray-700">User Info</h2>
                <p>
                  <strong>ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Display Name:</strong> {user.display_name}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <p>
                  <strong>Status:</strong> {user.is_active ? "Active" : "Inactive"}
                </p>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            )}

            {analytics && (
              <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition">
                <h2 className="font-semibold text-xl mb-3 text-gray-700">Quick Analytics</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-green-100 p-4 rounded-lg text-center hover:bg-green-200 transition">
                    <h3 className="text-lg font-bold text-gray-800">Total</h3>
                    <p className="text-2xl font-semibold">{analytics.total_submissions}</p>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-lg text-center hover:bg-blue-200 transition">
                    <h3 className="text-lg font-bold text-gray-800">Accepted</h3>
                    <p className="text-2xl font-semibold">{analytics.accepted_submissions}</p>
                  </div>
                  <div className="bg-red-100 p-4 rounded-lg text-center hover:bg-red-200 transition">
                    <h3 className="text-lg font-bold text-gray-800">Failed</h3>
                    <p className="text-2xl font-semibold">{analytics.failed_submissions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition overflow-x-auto">
            <h2 className="font-semibold text-xl mb-3 text-gray-700">Detailed Analytics</h2>
            {analytics ? (
              <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify(analytics, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-500">No analytics available yet.</p>
            )}
          </div>
        )}

        {/* Badges */}
        {activeTab === "badges" && (
          <>
            {user && <Badges userId={user.id} />}
            {badges && badges.length > 0 && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4 text-gray-700">Your Badges</h2>
                <div className="flex flex-wrap gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.key}
                      className="bg-white shadow-xl rounded-2xl w-40 p-4 flex flex-col items-center text-center hover:shadow-2xl transition"
                    >
                      <img
                        src={process.env.PUBLIC_URL + `/badges/${badge.key}.png`}
                        alt={badge.name}
                        className="w-16 h-16 mb-2"
                      />
                      <h3 className="font-semibold text-gray-800">{badge.name}</h3>
                      <p className="text-sm text-gray-600">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        {activeTab === "actions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/problems"
              className="block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-center transition"
            >
              View Problems
            </Link>
            <Link
              to="/editor/1"
              className="block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-center transition"
            >
              Open Editor
            </Link>
            <Link
              to="/submissions"
              className="block px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 text-center transition"
            >
              View Submissions
            </Link>
            <Link
              to="/analytics"
              className="block px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-center transition"
            >
              View Analytics
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
