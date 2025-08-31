import { useState } from 'react';
import axios from 'axios';

const AuthForm = ({ isLogin, onAuthSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const endpoint = isLogin ? 'login' : 'register';
    const url = `${import.meta.env.VITE_BACKEND_URL}/api/auth/${endpoint}`;

    try {
      const response = await axios.post(url, formData, {
        withCredentials: true, // This is crucial for sending cookies
      });

      if (response.status === 200 || response.status === 201) {
        setMessage(isLogin ? `Welcome back, ${response.data.username}!` : `Account created for ${response.data.username}!`);
        setFormData({ username: '', email: '', password: '' });
        onAuthSuccess(); 
      }
    } catch (error) {
      if (error.response) {
        setMessage(error.response.data.message || 'Something went wrong.');
      } else if (error.request) {
        setMessage('No response from server. Please try again.');
      } else {
        setMessage('Network error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isLogin && (
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="w-full rounded-lg border-2 border-gray-300 p-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
          value={formData.username}
          onChange={handleChange}
          required={!isLogin}
        />
      )}
      <input
        type="email"
        name="email"
        placeholder="Email Address"
        className="w-full rounded-lg border-2 border-gray-300 p-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="w-full rounded-lg border-2 border-gray-300 p-3 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
        value={formData.password}
        onChange={handleChange}
        required
      />
      
      <button
        type="submit"
        className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
        disabled={loading}
      >
        {loading ? (
          isLogin ? 'Signing In...' : 'Signing Up...'
        ) : (
          isLogin ? 'Sign In' : 'Sign Up'
        )}
      </button>

      {message && (
        <div className={`mt-4 rounded-lg p-3 text-center ${message.includes('Welcome') || message.includes('created') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message}
        </div>
      )}
    </form>
  );
};

export default AuthForm;
