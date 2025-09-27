import { Link, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/auth";
import { motion } from "framer-motion";

const Navbar = () => {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  const navLinks = [
    { to: "/", label: "Home" },
    ...(loggedIn
      ? [
          { to: "/dashboard", label: "Dashboard" },
          { to: "/problems", label: "Problems" },
          { to: "/editor/1", label: "Editor" },
          { to: "/analytics", label: "Analytics" },
          { to: "/submissions", label: "Submissions" },
          { to: "/visualizer", label: "Visualizer" },
        ]
      : [
          { to: "/login", label: "Login" },
          { to: "/register", label: "Register" },
        ]),
  ];

  const normalizePath = (path) => path.replace(/\/+$/, "");

  return (
    <nav className="bg-gray-900 shadow-lg px-6 py-3 flex items-center justify-between">
      <motion.div
        whileHover={{ scale: 1.06 }}
        transition={{ type: "spring", stiffness: 220 }}
        className="text-2xl font-extrabold text-white tracking-wide select-none"
      >
        AlgoEngine
      </motion.div>

      <div className="flex gap-2 items-center flex-nowrap">
        {navLinks.map(({ to, label }) => {
          const isActive = normalizePath(location.pathname) === normalizePath(to);

          return (
            <motion.div key={to} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to={to}
                className={`nav-gradient-button ${isActive ? "nav-gradient-button-variant" : ""}`}
                style={
                  !isActive
                    ? {
                        "--color-1": "#110011",
                        "--color-2": "#0a0240",
                        "--color-3": "#601e50",
                        "--color-4": "#805160",
                        "--color-5": "#994466",
                        "--border-color-1": "hsla(340, 75%, 50%, 0.2)",
                        "--border-color-2": "hsla(340, 75%, 35%, 0.6)",
                      }
                    : {}
                }
              >
                {label}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
};

export default Navbar;
