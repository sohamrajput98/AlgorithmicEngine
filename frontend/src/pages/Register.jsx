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
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-96">
        <h2 className="text-2xl mb-4">Register</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
               className="w-full mb-3 p-2 border rounded" required />
        <input type="text" placeholder="Display Name" value={displayName} onChange={e => setDisplayName(e.target.value)}
               className="w-full mb-3 p-2 border rounded" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
               className="w-full mb-3 p-2 border rounded" required />
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}
