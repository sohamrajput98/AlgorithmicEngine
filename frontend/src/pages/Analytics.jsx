import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { getToken } from "../services/auth";

import { QuickStats, DetailedStats, BadgesSection } from "../components/StatsCards";
import { LineChart, PieChart, CategoryBarChart } from "../components/Charts";

// Helper to safely get nested fields with possible different naming conventions
function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj == null) continue;
    if (Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
  }
  return undefined;
}

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

  // Loading / fallback UI
  if (loadingUser) return <div className="text-center mt-20 text-gray-400">Loading user info...</div>;

  // Helpful debug logs — remove or comment out later if noisy
  // These will help you see exact shapes returned by backend
  console.debug("Analytics.raw:", analytics);
  console.debug("Badges.raw:", badges);

  // Defensive mapping for stats (accept different key names)
  const totalSubmissions = pick(analytics, "total_submissions", "totalSubmissions", "total") ?? 0;
  const acceptedSubmissions = pick(analytics, "accepted_submissions", "acceptedSubmissions", "accepted", "total_accepted") ?? 0;
  const failedSubmissions = pick(analytics, "failed_submissions", "failedSubmissions", "failed", "total_failed") ?? 0;
  const languagesUsed = pick(analytics, "languages_used", "languagesUsed", "languages_breakdown") ?? [];

  // Prepare chart data with safe fallback and flexible field names
  const submissionHistoryRaw = pick(analytics, "submission_history", "submissions_over_time", "submissionHistory") || [];
  const lineData = submissionHistoryRaw.map((it) => {
    // try multiple keys for date and accepted/total
    const date = pick(it, "date", "day", "timestamp");
    const accepted = pick(it, "accepted", "accepted_count", "accepted_submissions", "count") ?? 0;
    const total = pick(it, "total", "submissions", "submission_count") ?? accepted;
    return { x: date, y: accepted, total };
  });

  // problem_stats: support p.title or p.name
  const problemStatsRaw = pick(analytics, "problem_stats", "problemStats") || [];
  const difficultyMap = {};
  problemStatsRaw.forEach((p) => {
    const difficulty = (pick(p, "difficulty", "level") || "unknown").toLowerCase();
    const accepted = pick(p, "accepted", "accepted_count", "accepted_submissions") ?? 0;
    difficultyMap[difficulty] = (difficultyMap[difficulty] || 0) + accepted;
  });
  const difficultyData = Object.entries(difficultyMap).map(([k, v]) => ({ x: k.charAt(0).toUpperCase() + k.slice(1), y: v }));

  // category stats: support multiple naming conventions
  const categoryRaw = pick(analytics, "category_stats", "categoryStats", "category_breakdown") || [];
  const categoryData = categoryRaw.map((c) => ({
    category: pick(c, "name", "category", "tag") || "Unknown",
    attempted: pick(c, "attempted", "attempts", "total") ?? 0,
    solved: pick(c, "solved", "accepted", "accepted_count") ?? 0,
  }));

  // If nothing returned — show user-friendly note (but still render components with fallbacks)
  const hasAnalytics = !!analytics && (submissionHistoryRaw.length || problemStatsRaw.length || categoryRaw.length || totalSubmissions);

  return (
    <div className="p-8 max-w-7xl mx-auto text-gray-100 space-y-8">
      <h1 className="text-4xl font-extrabold mb-4 text-center bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-2xl shadow-lg">
        Analytics Dashboard
      </h1>

      <div className="flex justify-end">
        <button
          onClick={() => setViewMode(viewMode === "compact" ? "detailed" : "compact")}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 transition"
        >
          Toggle to {viewMode === "compact" ? "Detailed" : "Compact"} View
        </button>
      </div>

      {/* Quick stats (uses defensive values) */}
      <QuickStats
        analytics={{
          total_submissions: totalSubmissions,
          accepted_submissions: acceptedSubmissions,
          failed_submissions: failedSubmissions,
          languages_used: Array.isArray(languagesUsed) ? languagesUsed : (languagesUsed.length ?? 0),
        }}
      />

      {/* If nothing came back, show helpful message and still render components with placeholders */}
      {!hasAnalytics && (
        <div className="text-center text-gray-400">
          No analytics data returned from the server. Check console (Analytics.raw) for actual response shape.
        </div>
      )}

      {/* detailed view */}
      {viewMode === "detailed" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LineChart data={lineData} />
            <PieChart data={difficultyData} />
          </div>

          <CategoryBarChart data={categoryData} />

          <DetailedStats analytics={analytics || { problem_stats: [] }} />

          <BadgesSection badges={badges || []} />
        </>
      )}

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
