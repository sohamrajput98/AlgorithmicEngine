import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import './styles/tailwind.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProblemList from './pages/ProblemList';
import ProblemView from './pages/ProblemView';
import Editor from './pages/Editor';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Submissions from './pages/Submissions';
import Analytics from "./pages/Analytics";
import Home from './pages/Home'; 
import Visualizer from "./pages/Visualizer";

export default function App() {
  return (
    <>
      <Navbar /> {/* ✅ persistent navigation bar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/problems" element={
          <PrivateRoute><ProblemList /></PrivateRoute>
        } />
        <Route path="/problems/:id" element={
          <PrivateRoute><ProblemView /></PrivateRoute>
        } />
        <Route path="/editor/:id" element={
          <PrivateRoute><Editor /></PrivateRoute>
        } />
        <Route path="/submissions" element={
          <PrivateRoute><Submissions /></PrivateRoute>
        } />
        <Route path="/analytics" element={
          <PrivateRoute><Analytics /></PrivateRoute>
        } />
        <Route path="/visualizer" element={
          <PrivateRoute><Visualizer /></PrivateRoute>
        } />

        <Route path="*" element={<div className="p-6 text-red-600">404: Page Not Found</div>} />
      </Routes>
    </>
  );
}
