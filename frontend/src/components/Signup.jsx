import React, { useState } from 'react';
import { signup } from '../services/api';

const Signup = ({ onSignupSuccess, onToggleLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signup(username, password);
      alert("Account created successfully! Now you can login.");
      onSignupSuccess(); 
    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed. Username might be taken.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-pink-100 animate-pop">
        <h2 className="text-2xl font-bold text-pink-600 mb-6 text-center">Join NeuralNotes</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Choose Username" 
            className="w-full p-3 border border-pink-100 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none transition-all"
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required
          />
          <input 
            type="password" 
            placeholder="Choose Password" 
            className="w-full p-3 border border-pink-100 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none transition-all"
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full text-white p-3 rounded-lg font-semibold transition-colors shadow-md active:scale-95 
              ${loading ? 'bg-pink-300 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600'}`}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <button 
            onClick={onToggleLogin} 
            className="text-pink-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;