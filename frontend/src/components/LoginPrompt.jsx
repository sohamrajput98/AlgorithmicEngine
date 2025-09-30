// frontend/src/components/LoginPrompt.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { FiLock } from 'react-icons/fi'; // Using a lock icon for effect

export const LoginPrompt = () => {
  return (
    <div className="max-w-md mx-auto mt-20 text-center">
      <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-8 shadow-2xl">
        <FiLock className="mx-auto h-16 w-16 text-purple-400" />
        <h2 className="mt-6 text-2xl font-extrabold text-white">
          Access Restricted
        </h2>
        <p className="mt-2 text-gray-400">
          You need to be logged in to view the problemset.
        </p>
        <Link
          to="/login"
          className="mt-6 inline-block w-full px-6 py-3 text-white font-semibold rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-[#6b21a8] to-[#4338ca] hover:opacity-90"
        >
          Go to Login Page
        </Link>
      </div>
    </div>
  );
};