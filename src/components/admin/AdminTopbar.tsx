import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';
export function AdminTopbar() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageName =
  pathParts.length > 1 ?
  pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1) :
  'Overview';
  return (
    <div className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30 font-sans">
      <div>
        <div className="text-xs text-slate-500 font-medium mb-0.5">
          Admin / {pageName}
        </div>
        <h2 className="text-xl font-display font-bold text-slate-900">
          {pageName}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          
          <input
            type="text"
            placeholder="Search sites, incentives..."
            className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all w-64" />
          
        </div>

        <button className="relative text-slate-500 hover:text-slate-700">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </div>);

}