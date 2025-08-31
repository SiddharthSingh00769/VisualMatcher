import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}api/auth/logout`, { 
        withCredentials: true 
      });
      setIsAuthenticated(false);
      navigate('/auth');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <header className="p-4 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-indigo-500 hover:text-indigo-400 transition">
          Visual Matcher
        </Link>
        <nav>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="cursor-pointer px-4 py-2 rounded-lg bg-red-500 font-semibold text-white transition hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Logout
            </button>
          ) : (
            <Link to="/auth" className="px-4 py-2 rounded-lg bg-indigo-600 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
              Register
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
