// File: frontend/src/components/Header.jsx
// Description: The header component for consistent navigation across pages.

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/checkAuth`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Authentication check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsAuthReady(true);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, {}, {
        withCredentials: true,
      });
      setIsAuthenticated(false);
      navigate('/');
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  if (!isAuthReady) {
    return null; // Don't render anything until auth status is known
  }

  return (
    <header className="bg-gray-900 text-gray-100 shadow-md">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-indigo-400">
          Visual Matcher
        </Link>
        <nav>
          {isAuthenticated ? (
            <div className="flex space-x-4 items-center">
              <Link to="/products" className="text-lg font-medium hover:text-indigo-400 transition-colors">
                Products
              </Link>
              <Link to="/add-product" className="text-lg font-medium hover:text-indigo-400 transition-colors">
                Add Product
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity50"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link
                to="/auth"
                className="rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Sign In / Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
