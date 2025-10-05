import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { isLoggedIn } from "../services/auth";

// --- Responsive check without useEffect ---
const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

// --- UI Components ---
const AnimatedMenuToggle = ({ isOpen, onClick }) => (
  <motion.button
    onClick={onClick}
    className={`gradient-button px-4 py-2 rounded-full ml-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 border ${
  isOpen ? "border-glow-active" : "border-transparent"
}`}
    whileTap={{ scale: 0.95 }}
    aria-expanded={isOpen}
  >
    <motion.span
      className="text-white text-lg font-bold"
      animate={{ rotate: isOpen ? 45 : 0 }}
      transition={{ duration: 0.2 }}
    >
      ☰
    </motion.span>
  </motion.button>
);

const DesktopNavMenu = ({ navLinks, isActive, handleLinkClick }) => (
  <AnimatePresence>
    <motion.div
      layoutId="nav-capsule"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 24 }}
className="absolute right-full top-0 h-full flex items-center mr-3 bg-black/50 backdrop-blur-lg border border-slate-700/50 rounded-full shadow-lg px-3 py-2"     style={{ pointerEvents: "auto" }}
    >
      <motion.ul
       className="flex flex-row items-center gap-2 px-4 flex-nowrap"
        initial="closed"
        animate="open"
        exit="closed"
        variants={{
          open: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
          closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
        }}
      >
        {navLinks.map(({ to, label }) => (
          <motion.li key={to} variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: 20 } }}>
            <Link
              to={to}
              onClick={handleLinkClick}
              className={`nav-gradient-button text-sm px-4 py-2 rounded-full select-none ${
                isActive(to) ? "nav-gradient-button-variant" : ""
              }`}
              aria-current={isActive(to) ? "page" : undefined}
            >
              {label}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  </AnimatePresence>
);

const MobileNavMenu = ({ navLinks, isActive, handleLinkClick }) => (
  <AnimatePresence>
    <motion.div
      initial="closed"
      animate="open"
      exit="closed"
      variants={{
        open: { opacity: 1, y: 0 },
        closed: { opacity: 0, y: "-100%" },
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 w-full h-full pt-24 bg-black/80 backdrop-blur-xl z-40"
    >
      <motion.ul
        initial="closed"
        animate="open"
        exit="closed"
        variants={{
          open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } },
          closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
        }}
        className="flex flex-col items-center gap-6"
      >
        {navLinks.map(({ to, label }) => (
          <motion.li key={to} variants={{ open: { y: 0, opacity: 1 }, closed: { y: 50, opacity: 0 } }} className="w-full text-center">
            <Link
              to={to}
              onClick={handleLinkClick}
              className={`text-2xl font-bold ${isActive(to) ? "text-white" : "text-slate-400"}`}
              aria-current={isActive(to) ? "page" : undefined}
            >
              {label}
            </Link>
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  </AnimatePresence>
);

// --- Main Component ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const loggedIn = isLoggedIn();

  const navLinks = [
    { to: "/", label: "Home" },
    ...(loggedIn
      ? [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/problems", label: "Problems" },
          { to: "/quizzes", label: "Quizzes" },
          { to: "/analytics", label: "Analytics" },
          { to: "/submissions", label: "Submissions" },
          { to: "/visualizer", label: "Visualizer" },
        ]
      : [
          { to: "/login", label: "Login" },
          { to: "/register", label: "Register" },
        ]),
  ];

  const normalizePath = (path) => path.replace(/\/+$/, "") || "/";
  const isActive = (path) => normalizePath(location.pathname) === normalizePath(path);
  const handleLinkClick = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className="bg-black/30 backdrop-blur-md border-b border-gray-800 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" onClick={handleLinkClick} className="z-50">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-500 text-transparent bg-clip-text"
          >
            AlgoEngine
          </motion.div>
        </Link>
        <div className="relative flex items-center">
          <AnimatedMenuToggle isOpen={isOpen} onClick={toggleMenu} />
          {isOpen && (isDesktop() ? <DesktopNavMenu {...{ navLinks, isActive, handleLinkClick }} /> : <MobileNavMenu {...{ navLinks, isActive, handleLinkClick }} />)}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;