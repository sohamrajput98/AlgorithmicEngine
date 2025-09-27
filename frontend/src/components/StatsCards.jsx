import React from "react";
import BadgeCard from "./BadgeCard";

// Defensive pick helper
const pick = (obj, ...keys) => {
  for (const k of keys) if (obj && Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
  return undefined;
};

// Quick stats component (exported)
export function QuickStats({ analytics }) {
  if (!analytics) return null;

  const stats = [
    { label: "Total Submissions", value: pick(analytics, "total_submissions", "totalSubmissions", "total") ?? 0, gradient: "from-blue-600 to-cyan-500" },
    { label: "Accepted", value: pick(analytics, "accepted_submissions", "acceptedSubmissions", "accepted", "total_accepted") ?? 0, gradient: "from-green-600 to-emerald-400" },
    { label: "Failed", value: pick(analytics, "failed_submissions", "failedSubmissions", "failed", "total_failed") ?? 0, gradient: "from-red-600 to-rose-400" },
    { label: "Languages Used", value: Array.isArray(analytics.languages_used) ? analytics.languages_used.length : (analytics.languages_used ?? 0), gradient: "from-purple-600 to-indigo-500" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((s) => (
        <div key={s.label} className={`p-6 rounded-xl bg-gradient-to-r ${s.gradient} text-white text-center shadow-lg`}>
          <div className="text-2xl font-bold">{s.value}</div>
          <div className="text-sm mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

// Detailed statistics table
export function DetailedStats({ analytics }) {
  const problemStats = pick(analytics, "problem_stats", "problemStats") || [];

  if (!problemStats.length) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-2">Detailed Problem Stats</h2>
        <div className="text-gray-400">No problem stats available.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-8">
      <h2 className="text-xl font-semibold mb-4">Detailed Problem Stats</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-gray-200">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="p-2">Problem</th>
              <th className="p-2">Difficulty</th>
              <th className="p-2">Accepted</th>
              <th className="p-2">Failed</th>
              <th className="p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {problemStats.map((p) => {
              const title = pick(p, "title", "name") || "Untitled";
              const accepted = pick(p, "accepted", "accepted_count", "accepted_submissions") ?? 0;
              const failed = pick(p, "failed", "failed_count") ?? 0;
              const total = pick(p, "total", "submissions") ?? (accepted + failed);

              return (
                <tr key={pick(p, "problem_id", "id") || title} className="border-b border-gray-700">
                  <td className="p-2">{title}</td>
                  <td className="p-2 capitalize">{(pick(p, "difficulty", "level") || "unknown").toLowerCase()}</td>
                  <td className="p-2">{accepted}</td>
                  <td className="p-2">{failed}</td>
                  <td className="p-2">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Badges: use existing BadgeCard interface
export function BadgesSection({ badges }) {
  if (!badges) return null;
  if (!Array.isArray(badges) || badges.length === 0) {
    return (
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-8">
        <h2 className="text-xl font-semibold mb-2">Your Badges</h2>
        <div className="text-gray-400">No badges yet.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-lg mt-8">
      <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
      <div className="flex flex-wrap gap-4">
        {badges.map((b) => {
          // map unlocked/earned to BadgeCard props
          const earned = !!(pick(b, "unlocked", "earned", "is_unlocked") || false);
const name = pick(b, "name", "title") || pick(b, "key") || "Badge";
const description = pick(b, "description", "desc", "summary") || "";
const keyOrId = pick(b, "key", "id", "slug") || name;

// Use VITE_BADGE_PATH from frontend/.env
const badgeBasePath = import.meta.env.VITE_BADGE_PATH || "/badges";
const icon = `${badgeBasePath}/${keyOrId}.png`;
          return (
            <BadgeCard
              key={keyOrId}
              name={name}
              description={description}
              icon={icon}
              earned={earned}
            />
          );
        })}
      </div>
    </div>
  );
}
