import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { getToken, logout } from '../services/auth';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

 useEffect(() => {
  const fetchUser = async () => {
    console.log("Using token:", getToken())
    console.log("Fetching user with token:", getToken())
    try {
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${getToken()}` }
      })
      console.log("User fetched:", res.data)
      setUser(res.data)
    } catch (err) {
      console.error("Fetch failed:", err)
      logout()
      navigate('/login')
    }
  }
  fetchUser()
}, [])

if (!user) return <div>Loading user info...</div>
  return (
    <div className="p-8">
      <h1 className="text-3xl mb-4">Dashboard</h1>
      {user && (
        <div className="bg-white p-4 rounded shadow w-96">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Display Name:</strong> {user.display_name}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Status:</strong> {user.is_active ? 'Active' : 'Inactive'}</p>
          <button onClick={() => { logout(); navigate('/login'); }} 
                  className="mt-4 bg-red-600 text-white p-2 rounded">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
