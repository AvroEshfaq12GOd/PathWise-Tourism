import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, TrendingUp, BellRing, User } from 'lucide-react';
import { motion } from 'framer-motion';
export function BottomNav() {
  const navItems = [
  {
    path: '/app',
    icon: Home,
    label: 'Home',
    end: true
  },
  {
    path: '/app/map',
    icon: Map,
    label: 'Map',
    end: false
  },
  {
    path: '/app/forecast',
    icon: TrendingUp,
    label: 'Forecast',
    end: false
  },
  {
    path: '/app/nudges',
    icon: BellRing,
    label: 'Nudges',
    end: false
  },
  {
    path: '/app/profile',
    icon: User,
    label: 'Profile',
    end: false
  }];

  return (
    <div className="h-20 bg-white border-t border-slate-100 shadow-up px-6 py-3 flex items-center justify-between z-40 relative shrink-0">
      {navItems.map((item) =>
      <NavLink
        key={item.path}
        to={item.path}
        end={item.end}
        className={({ isActive }) =>
        `flex flex-col items-center justify-center w-12 h-12 relative ${isActive ? 'text-brand-700' : 'text-slate-400 hover:text-slate-600'}`
        }>
        
          {({ isActive }) =>
        <>
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              {isActive &&
          <motion.div
            layoutId="nav-indicator"
            className="absolute -top-3 w-1 h-1 bg-brand-700 rounded-full"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }} />

          }
            </>
        }
        </NavLink>
      )}
    </div>);

}