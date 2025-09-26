import { Link, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/auth";

const Navbar = () => {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  const activeClass = (path) =>
    location.pathname === path
      ? "px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white font-semibold shadow-md text-sm"
      : "px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg text-white font-semibold shadow-md hover:from-blue-600 hover:to-indigo-600 transition text-sm";

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg px-6 py-3 flex flex-wrap justify-between items-center">
      {/* Brand */}
      <div className="text-2xl font-extrabold text-white tracking-wide">
        AlgoEngine
      </div>

      {/* Links */}
      <div className="flex gap-3 flex-wrap items-center">
        <Link to="/" className={activeClass("/")}>
          Home
        </Link>
        {loggedIn && (
          <>
            <Link to="/dashboard" className={activeClass("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/problems" className={activeClass("/problems")}>
              Problems
            </Link>
            <Link to="/editor/1" className={activeClass("/editor/1")}>
              Editor
            </Link>
            <Link to="/analytics" className={activeClass("/analytics")}>
              Analytics
            </Link>
            <Link to="/submissions" className={activeClass("/submissions")}>
              Submissions
            </Link>
            <Link to="/visualizer" className={activeClass("/visualizer")}>
              Visualizer
            </Link>
          </>
        )}
        {!loggedIn && (
          <>
            <Link to="/login" className={activeClass("/login")}>
              Login
            </Link>
            <Link to="/register" className={activeClass("/register")}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
