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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-yellow-200 via-green-100 to-blue-100">
      <form onSubmit={handleSubmit} className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-700">Register</h2>
        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none" 
          required 
        />
        <input 
          type="text" 
          placeholder="Display Name" 
          value={displayName} 
          onChange={e => setDisplayName(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none" 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-6 p-3 border rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none" 
          required 
        />
        <button 
          type="submit" 
          className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-green-600 hover:to-teal-600 transition"
        >
          Register
        </button>
      </form>
    </div>
  );
}
