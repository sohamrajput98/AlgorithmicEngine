// AnalyticsDashboard.jsx
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from "recharts";
import { supplementalAnalytics } from "../services/analytic.js"; 

/* ---------------------------
   Helper function
--------------------------- */
export function pick(obj, ...keys) {
  for (const k of keys) {
    if (obj == null) continue;
    if (Object.prototype.hasOwnProperty.call(obj, k)) return obj[k];
  }
  return undefined;
}

/* ---------------------------
   ICONS
--------------------------- */
const GithubIcon = () => <svg viewBox="0 0 16 16" className="w-5 h-5" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path></svg>;
const LinkedinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.25 6.5 1.75 1.75 0 016.5 8.25zM19 19h-3v-4.75c0-1.4-1.2-2.5-2.5-2.5S11 12.85 11 14.25V19h-3v-9h3V11c1.4-2 4-2.25 5 1.25z"></path></svg>;
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const EducationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" /></svg>;

/* ---------------------------
   EditableField component
--------------------------- */
const EditableField = ({ label, value, isEditing, isReadOnly = false, placeholder, Icon }) => (
  <div className="w-full flex items-center gap-2">
    {Icon && <Icon className="text-slate-400 w-4 h-4 shrink-0" />}
    <div className="flex-1">
      <label className="text-xs font-medium text-slate-400">{label}</label>
      {isEditing && !isReadOnly ? (
        <input type="text" defaultValue={value} placeholder={placeholder} className="w-full bg-slate-700/80 text-sm text-slate-200 rounded-md py-2 px-3 mt-1 outline-none focus:ring-2 ring-purple-500 transition-all" />
      ) : (
        <p className={`text-sm mt-1 truncate ${isReadOnly ? "text-slate-500" : "text-slate-200"}`}>{value || <span className="text-slate-500">{placeholder}</span>}</p>
      )}
    </div>
  </div>
);

/* ---------------------------
   UserProfileCard
--------------------------- */
export const UserProfileCard = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const displayName = user?.display_name || "User";
  const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${displayName}`;
  const username = user?.username || displayName.toLowerCase().replace(/\s/g, "_");
  const rank = user?.rank ?? "1";
  const skills = user?.skills || ["Dynamic Programming", "Graphs", "React", "FastApi", "Python3"];
  const location = user?.location || "Mumbai, India";
  const education = user?.education || "Vidyavardhini Navi Technology, Vasai";
  const linkedin = user?.linkedin || "https://www.linkedin.com/abc";
  const github = user?.github || "https://github.com/abc";

  return (
    <motion.div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 flex flex-col h-full"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          <img src={avatarUrl} alt="Avatar" className="w-20 h-20 rounded-full border-2 border-purple-500"/>
          <div>
            {isEditing ? (
              <EditableField label="Display Name" value={displayName} isEditing={true} />
            ) : (
              <h2 className="text-2xl font-bold text-white">{displayName}</h2>
            )}
            <p className="text-sm text-slate-500">@{username}</p>
          </div>
        </div>
        <p className="text-sm text-slate-400 mt-1 font-bold">Rank #{rank}</p>
      </div>

      <div className="my-4">
        <label className="text-sm font-semibold text-slate-300">About</label>
        {isEditing ? (
          <textarea defaultValue="Loves solving DSA problems and building cool projects. Passionate about system design and competitive programming." className="w-full bg-slate-700/80 text-sm text-slate-300 rounded-md p-2 mt-1 h-24 resize-none outline-none focus:ring-2 ring-purple-500"/>
        ) : (
          <p className="text-sm text-slate-400 mt-1 h-24">
            Loves solving DSA problems and building cool projects. Passionate about system design and competitive programming.
          </p>
        )}
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2"><LocationIcon /><EditableField label="Location" value={location} isEditing={isEditing} placeholder="Your Location" /></div>
        <div className="flex items-center gap-2"><EducationIcon /><EditableField label="Education" value={education} isEditing={isEditing} placeholder="Your University" /></div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 mb-2">Skills</h3>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <span key={skill} className="bg-slate-700 text-slate-300 text-xs font-semibold px-3 py-1.5 rounded-full">{skill}</span>
          ))}
        </div>
      </div>

      <div className="flex-grow space-y-4">
        <EditableField label="LinkedIn" value={linkedin} Icon={LinkedinIcon} isEditing={isEditing} placeholder="linkedin.com/in/your-profile" />
        <EditableField label="GitHub" value={github} Icon={GithubIcon} isEditing={isEditing} placeholder="github.com/your-profile" />
      </div>

      <button onClick={() => setIsEditing(!isEditing)} className="gradient-button mt-6 w-full">
        {isEditing ? "Save Profile" : "Edit Profile"}
      </button>
    </motion.div>
  );
};

/* ---------------------------
   StarRating (used in new SolvedStatsCard)
--------------------------- */
const StarRating = ({ stars }) => (
  <div className="flex items-center">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg key={i} className={`w-4 h-4 ${i < stars ? 'text-yellow-400' : 'text-slate-600'}`} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);


  // SolvedStatsCard (new stars version)



const SolvedStatsCard = ({ accepted, total, failed, difficultyData }) => {
  // fallback to supplementalAnalytics if difficultyData not passed
  const data = difficultyData && difficultyData.length ? difficultyData : supplementalAnalytics.problem_stats;

  const difficulties = {};
  (data || []).forEach(d => {
    difficulties[d.difficulty] = d.accepted || 0;
  });

  const totalSolvedByDifficulty = Object.values(difficulties).reduce((sum, val) => sum + val, 0);

  return (
    <motion.div
      className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">Submission Stats</h3>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="relative w-36 h-36 flex-shrink-0">
          <svg className="w-full h-full" viewBox="0 0 120 120">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#A855F7" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
            <circle className="text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r="50" cx="60" cy="60" />
            <motion.circle
              strokeWidth="10"
              strokeDasharray="314"
              strokeLinecap="round"
              stroke="url(#g)"
              fill="transparent"
              r="50"
              cx="60"
              cy="60"
              transform="rotate(-90 60 60)"
              initial={{ strokeDashoffset: 314 }}
              animate={{ strokeDashoffset: 314 - (total > 0 ? (accepted / total) * 314 : 0) }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{`${total > 0 ? Math.round((accepted / total) * 100) : 0}%`}</span>
            <span className="text-xs text-slate-400">Success</span>
          </div>
        </div>

        <div className="flex-grow w-full space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div><p className="text-2xl font-bold text-blue-400">{total}</p><p className="text-sm text-slate-400">Total</p></div>
            <div><p className="text-2xl font-bold text-green-400">{accepted}</p><p className="text-sm text-slate-400">Accepted</p></div>
            <div><p className="text-2xl font-bold text-red-400">{failed}</p><p className="text-sm text-slate-400">Failed</p></div>
          </div>

          {[1, 2, 3, 4, 5].map(d => (
            <div key={d}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-300">{`${d}★`}</span>
                <span className="font-semibold text-white">{difficulties[d] || 0} Solved</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2.5">
                <div
                  className="bg-purple-500 h-2.5 rounded-full"
                  style={{
                    width: `${totalSolvedByDifficulty > 0 ? ((difficulties[d] || 0) / totalSolvedByDifficulty) * 100 : 0}%`
                  }}
                />
              </div>
              <StarRating stars={d} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------------------
   AlgorithmBreakdownCard
--------------------------- */
export const AlgorithmBreakdownCard = ({ categoryData = [] }) => {
  return (
    <motion.div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
      <h3 className="text-lg font-semibold text-white mb-4">Algorithm Breakdown</h3>
      <div className="space-y-2">
        {categoryData.map(cat => (
          <div key={cat.name}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-300">{cat.name}</span>
              <span className="font-semibold text-white">{cat.count} Solved</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2.5">
              <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${cat.total > 0 ? (cat.count / cat.total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ---------------------------
   ArrayMetricsCard
--------------------------- */
export const ArrayMetricsCard = ({ languagesUsed = [] }) => {
  return (
    <motion.div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <h3 className="text-lg font-semibold text-white mb-4">Languages Used</h3>
      <div className="grid grid-cols-2 gap-4">
        {languagesUsed.map(lang => (
          <div key={lang.language} className="flex justify-between">
            <span className="text-slate-300">{lang.language}</span>
            <span className="font-semibold text-white">{lang.count}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ---------------------------
   SubmissionsHeatmap
--------------------------- */
export const SubmissionsHeatmap = ({ submissionHistory = [] }) => {
  const dataMap = new Map(submissionHistory.map(d => [d.date, d.count]));
  const today = new Date();
  const cells = Array.from({ length: 371 });
  const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <motion.div className="bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
      <h3 className="text-lg font-semibold text-white mb-4">{submissionHistory.length} submissions in the last year</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-x-[15px] text-xs text-slate-400 pl-6">{monthLabels.map(m => <div key={m}>{m}</div>)}</div>
        <div className="grid grid-flow-col grid-rows-7 grid-cols-53 gap-1 mt-2">
          {cells.map((_, index) => {
            const date = new Date(today);
            date.setDate(today.getDate() - 370 + index);
            const dateString = date.toISOString().split('T')[0];
            const count = dataMap.get(dateString) || 0;
            let bgColor = 'bg-slate-700/30';
            if (count > 0) bgColor = 'bg-purple-900';
            if (count > 2) bgColor = 'bg-purple-700';
            if (count > 5) bgColor = 'bg-purple-500';
            if (count > 8) bgColor = 'bg-purple-400';
            return <div key={index} className={`w-3 h-3 rounded-sm ${bgColor}`} title={`${count} submissions on ${dateString}`} />;
          })}
        </div>
      </div>
    </motion.div>
  );
};

/* ---------------------------
   BadgesCard
--------------------------- */
export const BadgesCard = ({ badges }) => {
  return (
    <motion.div className="bg-slate-800/60 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
      <h3 className="text-lg font-semibold text-white mb-4">Badges</h3>
      <div className="grid grid-cols-3 gap-4">
        {(badges || []).map((badge, idx) => {
          const isLocked = badge.unlocked === false || idx >= 3;
          return (
            <div key={badge.key} className="flex flex-col items-center text-center">
              <img src={isLocked ? "/badges/locked.png" : `/badges/${badge.key}.png`} alt={badge.name} className="w-12 h-12 mb-1 opacity-90" onError={(e) => (e.target.src = "https://placehold.co/48x48/1e293b/94a3b8?text=?")} />
              <p className="text-xs text-slate-300">{badge.name}</p>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
export { SolvedStatsCard };
