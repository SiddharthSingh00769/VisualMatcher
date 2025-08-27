import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout');
      setIsAuthenticated(false);
      navigate('/auth'); // Redirect to the auth page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-md md:px-10">
      <div className="text-xl font-bold text-indigo-600 md:text-2xl">
        <Link to="/">Visual Matcher</Link>
      </div>
      <nav>
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 md:text-base"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/auth"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 md:text-base"
          >
            Sign In / Register
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
