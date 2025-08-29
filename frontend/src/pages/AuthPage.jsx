import React, { useState } from 'react';
import AuthForm from '../components/AuthForm.jsx';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-900 to-slate-900 p-4 font-inter text-white antialiased relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 opacity-90 animate-pulse-slow"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md rounded-3xl bg-gray-900 bg-opacity-70 p-8 shadow-2xl md:p-10 animate-fadeInUp">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-indigo-400 md:text-4xl animate-slideInLeft">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="mt-2 text-sm text-gray-400 animate-slideInRight">
            {isLogin ? 'Welcome back! Please sign in.' : 'Create a new account.'}
          </p>
        </header>

        <AuthForm isLogin={isLogin} onAuthSuccess={onAuthSuccess} />

        <div className="mt-6 text-center text-sm text-gray-400">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-400 transition hover:text-indigo-500 focus:outline-none cursor-pointer"
          >
            {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
