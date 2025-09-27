import React from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar"; // ✅ correct relative path to Navbar.jsx

export default function AppLayout({ children }) {
  const { pathname } = useLocation();
  const showNavbar = pathname !== "/"; // hide navbar on Home

  return (
    <div className="relative w-full min-h-screen bg-gray-900 text-gray-100">
      {showNavbar && <Navbar />}
      {children}
    </div>
  );
  
}