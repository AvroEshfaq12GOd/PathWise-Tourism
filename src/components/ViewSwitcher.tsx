import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Monitor } from 'lucide-react';

export function ViewSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();

  // Check if current route is a signing / auth / landing page
  const isSigningPage =
    location.pathname === '/admin/login' ||
    location.pathname === '/app/signin' ||
    location.pathname === '/app/signup' ||
    location.pathname === '/' ||
    location.pathname.includes('login') ||
    location.pathname.includes('signin') ||
    location.pathname.includes('signup');

  const isAdmin = location.pathname.startsWith('/admin');

  // Do NOT render the switcher on any signing / auth page or outside admin
  if (isSigningPage || !isAdmin) {
    return null;
  }

  return (
    <div className="fixed top-3 right-4 sm:right-6 z-[100] bg-white/95 backdrop-blur-md rounded-full shadow-lg border border-slate-200/90 p-1 flex items-center font-sans">
      <button
        onClick={() => navigate('/app')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          !isAdmin
            ? 'bg-slate-900 text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <Smartphone size={13} strokeWidth={2.5} />
        <span>Tourist App</span>
      </button>
      <button
        onClick={() => navigate('/admin')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
          isAdmin
            ? 'bg-[#0D6E6E] text-white shadow-sm'
            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        <Monitor size={13} strokeWidth={2.5} />
        <span>Admin Console</span>
      </button>
    </div>
  );
}

