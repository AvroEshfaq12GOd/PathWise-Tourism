import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Smartphone, Monitor } from 'lucide-react';
export function ViewSwitcher() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAdmin = location.pathname.startsWith('/admin');
  // Hide on landing, admin login, and all mobile app routes to avoid overlay clutter
  if (
    location.pathname === '/' ||
    location.pathname === '/admin/login' ||
    location.pathname.startsWith('/app')
  ) {
    return null;
  }
  return (
    <div className="fixed top-4 right-4 z-[100] bg-white rounded-full shadow-lg border border-slate-200 p-1 flex items-center font-sans">
      <button
        onClick={() => navigate('/app')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${!isAdmin ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
        
        <Smartphone size={16} />
        Tourist App
      </button>
      <button
        onClick={() => navigate('/admin')}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${isAdmin ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
        
        <Monitor size={16} />
        Admin Console
      </button>
    </div>);

}