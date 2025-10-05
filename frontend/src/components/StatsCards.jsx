
import React from "react";
import BadgeCard from "./BadgeCard";

// Defensive pick helper
const pick = (obj, ...keys) => {
  for (const k of keys) {
    if (obj && Object.prototype.hasOwnProperty.call(obj, k)) {
      const val = obj[k];
      if (typeof val === "string" || typeof val === "number") return val;
      if (Array.isArray(val)) return val;
      if (val !== null && val !== undefined) return String(val);
    }
  }
  return undefined;
};

// Quick stats component (exported)
export function QuickStats({ analytics }) {
  if (!analytics) return null;

  const stats = [
    {
      label: "Total Submissions",
      value: pick(analytics, "total_submissions", "totalSubmissions", "total") ?? 0,
      gradient: "from-blue-600 to-cyan-500",
    },
    {
      label: "Accepted",
      value: pick(analytics, "accepted_submissions", "acceptedSubmissions", "accepted", "total_accepted") ?? 0,
      gradient: "from-green-600 to-emerald-400",
    },
    {
      label: "Failed",
      value: pick(analytics, "failed_submissions", "failedSubmissions", "failed", "total_failed") ?? 0,
      gradient: "from-red-600 to-rose-400",
    },
    {
      label: "Languages Used",
      value: Array.isArray(analytics.languages_used)
        ? analytics.languages_used.length
        : analytics.languages_used ?? 0,
      gradient: "from-purple-600 to-indigo-500",
    },
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

// Detailed statistics table (premium version)
export function DetailedStats({ analytics }) {
  const rawProblemStats = pick(analytics, "problem_stats", "problemStats");
  const problemStats = Array.isArray(rawProblemStats) ? rawProblemStats : [];

  const rawStepAnalysis = pick(analytics, "step_analysis", "stepAnalysis");
  const stepAnalysis = Array.isArray(rawStepAnalysis) ? rawStepAnalysis : [];

  return (
    <div className="space-y-8">
      {/* Problem Stats */}
      <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-5 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Problem Statistics
        </h2>

        <div className="hidden md:grid grid-cols-12 gap-4 px-4 pb-3 border-b-2 border-gray-700">
          <div className="col-span-6 text-sm font-semibold text-gray-400 uppercase tracking-wider">Problem</div>
          <div className="col-span-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">Difficulty</div>
          <div className="col-span-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">Progress</div>
        </div>

        <div className="space-y-3 mt-3">
          {problemStats.map((p, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 items-center gap-4 p-4 rounded-lg bg-gray-900/50 hover:bg-gray-700/50 border border-transparent hover:border-purple-500/50 shadow-md hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="col-span-12 md:col-span-6 font-semibold text-gray-200">{p.problem}</div>

              <div className="col-span-6 md:col-span-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full w-20 text-center inline-block ${
                  p.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                  p.difficulty === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {p.difficulty}
                </span>
              </div>

              <div className="col-span-6 md:col-span-4 flex items-center">
                <div className="w-full bg-gray-600 rounded-full h-2.5 mr-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2.5 rounded-full"
                    style={{ width: `${p.attempts > 0 ? (p.solved / p.attempts) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-mono text-gray-400">{`${p.solved}/${p.attempts}`}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step Analysis */}
{stepAnalysis.length > 0 && (
  <div className="bg-gray-800 rounded-xl p-6 shadow-lg relative overflow-hidden">
    <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
      Step Analysis
    </h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {stepAnalysis.map((s, idx) => (
        <div
          key={idx}
          className="relative p-6 rounded-xl border border-gray-700/50 shadow-lg backdrop-filter backdrop-blur-lg bg-white/5 hover:border-purple-500 transition-all duration-300 ease-in-out cursor-pointer group"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px) saturate(180%)',
            WebkitBackdropFilter: 'blur(10px) saturate(180%)'
          }}
        >
          <div
            className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(to right bottom, var(--tw-gradient-stops))',
              '--tw-gradient-from': '#534d64ff',
              '--tw-gradient-to': '#6a6fa0ff',
              padding: '2px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          ></div>

          <div className="relative z-20">
            <div className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-1 group-hover:text-purple-300 transition-colors duration-200">
              {s.step}
            </div>
            <div className="text-4xl font-extrabold text-white group-hover:scale-105 transition-transform duration-200">
              {s.count}
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

      )}
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
          const earned = !!(pick(b, "unlocked", "earned", "is_unlocked") || false);
          const name = pick(b, "name", "title") || pick(b, "key") || "Badge";
          const description = pick(b, "description", "desc", "summary") || "";
          const keyOrId = pick(b, "key", "id", "slug") || name;
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