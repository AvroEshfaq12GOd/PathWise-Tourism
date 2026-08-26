import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
export function AdminLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn('admin');
    navigate('/admin');
  };
  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* Left Form Side */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24 relative">
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors">
          
          <ArrowLeft size={16} /> Back to homepage
        </Link>

        <div className="max-w-md w-full mx-auto">
          <div className="mb-10">
            <div className="w-12 h-12 bg-brand-50 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={24} className="text-brand-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
              Admin Console
            </h1>
            <p className="text-slate-500">
              Sign in to manage sites, thresholds, and AI models.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="admin@pathwise.io" />
              
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                placeholder="••••••••" />
              
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded text-brand-600 focus:ring-brand-500" />
                
                Remember me
              </label>
              <a
                href="#"
                className="text-sm text-brand-700 font-medium hover:underline">
                
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg shadow-sm hover:bg-slate-800 transition-colors mt-4">
              
              Sign In
            </button>
          </form>

          <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-500 text-center">
            <strong>Demo credentials:</strong> admin@pathwise.io / any password
          </div>
        </div>
      </div>

      {/* Right Brand Side */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-brand-800 to-brand-950 relative overflow-hidden items-center justify-center p-12">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/20 rounded-full blur-3xl -mr-96 -mt-96 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-600/20 rounded-full blur-3xl -ml-64 -mb-64 pointer-events-none"></div>

        <div className="relative z-10 max-w-lg text-center">
          <h2 className="text-4xl font-display font-bold text-white mb-6">
            PathWise
          </h2>
          <p className="text-brand-100 text-lg leading-relaxed">
            Tourism Operations Console. Monitor real-time congestion, configure
            behavioral nudges, and evaluate LSTM prediction accuracy.
          </p>
        </div>
      </div>
    </div>);

}