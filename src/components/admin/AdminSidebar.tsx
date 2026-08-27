import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  SlidersHorizontal,
  BrainCircuit,
  Gift,
  BarChart3,
  LogOut,
  FileText,
  Clock,
  Radio
} from 'lucide-react';
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
      path: '/admin/reports',
      icon: FileText,
      label: 'Daily Operations Reports',
      badge: 'Daily'
    },
    {
      path: '/admin/peak-monitor',
      icon: Clock,
      label: 'Peak Hours & Capacity',
      badge: 'Live'
    },
    {
      path: '/admin/broadcast',
      icon: Radio,
      label: 'Emergency Broadcast'
    },
    {
      path: '/admin/simulation',
      icon: BrainCircuit,
      label: 'What-If Simulation'
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
      path: '/admin/incentives',
      icon: Gift,
      label: 'Incentives'
    },
    {
      path: '/admin/analytics',
      icon: BarChart3,
      label: 'Analytics'
    }
  ];

  return (
    <div className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 font-sans z-30">
      <div className="p-5 border-b border-slate-800">
        <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
          PathWise
          <span className="text-[10px] uppercase tracking-wider bg-[#0D6E6E] text-white px-2 py-0.5 rounded font-sans font-bold">
            Admin
          </span>
        </h1>
        <p className="text-[11px] text-slate-400 mt-1">
          National Tourism Intelligence & Operations
        </p>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#0D6E6E] text-white shadow-xs'
                  : 'hover:bg-slate-800 hover:text-white text-slate-300'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <item.icon size={16} />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span
                className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                  item.badge === 'Official'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-red-500 text-white'
                }`}
              >
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 m-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0D6E6E] flex items-center justify-center text-amber-300 font-bold text-xs">
            PW
          </div>
          <div>
            <p className="text-xs font-bold text-white leading-tight">Operations Admin</p>
            <p className="text-[10px] text-emerald-400 font-mono">Central Command</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-700"
          title="Sign out"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
