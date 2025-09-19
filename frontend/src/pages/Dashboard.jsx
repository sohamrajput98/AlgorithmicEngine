import React from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Link added
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { getToken, logout } from '../services/auth';

export default function Dashboard() {
  const navigate = useNavigate();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      console.log("Using token:", getToken());
      try {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${getToken()}` }
        });
        console.log("User fetched:", res.data);
        return res.data;
      } catch (err) {
        console.error("Fetch failed:", err);
        logout();
        navigate('/login');
        throw err;
      }
    },
    retry: false, // prevent auto-retry after logout redirect
  });

  if (isLoading) return <div>Loading user info...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Dashboard</h1>

      {user && (
        <div className="bg-white p-4 rounded shadow w-96 mb-6">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Display Name:</strong> {user.display_name}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}</p>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="mt-4 bg-red-600 text-white p-2 rounded"
          >
            Logout
          </button>
        </div>
      )}

      {/* ✅ Task 3: Action Links */}
      <div className="space-y-4">
        <Link to="/problems" className="block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          View Problems
        </Link>
        <Link to="/editor/1" className="block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Open Editor
        </Link>
        <Link to="/submissions" className="block px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          View Submissions
        </Link>
      </div>
    </div>
  );
}