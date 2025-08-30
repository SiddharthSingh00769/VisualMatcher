import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import Header from './components/Header.jsx';
import axios from 'axios';
import './index.css';
import ProductDetailPage from './pages/ProductDetailPage.jsx';

const App = () => {
  // State to determine if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // State to track if the authentication check is complete
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigate('/products'); 
  };

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/checkAuth', {
          withCredentials: true, // This is crucial for sending the cookie
        });
        
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsAuthReady(true);
      }
    };

    checkAuthStatus();
  }, []);

  if (!isAuthReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-inter text-gray-800 antialiased">
        <h1 className="text-3xl font-bold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage onAuthSuccess={handleAuthSuccess} />} />
         <Route path="/products/:id" element={isAuthenticated ? <ProductDetailPage /> : <AuthPage onAuthSuccess={handleAuthSuccess} />} />
        <Route path="/products" element={isAuthenticated ? <ProductsPage /> : <AuthPage onAuthSuccess={handleAuthSuccess} />} />
      </Routes>
    </div>
  );
};

export default App;
