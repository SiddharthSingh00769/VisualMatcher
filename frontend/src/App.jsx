import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage.jsx';
import HomePage from './pages/HomePage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import Header from './components/Header.jsx';
import axios from 'axios';
import './index.css';
import ProductDetailPage from './pages/ProductDetailPage.jsx';
import AddProductPage from './pages/AddProductPage.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
          withCredentials: true, 
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
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-inter text-gray-800 antialiased flex-col">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent border-solid rounded-full animate-spin mb-6"></div>
        <h1 className="text-center text-xl md:text-2xl font-medium">
          Loading...Please wait for about 2 min, the backend is processing your request(render takes time to start the backend)
        </h1>
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
        <Route path="/add-product" element={isAuthenticated ? <AddProductPage /> : <AuthPage onAuthSuccess={handleAuthSuccess} />} />
      </Routes>
    </div>
  );
};

export default App;
