import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

export function AdminLogin() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateEmail = (val: string): string | undefined => {
    if (!val.trim()) return 'Admin email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return 'Please enter a valid administrative email.';
    return undefined;
  };

  const validatePassword = (val: string): string | undefined => {
    if (!val) return 'Security password is required.';
    if (val.length < 6) return 'Password must be at least 6 characters.';
    return undefined;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    if (field === 'password') setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({
        email: emailErr,
        password: passErr,
        general: 'Please resolve validation errors before logging into the operations console.'
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      signIn('admin');
      setIsSubmitting(false);
      navigate('/admin');
    }, 500);
  };

  const isEmailValid = touched.email && !errors.email && email.trim().length > 0;
  const isPasswordValid = touched.password && !errors.password && password.length >= 6;

  return (
    <div className="min-h-screen flex font-sans bg-slate-900 lg:bg-white">
      {/* Left Form Side */}
      <div className="flex-1 flex flex-col justify-center px-6 sm:px-14 lg:px-20 relative bg-white min-h-screen py-12">
        <Link
          to="/"
          className="absolute top-6 left-6 sm:left-12 flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft size={14} /> Back to homepage
        </Link>

        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-[#0D6E6E]/10 rounded-2xl flex items-center justify-center mb-5 border border-[#0D6E6E]/20">
              <ShieldCheck size={26} className="text-[#0D6E6E]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-1.5">
              Admin Operations Console
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Authenticate to manage capacity limits, dispatch alerts, and configure crowd simulations.
            </p>
          </div>

          {/* Global Alert */}
          <AnimatePresence>
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
                role="alert"
              >
                <AlertCircle size={15} className="shrink-0 text-red-500" />
                <span>{errors.general}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Admin Email */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="admin-email" className="block text-xs font-semibold text-slate-700">
                  Admin Email <span className="text-red-500">*</span>
                </label>
                {isEmailValid && (
                  <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 size={12} /> Valid
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (touched.email) setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                  }}
                  onBlur={() => handleBlur('email')}
                  aria-invalid={!!errors.email}
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all ${
                    errors.email
                      ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400/40'
                      : isEmailValid
                      ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-200 focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]'
                  }`}
                  placeholder="admin@pathwise.io"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.email}</span>
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="admin-password" className="block text-xs font-semibold text-slate-700">
                  Security Password <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">Min 6 chars</span>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (touched.password) setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }));
                  }}
                  onBlur={() => handleBlur('password')}
                  aria-invalid={!!errors.password}
                  className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none transition-all ${
                    errors.password
                      ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400/40'
                      : isPasswordValid
                      ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                      : 'border-slate-200 focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]'
                  }`}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} className="shrink-0" />
                  <span>{errors.password}</span>
                </p>
              )}
            </div>

            {/* Remember me & Helper */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#0D6E6E] focus:ring-[#0D6E6E]"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setEmail('admin@pathwise.io');
                  setPassword('admin2026');
                  setTouched({ email: true, password: true });
                  setErrors({});
                }}
                className="text-xs text-[#0D6E6E] font-semibold hover:underline"
              >
                Auto-fill demo login
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl shadow-md active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin text-amber-300" />
                  <span>Verifying authorization...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Admin Console</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span className="font-medium">Demo Administrator:</span>
            <code className="bg-slate-200/80 px-2 py-0.5 rounded text-slate-800 font-mono text-[11px]">
              admin@pathwise.io / admin2026
            </code>
          </div>
        </div>
      </div>

      {/* Right Brand Side */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-[#063838] via-[#0D6E6E] to-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-md text-white text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold backdrop-blur-sm text-emerald-300">
            <ShieldCheck size={14} /> Real-Time Intelligence & Operations
          </div>
          <h2 className="text-3xl font-display font-bold">
            Sri Lanka Tourism Dispersal Command
          </h2>
          <p className="text-slate-200 text-sm leading-relaxed">
            Monitor sensor telemetry across 35+ national landmarks, dispatch automated crowd diversion nudges, and forecast carrying capacity thresholds.
          </p>
        </div>
      </div>
    </div>
  );
}
