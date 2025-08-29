import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-900 to-slate-900 p-4 font-inter text-white antialiased relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 opacity-90 animate-pulse-slow"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center p-6 md:p-10 bg-gray-900 bg-opacity-70 rounded-3xl shadow-2xl max-w-2xl mx-auto animate-fadeInUp">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-indigo-400 animate-slideInLeft">
          Visual Matcher
        </h1>
        <p className="text-xl md:text-2xl font-light mb-8 text-gray-300 animate-slideInRight">
          Unlock the power of sight. Instantly find and explore similar products from a vast catalog, powered by cutting-edge AI.
        </p>
        <Link 
          to="/auth" 
          className="inline-block px-10 py-5 bg-indigo-600 text-white font-bold text-lg rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 animate-zoomIn"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
