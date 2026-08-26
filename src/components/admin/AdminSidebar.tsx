import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  SlidersHorizontal,
  BrainCircuit,
  Gift,
  BarChart3,
  LogOut } from
'lucide-react';
import { useAuth } from '../../context/AuthContext';
export function AdminSidebar() {
  const { signOut } = useAuth();
  const navItems = [
  {
    path: '/admin',
    icon: LayoutDashboard,
    label: 'Overview',
    end: true
  },
  {
    path: '/admin/sites',
    icon: MapPin,
    label: 'Sites Management'
  },
  {
    path: '/admin/thresholds',
    icon: SlidersHorizontal,
    label: 'Thresholds'
  },
  {
    path: '/admin/performance',
    icon: BrainCircuit,
    label: 'AI Performance'
  },
  {
    path: '/admin/incentives',
    icon: Gift,
    label: 'Incentives'
  },
  {
    path: '/admin/analytics',
    icon: BarChart3,
    label: 'Analytics'
  }];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 font-sans">
      <div className="p-6">
        <h1 className="text-2xl font-display font-bold text-white flex items-center gap-2">
          PathWise
          <span className="text-[10px] uppercase tracking-wider bg-brand-600 text-white px-2 py-0.5 rounded-full font-sans">
            Admin
          </span>
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) =>
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? 'bg-brand-700 text-white' : 'hover:bg-slate-800 hover:text-white'}`
          }>
          
            <item.icon size={18} />
            {item.label}
          </NavLink>
        )}
      </nav>

      <div className="p-4 m-4 bg-slate-800 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">
            SM
          </div>
          <div>
            <p className="text-sm font-bold text-white">Site Manager</p>
            <p className="text-xs text-slate-400">Kandy Region</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="text-slate-400 hover:text-white transition-colors p-2">
          
          <LogOut size={18} />
        </button>
      </div>
    </div>);

}