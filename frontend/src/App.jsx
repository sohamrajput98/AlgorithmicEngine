import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import './styles/tailwind.css'

import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import PrivateRoute from './components/PrivateRoute'
import ProblemList from './pages/ProblemList'


function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">AlgoEngine</h1>
      <p className="text-gray-600">Frontend skeleton is working ✅</p>
      <div className="mt-6 space-x-4">
        <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-lg">Login</Link>
        <Link to="/register" className="px-4 py-2 bg-green-500 text-white rounded-lg">Register</Link>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/problems" element={<PrivateRoute><ProblemList /></PrivateRoute>} />
      </Routes>
    </Router>
  )
}