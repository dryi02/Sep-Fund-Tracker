import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/login`, {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await response.json();
      console.log(data);

      if (response.ok) {
        if (data.role === 'admin') {
          navigate('/admin-dashboard');
        } else if (data.role === 'pledge') {
          navigate('/pledge-dashboard');
        }
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F5]">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-lg">
        <div className="flex justify-center mb-6">
          <img src="/SEP_blackLogo.svg" alt="Sigma Eta Pi Logo" className="h-24" />
        </div>
        <h2 className="text-2xl font-bold text-center text-[#001F54] mb-6">
          Welcome to Sigma Eta Pi Progress Tracker
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#001F54] focus:border-[#001F54]"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-[#001F54] focus:border-[#001F54]"
            />
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-[#FF5252]">
              <AlertCircle size={16} />
              <p className="text-sm">{error}</p>
            </div>
          )}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-[#001F54] rounded-md hover:bg-[#001F54]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#001F54]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
