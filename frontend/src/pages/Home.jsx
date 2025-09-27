import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, Code, Award } from "lucide-react";
import { motion } from "framer-motion";

import GradientButton from '../components/ui/GradientButton.jsx';
import { FeatureCard } from "../components/ui/FeatureCard";
import NavbarHome from "../components/ui/NavbarHome";

const gradients = [
  "linear-gradient(135deg, #0f172a, #1e1b4b)",               // deep slate to indigo
  "linear-gradient(135deg, #1e1b4b, #2a2a4f, #3b3b6b)",       // muted indigo to twilight violet
  "linear-gradient(135deg, #1e293b, #2f2f4f, #4b4b6b)",       // dark navy to soft purple
  "linear-gradient(135deg, #0c4a6e, #1e3a5c, #2e2e5e)",       // deep blue to dusk violet
];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % gradients.length);
    }, 1000); // 8s per gradient

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full min-h-screen overflow-hidden text-gray-100 bg-gray-900">
      {/* Navbar */}
      <NavbarHome />

      {/* Animated background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {gradients.map((bg, i) => (
          <motion.div
            key={i}
            className="absolute inset-0"
            style={{ backgroundImage: bg }}
            initial={{ opacity: i === index ? 1 : 0 }}
            animate={{ opacity: i === index ? 1 : 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 px-6 py-12 pt-32 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
            Welcome to AlgoEngine
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">
            Solve problems, track your submissions, and level up your coding skills.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
  <GradientButton className="px-16 py-4"> {/* wider horizontally */}
    <Link to="/login">Login</Link>
  </GradientButton>
  <GradientButton variant="variant" className="px-16 py-4">
    <Link to="/register">Register</Link>
  </GradientButton>
</div>

        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-center">
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-blue-400" />}
            title="Track Submissions"
            description="Keep track of all your attempts, see which problems you solved, and learn from your mistakes."
            colors={["#1e3a8a", "#1e40af", "#1d4ed8"]}
            variant="icon"
          />
          <FeatureCard
            icon={<Code className="w-10 h-10 text-green-400" />}
            title="Multi-Language Support"
            description="Write and test solutions in Python, C++, JavaScript and more, all in one platform."
            colors={["#064e3b", "#065f46", "#047857"]}
            variant="icon"
          />
          <FeatureCard
            icon={<Award className="w-10 h-10 text-yellow-400" />}
            title="Analytics & Badges"
            description="View your progress with detailed analytics and earn badges for achievements."
            colors={["#78350f", "#92400e", "#b45309"]}
            variant="icon"
          />
        </div>

        {/* Footer */}
        <div className="mt-20 text-gray-400 text-sm">
          © 2025 AlgoEngine. Build your coding journey.
        </div>
      </div>
    </div>
  );
}