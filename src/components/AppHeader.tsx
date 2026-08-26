import React from 'react';
import { Bell } from 'lucide-react';
export function AppHeader({
  title,
  subtitle



}: {title: string;subtitle?: string;}) {
  return (
    <div className="px-5 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
      <div>
        {subtitle &&
        <p className="text-xs text-slate-500 font-medium mb-0.5">
            {subtitle}
          </p>
        }
        <h1 className="text-xl font-display font-bold text-slate-900">
          {title}
        </h1>
      </div>
      <button className="relative p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
        <Bell size={18} />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </button>
    </div>);

}