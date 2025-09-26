// src/pages/Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Code, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100 p-6">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg">
          Welcome to AlgoEngine
        </h1>
        <p className="text-gray-300 text-lg md:text-xl mb-8">
          Solve problems, track your submissions, and level up your coding skills.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/login"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-semibold rounded-lg shadow-xl transition transform hover:scale-105 hover:shadow-2xl"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-semibold rounded-lg shadow-xl transition transform hover:scale-105 hover:shadow-2xl"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl text-center">
        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl hover:scale-105 transform transition border-2 border-gradient-r from-blue-400 to-purple-500">
          <Zap className="mx-auto mb-4 text-blue-400 w-12 h-12 drop-shadow-lg" />
          <h3 className="text-xl font-bold mb-2 text-white">Track Submissions</h3>
          <p className="text-gray-300">
            Keep track of all your attempts, see which problems you solved, and learn from your mistakes.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl hover:scale-105 transform transition border-2 border-gradient-r from-green-400 to-teal-500">
          <Code className="mx-auto mb-4 text-green-400 w-12 h-12 drop-shadow-lg" />
          <h3 className="text-xl font-bold mb-2 text-white">Multi-Language Support</h3>
          <p className="text-gray-300">
            Write and test solutions in Python, C++, JavaScript and more, all in one platform.
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-2xl hover:scale-105 transform transition border-2 border-gradient-r from-yellow-400 to-orange-500">
          <Award className="mx-auto mb-4 text-yellow-400 w-12 h-12 drop-shadow-lg" />
          <h3 className="text-xl font-bold mb-2 text-white">Analytics & Badges</h3>
          <p className="text-gray-300">
            View your progress with detailed analytics and earn badges for achievements.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-20 text-gray-400 text-sm">
        © 2025 AlgoEngine. Build your coding journey.
      </div>
    </div>
  );
}
