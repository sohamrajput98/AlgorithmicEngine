import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function NavbarHome() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/problems", label: "Problems" },
    { to: "/analytics", label: "Analytics" },
    { to: "/visualizer", label: "Visualizer" },
    { to: "/login", label: "Login" },
  ];

  const normalizePath = (path) => path.replace(/\/+$/, "") || "/";
  const isActive = (path) => normalizePath(location.pathname) === normalizePath(path);
  const handleLinkClick = () => setOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-black/30 backdrop-blur-md border-b border-gray-800 px-6 py-3">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between">
        <Link to="/" onClick={handleLinkClick} className="z-50">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ type: "spring", stiffness: 220 }}
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 text-transparent bg-clip-text"
          >
            AlgoEngine
          </motion.div>
        </Link>

        <div className="relative flex items-center">
          <AnimatePresence>
            {open && (
              <motion.div
                layoutId="nav-capsule"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                className="absolute right-full mr-3 top-0 h-full flex gap-2 items-center bg-black/60 backdrop-blur-lg border border-gray-700 rounded-full px-3 py-2 shadow-md"
                style={{ pointerEvents: open ? "auto" : "none" }}
              >
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    onClick={handleLinkClick}
                    className={`nav-gradient-button text-sm px-4 py-2 rounded-full select-none ${
                      isActive(to)
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                        : "text-gray-200"
                    }`}
                    aria-current={isActive(to) ? "page" : undefined}
                  >
                    {label}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            onClick={() => setOpen((s) => !s)}
            aria-expanded={open}
            aria-haspopup="true"
            className="gradient-button px-4 py-2 rounded-full ml-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <motion.span
              className="inline-block text-white font-bold"
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ☰
            </motion.span>
          </motion.button>
        </div>
      </div>
    </nav>
  );
}