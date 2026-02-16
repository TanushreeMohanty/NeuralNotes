import React, { useState } from 'react';
import { login } from '../api';

const Login = ({ onLoginSuccess, onToggleSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      // Updated to pass the username string back to App.jsx
      onLoginSuccess(username); 
    } catch (err) {
      alert("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-pink-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to NeuralNotes</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Username" 
            className="w-full p-3 border border-pink-100 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none transition-all"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border border-pink-100 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none transition-all"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button 
            type="submit" 
            className="w-full bg-pink-500 text-white p-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors shadow-md active:scale-95"
          >
            Sign In
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <button 
            type="button"
            onClick={onToggleSignup} 
            className="text-pink-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;