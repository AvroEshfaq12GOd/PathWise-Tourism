import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, ArrowRight, Loader2, Compass } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function MobileSignUp() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Nature', 'Culture']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const interests = [
    'Cultural Heritage',
    'Wildlife & Safaris',
    'Beaches & Surfing',
    'Highland Treks',
    'Culinary & Street Food',
    'Waterfalls & Nature'
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: undefined }));
    }
  };

  const validateFullName = (val: string): string | undefined => {
    if (!val.trim()) return 'Full name is required.';
    if (val.trim().length < 2) return 'Full name must be at least 2 characters.';
    return undefined;
  };

  const validateEmail = (val: string): string | undefined => {
    if (!val.trim()) return 'Email address is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val.trim())) return 'Please enter a valid email address.';
    return undefined;
  };

  const validatePassword = (val: string): string | undefined => {
    if (!val) return 'Password is required.';
    if (val.length < 6) return 'Password must be at least 6 characters.';
    return undefined;
  };

  const validateConfirmPassword = (val: string, passVal: string): string | undefined => {
    if (!val) return 'Please confirm your password.';
    if (val !== passVal) return 'Passwords do not match.';
    return undefined;
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: '' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-red-500' };
    if (score <= 2) return { score: 2, label: 'Fair', color: 'bg-amber-500' };
    if (score <= 3) return { score: 3, label: 'Good', color: 'bg-blue-500' };
    return { score: 4, label: 'Strong', color: 'bg-emerald-500' };
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'fullName') setErrors((prev) => ({ ...prev, fullName: validateFullName(fullName) }));
    if (field === 'email') setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    if (field === 'password') setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    if (field === 'confirmPassword') setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword, password) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
      interests: true,
      agreeTerms: true
    });

    const nameErr = validateFullName(fullName);
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);
    const confirmErr = validateConfirmPassword(confirmPassword, password);
    const interestErr = selectedInterests.length === 0 ? 'Please select at least 1 interest.' : undefined;
    const termsErr = !agreeTerms ? 'You must accept the terms of service.' : undefined;

    if (nameErr || emailErr || passErr || confirmErr || interestErr || termsErr) {
      setErrors({
        fullName: nameErr,
        email: emailErr,
        password: passErr,
        confirmPassword: confirmErr,
        interests: interestErr,
        agreeTerms: termsErr,
        general: 'Please correct the highlighted issues before creating your account.'
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      signIn('tourist');
      setIsSubmitting(false);
      navigate('/app');
    }, 500);
  };

  const strength = getPasswordStrength(password);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-1 flex flex-col bg-white px-6 py-8 overflow-y-auto"
    >
      <div className="max-w-sm mx-auto w-full">
        <div className="mb-6">
          <div className="w-12 h-12 bg-[#0D6E6E]/10 rounded-2xl flex items-center justify-center mb-3 border border-[#0D6E6E]/20">
            <Compass size={24} className="text-[#0D6E6E]" />
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 mb-1">
            Create Account
          </h1>
          <p className="text-slate-500 text-xs leading-relaxed">
            Join PathWise for real-time crowd avoidance, personalized circuits & PathPoints.
          </p>
        </div>

        {/* Global Error Banner */}
        <AnimatePresence>
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2"
              role="alert"
            >
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{errors.general}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User size={16} />
              </div>
              <input
                id="signup-name"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (touched.fullName) setErrors((prev) => ({ ...prev, fullName: validateFullName(e.target.value) }));
                }}
                onBlur={() => handleBlur('fullName')}
                aria-invalid={!!errors.fullName}
                className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all ${
                  errors.fullName
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400/40'
                    : touched.fullName && !errors.fullName
                    ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-200 focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]'
                }`}
                placeholder="Jane Doe"
                disabled={isSubmitting}
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.fullName}</span>
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail size={16} />
              </div>
              <input
                id="signup-email"
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
                    : touched.email && !errors.email
                    ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-200 focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]'
                }`}
                placeholder="jane@example.com"
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
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-700">
                Password <span className="text-red-500">*</span>
              </label>
              {password && (
                <span className="text-[11px] font-bold text-slate-500">
                  Strength: <span className={strength.score >= 3 ? 'text-emerald-600' : 'text-amber-600'}>{strength.label}</span>
                </span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }));
                  if (touched.confirmPassword && confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(confirmPassword, e.target.value) }));
                  }
                }}
                onBlur={() => handleBlur('password')}
                aria-invalid={!!errors.password}
                className={`w-full bg-slate-50 border rounded-xl pl-10 pr-10 py-2.5 text-sm outline-none transition-all ${
                  errors.password
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400/40'
                    : touched.password && !errors.password
                    ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-200 focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]'
                }`}
                placeholder="Minimum 6 characters"
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
            {/* Strength Meter Bar */}
            {password.length > 0 && (
              <div className="mt-1.5 flex gap-1 h-1">
                {[1, 2, 3, 4].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 rounded-full transition-all duration-300 ${
                      step <= strength.score ? strength.color : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>
            )}
            {errors.password && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="signup-confirm" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock size={16} />
              </div>
              <input
                id="signup-confirm"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (touched.confirmPassword) {
                    setErrors((prev) => ({ ...prev, confirmPassword: validateConfirmPassword(e.target.value, password) }));
                  }
                }}
                onBlur={() => handleBlur('confirmPassword')}
                aria-invalid={!!errors.confirmPassword}
                className={`w-full bg-slate-50 border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none transition-all ${
                  errors.confirmPassword
                    ? 'border-red-400 bg-red-50/40 text-red-900 focus:ring-2 focus:ring-red-400/40'
                    : touched.confirmPassword && !errors.confirmPassword
                    ? 'border-emerald-400 focus:ring-2 focus:ring-emerald-500/20'
                    : 'border-slate-200 focus:ring-2 focus:ring-[#0D6E6E]/20 focus:border-[#0D6E6E]'
                }`}
                placeholder="Re-enter password"
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.confirmPassword}</span>
              </p>
            )}
          </div>

          {/* Travel Interests Selection */}
          <div className="pt-1">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700">
                Travel Interests <span className="text-slate-400 font-normal">(Select at least 1)</span>
              </label>
              <span className="text-[10px] text-slate-400 font-bold">
                {selectedInterests.length} chosen
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {interests.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-[#0D6E6E] text-white border-[#0D6E6E] shadow-xs'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#0D6E6E]/40 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && <span className="mr-1">✓</span>}
                    {interest}
                  </button>
                );
              })}
            </div>
            {errors.interests && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.interests}</span>
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="pt-2">
            <label className="flex items-start gap-2.5 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  if (errors.agreeTerms && e.target.checked) {
                    setErrors((prev) => ({ ...prev, agreeTerms: undefined }));
                  }
                }}
                className="mt-0.5 rounded text-[#0D6E6E] focus:ring-[#0D6E6E]"
              />
              <span>
                I agree to the <span className="text-[#0D6E6E] font-semibold underline">Terms of Service</span> & <span className="text-[#0D6E6E] font-semibold underline">Privacy Policy</span>.
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1 font-medium">
                <AlertCircle size={12} className="shrink-0" />
                <span>{errors.agreeTerms}</span>
              </p>
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
                <span>Creating your account...</span>
              </>
            ) : (
              <>
                <span>Create Free Account</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-600">
            Already have an account?{' '}
            <Link to="/app/signin" className="text-[#0D6E6E] font-bold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
