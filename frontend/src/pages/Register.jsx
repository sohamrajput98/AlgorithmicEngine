import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, displayName, password);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <h2 className="text-4xl font-extrabold mb-6 text-center text-green-400 drop-shadow-lg">
          Register
        </h2>

        {error && (
          <div className="text-red-500 mb-4 text-center font-medium">{error}</div>
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-600 rounded-xl bg-gray-800 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition duration-300"
          required
        />
        <input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          className="w-full mb-4 p-3 border border-gray-600 rounded-xl bg-gray-800 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition duration-300"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border border-gray-600 rounded-xl bg-gray-800 text-gray-100 focus:ring-2 focus:ring-green-500 outline-none transition duration-300"
          required
        />
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-teal-500 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-green-700 hover:to-teal-600 transform hover:scale-105 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}