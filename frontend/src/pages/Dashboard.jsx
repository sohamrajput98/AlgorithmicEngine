
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
    BarChart, CheckCircle, XCircle, LogOut, User, Activity, Award, ArrowRight, 
    Calendar, Code, Star, Shield, Clock, Fingerprint
} from 'lucide-react';
import api from "../services/api";
import { getToken, logout } from "../services/auth";
import Badges from "./Badges"; 


const dummyProblemOfTheDay = {
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
};

const dummyRecentSubmissions = [
    { name: "Two Sum", status: "Accepted", time: "5m ago" },
    { name: "Add Two Numbers", status: "Accepted", time: "28m ago" },
    { name: "Longest Substring Without Repeating Characters", status: "Wrong Answer", time: "1h ago" },
    { name: "Valid Parentheses", status: "Accepted", time: "3h ago" },
];

// --- STYLING & HELPER COMPONENTS (for a beautiful and consistent UI) ---
const cardBaseStyle = "bg-slate-800/50 backdrop-blur-lg border border-slate-700/50 rounded-2xl p-6 shadow-lg transition-all duration-300";

const StatCard = ({ icon, title, value }) => (
    <div className={`${cardBaseStyle} hover:border-purple-500/50 hover:-translate-y-1`}>
        <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-900/50 rounded-lg">{icon}</div>
            <div>
                <p className="text-sm text-slate-400">{title}</p>
                <p className="text-2xl font-bold text-white">{value}</p>
            </div>
        </div>
    </div>
);

// --- MAIN DASHBOARD COMPONENT ---
export default function Dashboard() {
    // --- YOUR ORIGINAL LOGIC (UNCHANGED) ---
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
            if (!user) return null;
            const res = await api.get(`/analytics/summary?user_id=${user.id}`);
            return res.data;
        },
        enabled: !!user,
    });

    const { data: badges } = useQuery({
        queryKey: ["badges", user?.id],
        queryFn: async () => {
            if (!user) return null;
            const res = await api.get(`/badges?user_id=${user.id}`);
            return res.data;
        },
        enabled: !!user,
    });

    if (loadingUser) {
        return <div className="flex items-center justify-center min-h-screen bg-[#0F172A] text-slate-400">Loading Dashboard...</div>;
    }
    // --- END OF YOUR ORIGINAL LOGIC ---

    const TABS = ["overview", "analytics", "badges", "actions"];

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 sm:p-6 lg:p-8 text-slate-300">
            <div className="max-w-7xl mx-auto">
                {/* --- Enhanced Header --- */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
                        Welcome, <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">{user?.display_name || 'User'}</span>!
                    </h1>
                    <p className="mt-2 text-slate-400">Here's a snapshot of your coding journey. Keep up the great work!</p>
                </motion.div>

                {/* --- Modern Tab Navigation --- */}
                <div className="flex flex-wrap items-center gap-2 my-8 border-b border-slate-800 pb-2">
                    {TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F172A] focus-visible:ring-purple-500
                                ${activeTab === tab
                                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* --- Tab Content with Animations --- */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === "overview" && <OverviewTabContent user={user} analytics={analytics} navigate={navigate} />}
                        {activeTab === "analytics" && <AnalyticsTabContent analytics={analytics} />}
                        {activeTab === "badges" && <BadgesTabContent badges={badges} user={user} />}
                        {activeTab === "actions" && <ActionsTabContent />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}

// --- TAB CONTENT COMPONENTS (Expansive and Beautiful) ---

const OverviewTabContent = ({ user, analytics, navigate }) => {
    const avatarUrl = user?.avatarUrl || `https://api.dicebear.com/8.x/initials/svg?seed=${user?.display_name || 'User'}`;
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
<div className="lg:col-span-1 flex flex-col gap-6">
  <motion.div
    className={`${cardBaseStyle} flex-grow`}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 }}
  >
    <div className="flex items-center gap-4 mb-6">
      <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-purple-500" />
      <div>
        <h3 className="text-xl font-bold text-white">{user?.display_name}</h3>
        <p className="text-sm text-slate-400">{user?.email}</p>
      </div>
    </div>

    <div className="space-y-3 text-sm flex-grow">
      <div className="flex justify-between items-center">
        <span className="text-slate-400 flex items-center gap-2">
          <User size={14} /> Role
        </span>
        <span className="font-semibold text-white px-2 py-0.5 bg-slate-700 rounded">
          {user?.role}
        </span>
      </div>

        <div className="flex justify-between items-center">
        <span className="text-slate-400 flex items-center gap-2">
          <Fingerprint size={14} /> ID
        </span>
        <span className="font-medium text-slate-300">{user?.id || "N/A"}</span>
      </div>
    </div>
    
      <div className="flex justify-between items-center">
        <span className="text-slate-400 flex items-center gap-2">
          <Shield size={14} /> Status
        </span>
        <span className={`font-semibold ${user?.is_active ? "text-green-400" : "text-red-400"}`}>
          {user?.is_active ? "Active" : "Inactive"}
        </span>
      </div>


    <button
      onClick={() => {
        logout();
        navigate("/login");
      }}
      className="mt-6 flex items-center justify-center gap-2 w-full bg-slate-700/50 text-slate-300 px-4 py-2 rounded-lg hover:bg-red-500/20 hover:text-red-400 transition-colors duration-300"
    >
      <LogOut size={16} /> Logout
    </button>
  </motion.div>


                <motion.div className={cardBaseStyle} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <h3 className="font-semibold text-lg text-white mb-4">Recent Submissions</h3>
                    <div className="space-y-3">
                        {dummyRecentSubmissions.map((sub, i) => (
                            <div key={i} className="flex justify-between items-center text-sm p-2 rounded-md hover:bg-slate-700/50">
                                <div>
                                    <p className="font-medium text-slate-200">{sub.name}</p>
                                    <p className="text-xs text-slate-500 flex items-center gap-1"><Clock size={12}/> {sub.time}</p>
                                </div>
                                <span className={`font-semibold text-xs px-2 py-1 rounded-full ${sub.status === 'Accepted' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{sub.status}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <StatCard icon={<BarChart className="text-blue-400" />} title="Total Submissions" value={analytics?.total_submissions ?? '...'} />
                    <StatCard icon={<CheckCircle className="text-green-400" />} title="Accepted" value={analytics?.accepted_submissions ?? '...'} />
                    <StatCard icon={<XCircle className="text-red-400" />} title="Failed" value={analytics?.failed_submissions ?? '...'} />
                </motion.div>

                <motion.div className={cardBaseStyle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                     <h3 className="font-semibold text-lg text-white mb-4 flex items-center gap-2"><Star size={18} className="text-yellow-400"/> Problem of the Day</h3>
                     <div className="p-4 bg-slate-900/50 rounded-lg">
                        <h4 className="text-xl font-bold text-white">{dummyProblemOfTheDay.title}</h4>
                        <div className="flex items-center justify-between mt-3">
                             <div className="flex items-center gap-2">
                                <span className={`font-semibold text-sm px-3 py-1 rounded-full ${dummyProblemOfTheDay.difficulty === 'Hard' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>{dummyProblemOfTheDay.difficulty}</span>
                                {dummyProblemOfTheDay.tags.map(tag => (
                                    <span key={tag} className="text-xs text-slate-400 bg-slate-700 px-2 py-1 rounded">{tag}</span>
                                ))}
                            </div>
                            <Link to="/problems" className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:opacity-90 transition-opacity">Solve Now</Link>
                         </div>
                     </div>
                </motion.div>
            </div>
        </div>
    );
};

const AnalyticsTabContent = ({ analytics }) => {
    
    return (
        <div className={`${cardBaseStyle} hover:border-purple-500/50`}>
            <h2 className="font-semibold text-xl mb-4 text-white">Detailed Analytics (JSON View)</h2>
            {analytics ? (
                <pre className="bg-slate-900 p-4 rounded-lg text-sm overflow-x-auto text-slate-300 max-h-[500px]">
                    {JSON.stringify(analytics, null, 2)}
                </pre>
            ) : (
                <p className="text-slate-400">No detailed analytics available yet.</p>
            )}
        </div>
    );
};

const BadgesTabContent = ({ user, badges }) => (
    // This is your original Badges tab content, wrapped in a styled card.
    <div className={`${cardBaseStyle} hover:border-purple-500/50`}>
        {user && <Badges userId={user.id} />}
        {badges && badges.length > 0 ? (
             <div>
                <h2 className="text-2xl font-bold mb-4 text-white">Your Badges</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {badges.map((badge) => (
                        <div key={badge.key} className="flex flex-col items-center text-center group p-2 rounded-lg hover:bg-slate-700/50 transition-colors">
                            <div className="bg-slate-900/50 p-4 rounded-full transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-purple-500/20">
                                <img
                                    src={process.env.PUBLIC_URL + `/badges/${badge.key}.png`}
                                    alt={badge.name}
                                    className="w-16 h-16"
                                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64/1e293b/94a3b8?text=?" }}
                                />
                            </div>
                            <h3 className="mt-2 font-semibold text-white text-sm">{badge.name}</h3>
                            <p className="text-xs text-slate-400">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        ) : (
             <p className="text-slate-400">You haven't earned any badges yet. Keep solving to unlock them!</p>
        )}
    </div>
);


const ActionsTabContent = () => {
    
    const actions = [
        { to: "/problems", text: "Solve Problems", icon: <Code size={20} />, style: "from-purple-500 to-indigo-500" },
        { to: "/analytics", text: "View Analytics", icon: <Activity size={20} />, style: "from-blue-500 to-cyan-500" },
        { to: "/submissions", text: "My Submissions", icon: <Award size={20} />, style: "from-green-500 to-emerald-500" },
    ];
    return (
        <div className={cardBaseStyle}>
            <h2 className="text-2xl font-bold mb-4 text-white">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {actions.map(action => (
                    <Link key={action.to} to={action.to} 
                        className={`group relative flex items-center justify-between p-6 bg-slate-800 rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl`}>
                        <div className={`absolute top-0 left-0 h-full w-1 bg-gradient-to-b ${action.style} transition-all duration-300 group-hover:w-full`}></div>
                        <div className="relative z-10 flex items-center gap-4">
                            {action.icon}
                            <span className="font-semibold text-lg text-white">{action.text}</span>
                        </div>
                        <ArrowRight size={20} className="relative z-10 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </Link>
                ))}
            </div>
        </div>
    );
};
