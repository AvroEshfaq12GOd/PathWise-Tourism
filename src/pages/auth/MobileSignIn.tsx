import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileSignIn() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateEmail = (val: string): string | undefined => {
    if (!val.trim()) {
      return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) {
      return 'Please enter a valid email address (e.g. traveler@domain.com).';
    }
    return undefined;
  };

  const validatePassword = (val: string): string | undefined => {
    if (!val) {
      return 'Password is required.';
    }
    if (val.length < 6) {
      return 'Password must be at least 6 characters.';
    }
    return undefined;
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      const err = validateEmail(email);
      setErrors((prev) => ({ ...prev, email: err }));
    } else if (field === 'password') {
      const err = validatePassword(password);
      setErrors((prev) => ({ ...prev, password: err }));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (touched.email || errors.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(val), general: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (touched.password || errors.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(val), general: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mark all touched
    setTouched({ email: true, password: true });

    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({
        email: emailErr,
        password: passErr,
        general: 'Please resolve the highlighted validation errors.'
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate smooth login transition
    setTimeout(() => {
      signIn('tourist');
      setIsSubmitting(false);
      navigate('/app');
    }, 450);
  };

  const isEmailValid = touched.email && !errors.email && email.trim().length > 0;
  const isPasswordValid = touched.password && !errors.password && password.length >= 6;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col bg-white px-6 py-8 overflow-y-auto"
    >
      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#0D6E6E]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 relative shadow-sm border border-[#0D6E6E]/20">
            <MapPin size={30} className="text-[#0D6E6E] relative z-10" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">
            PathWise
          </h1>
          <p className="text-slate-500 text-xs">
            Smart crowd-free travel across Sri Lanka
          </p>
        </div>

        {/* Global Error Banner */}
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
          {/* Email Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="signin-email" className="block text-xs font-semibold text-slate-700">
                Email Address <span className="text-red-500">*</span>
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
                id="signin-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                aria-invalid={!!errors.email}
                className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all ${
                  errors.email
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400/40'
                    : isEmailValid
                    ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-200 focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]'
                }`}
                placeholder="tourist@example.com"
                disabled={isSubmitting}
              />
            </div>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
              >
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.email}</span>
              </motion.p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="signin-password" className="block text-xs font-semibold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('Demo mode: enter any password with 6+ characters.'); }} className="text-xs text-[#0D6E6E] font-semibold hover:underline">
                Forgot?
              </a>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                id="signin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur('password')}
                aria-invalid={!!errors.password}
                className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-3 text-sm outline-none transition-all ${
                  errors.password
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400/40'
                    : isPasswordValid
                    ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-200 focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]'
                }`}
                placeholder="Minimum 6 characters"
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-1.5 text-xs text-red-600 flex items-center gap-1 font-medium"
              >
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.password}</span>
              </motion.p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#0D6E6E] text-white font-bold py-3.5 rounded-xl shadow-md hover:bg-[#095454] active:scale-[0.99] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Fill Helper */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Need demo credentials?</span>
          <button
            type="button"
            onClick={() => {
              setEmail('tourist@pathwise.io');
              setPassword('travel123');
              setTouched({ email: true, password: true });
              setErrors({});
            }}
            className="text-xs font-semibold text-[#0D6E6E] hover:underline"
          >
            Auto-fill demo
          </button>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/app/signup" className="text-[#0D6E6E] font-bold hover:underline">
              Create an account
            </Link>
          </p>
          <div>
            <button
              type="button"
              onClick={() => {
                signIn('tourist');
                navigate('/app');
              }}
              className="text-xs text-slate-400 font-semibold hover:text-slate-600 transition-colors inline-flex items-center gap-1"
            >
              <span>Continue as guest explorer</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
