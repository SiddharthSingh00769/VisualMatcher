import React, { useState } from 'react';
import AuthForm from '../components/AuthForm.jsx';

const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-inter text-gray-800 antialiased">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-2xl md:p-10">
        <header className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-indigo-700 md:text-4xl">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            {isLogin ? 'Welcome back! Please sign in.' : 'Create a new account.'}
          </p>
        </header>
        
        <AuthForm isLogin={isLogin} onAuthSuccess={onAuthSuccess} />
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="font-medium text-indigo-600 transition hover:text-indigo-700 focus:outline-none"
          >
            {isLogin ? 'Don\'t have an account? Sign Up' : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
