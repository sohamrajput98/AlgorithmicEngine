// src/components/Navbar.jsx
import { Link } from 'react-router-dom'

const Navbar = () => (
  <nav className="p-4 bg-gray-100 flex gap-6 text-sm font-medium">
    <Link to="/" className="text-blue-600 hover:underline">Home</Link>
    <Link to="/problems" className="text-blue-600 hover:underline">Problems</Link>
    <Link to="/editor/2" className="text-blue-600 hover:underline">Editor</Link>
    <Link to="/dashboard" className="text-blue-600 hover:underline">Dashboard</Link>
  </nav>
)

export default Navbar