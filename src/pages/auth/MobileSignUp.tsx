import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export function MobileSignUp() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const interests = [
  'History',
  'Nature',
  'Food',
  'Adventure',
  'Culture',
  'Relaxation'];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
    prev.includes(interest) ?
    prev.filter((i) => i !== interest) :
    [...prev, interest]
    );
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn('tourist');
    navigate('/app');
  };
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      className="flex-1 flex flex-col bg-white px-6 py-8 overflow-y-auto">
      
      <div className="max-w-sm mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-2">
            Create Account
          </h1>
          <p className="text-slate-500 text-sm">
            Join PathWise to get personalized, crowd-free travel routes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="Jane Doe" />
            
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="jane@example.com" />
            
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
              placeholder="••••••••" />
            
          </div>

          <div className="pt-2">
            <label className="block text-sm font-medium text-slate-700 mb-3">
              What are your travel interests?
            </label>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest) =>
              <button
                key={interest}
                type="button"
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors border ${selectedInterests.includes(interest) ? 'bg-brand-700 text-white border-brand-700' : 'bg-white text-slate-600 border-slate-200 hover:border-brand-300'}`}>
                
                  {interest}
                </button>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-700 text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-brand-800 transition-colors mt-6">
            
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600">
            Already have an account?{' '}
            <Link to="/app/signin" className="text-brand-700 font-bold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>);

}