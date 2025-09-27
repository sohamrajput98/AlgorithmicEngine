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

  if (loadingUser) {
    return <div className="text-center text-gray-400 mt-20">Loading user info...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 bg-gray-900 min-h-screen text-gray-100">
      <h1 className="text-3xl md:text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-purple-500 to-indigo-500 p-4 rounded-2xl shadow-xl">
        Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 flex-wrap border-b border-gray-700">
        {["overview", "analytics", "badges", "actions"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-medium transition ${
              activeTab === tab
                ? "border-b-2 border-purple-400 text-purple-400"
                : "text-gray-400 hover:text-purple-400"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {user && (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl transition transform hover:scale-[1.02]">
                <h2 className="font-semibold text-2xl mb-4 text-white border-b border-gray-700 pb-2">
                  User Info
                </h2>
                <div className="mt-4 space-y-3">
                  {["id", "email", "display_name", "role"].map((field) => (
                    <div key={field}>
                      <p className="text-gray-400 font-medium">
                        {field.replace("_", " ").toUpperCase()}
                      </p>
                      <p className="text-white font-semibold">{user[field]}</p>
                    </div>
                  ))}
                  <div>
                    <p className="text-gray-400 font-medium">Status</p>
                    <p className={`font-semibold ${user.is_active ? "text-green-400" : "text-red-400"}`}>
                      {user.is_active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                  className="mt-6 w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-xl hover:from-purple-600 hover:to-indigo-600 transition"
                >
                  Logout
                </button>
              </div>
            )}

            {analytics && (
              <div className="bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-700 hover:shadow-2xl transition transform hover:scale-[1.02]">
                <h2 className="font-semibold text-2xl mb-4 text-white border-b border-gray-700 pb-2">
                  Quick Analytics
                </h2>
                <div className="flex flex-col gap-6 mt-4">
                  <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 rounded-xl text-center shadow-md hover:shadow-lg transition transform hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold text-white">Total Submissions</h3>
                    <p className="text-4xl font-bold text-white mt-2">{analytics.total_submissions}</p>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-teal-500 p-6 rounded-xl text-center shadow-md hover:shadow-lg transition transform hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold text-white">Accepted Submissions</h3>
                    <p className="text-4xl font-bold text-white mt-2">{analytics.accepted_submissions}</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 rounded-xl text-center shadow-md hover:shadow-lg transition transform hover:scale-[1.02]">
                    <h3 className="text-lg font-semibold text-white">Failed Submissions</h3>
                    <p className="text-4xl font-bold text-white mt-2">{analytics.failed_submissions}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="bg-gray-800 shadow-xl rounded-2xl p-6 hover:shadow-2xl transition overflow-x-auto">
            <h2 className="font-semibold text-xl mb-3 text-white">Detailed Analytics</h2>
            {analytics ? (
              <pre className="bg-gray-900 p-4 rounded-lg text-sm overflow-x-auto text-gray-200">
                {JSON.stringify(analytics, null, 2)}
              </pre>
            ) : (
              <p className="text-gray-400">No analytics available yet.</p>
            )}
          </div>
        )}

        {activeTab === "badges" && (
          <>
            {user && <Badges userId={user.id} />}
            {badges && badges.length > 0 && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Your Badges</h2>
                <div className="flex flex-wrap gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.key}
                      className="bg-gray-800 shadow-xl rounded-2xl w-40 p-4 flex flex-col items-center text-center hover:shadow-2xl transition transform hover:scale-[1.02]"
                    >
                      <img
                        src={process.env.PUBLIC_URL + `/badges/${badge.key}.png`}
                        alt={badge.name}
                        className="w-16 h-16 mb-2"
                      />
                      <h3 className="font-semibold text-white">{badge.name}</h3>
                      <p className="text-sm text-gray-300">{badge.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "actions" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/problems"
              className="block px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl hover:from-purple-600 hover:to-indigo-600 text-center transition"
            >
              View Problems
            </Link>
            <Link
              to="/editor/1"
              className="block px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl hover:from-green-600 hover:to-teal-600 text-center transition"
            >
              Open Editor
            </Link>
            <Link
              to="/submissions"
              className="block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 text-center transition"
            >
              View Submissions
            </Link>
            <Link
              to="/analytics"
              className="block px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl hover:from-yellow-600 hover:to-orange-600 text-center transition"
            >
              View Analytics
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
