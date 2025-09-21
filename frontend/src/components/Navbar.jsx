import { Link, useLocation } from "react-router-dom";
import { isLoggedIn } from '../services/auth';

const Navbar = () => {
  const location = useLocation();
  const loggedIn = isLoggedIn();

  const activeClass = (path) =>
    location.pathname === path ? "text-blue-600 font-bold" : "text-gray-700 hover:text-blue-600";

  return (
    <nav className="bg-white shadow p-4 flex flex-wrap justify-between items-center">
      <div className="flex gap-6 flex-wrap">
        <Link to="/" className={activeClass("/")}>Home</Link>
        {loggedIn && <>
          <Link to="/dashboard" className={activeClass("/dashboard")}>Dashboard</Link>
          <Link to="/problems" className={activeClass("/problems")}>Problems</Link>
          <Link to="/editor/1" className={activeClass("/editor/1")}>Editor</Link>
          <Link to="/analytics" className={activeClass("/analytics")}>Analytics</Link>
          <Link to="/submissions" className={activeClass("/submissions")}>Submissions</Link>
        </>}
        {!loggedIn && <>
          <Link to="/login" className={activeClass("/login")}>Login</Link>
          <Link to="/register" className={activeClass("/register")}>Register</Link>
        </>}
      </div>
    </nav>
  );
};

export default Navbar;
