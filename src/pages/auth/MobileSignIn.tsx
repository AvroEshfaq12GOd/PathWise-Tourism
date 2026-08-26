import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
export function MobileSignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn('tourist');
    navigate('/app');
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      className="flex-1 flex flex-col bg-white px-6 py-12 overflow-y-auto">
      
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-brand-100 rounded-full animate-pulse opacity-50"></div>
            <MapPin size={32} className="text-brand-600 relative z-10" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
            PathWise
          </h1>
          <p className="text-slate-500 text-sm">
            Travel smarter. Skip the crowds.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="tourist@example.com" />
            
          </div>
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <a href="#" className="text-xs text-brand-600 font-medium">
                Forgot?
              </a>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="••••••••" />
            
          </div>

          <button
            type="submit"
            className="w-full bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-brand-800 transition-colors mt-2">
            
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <p className="text-sm text-slate-600">
            Don't have an account?{' '}
            <Link to="/app/signup" className="text-brand-700 font-bold">
              Sign up
            </Link>
          </p>
          <button
            onClick={() => {
              signIn('tourist');
              navigate('/app');
            }}
            className="text-xs text-slate-400 font-medium hover:text-slate-600 transition-colors">
            
            Continue as guest
          </button>
        </div>
      </div>
    </motion.div>);

}