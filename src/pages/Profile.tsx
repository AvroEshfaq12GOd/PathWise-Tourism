import React from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import {
  Wallet,
  Award,
  Settings,
  ChevronRight,
  Coffee,
  Ticket,
  LogOut } from
'lucide-react';
import { useAuth } from '../context/AuthContext';
export function Profile() {
  const { signOut } = useAuth();
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      className="flex-1 overflow-y-auto pb-6">
      
      <AppHeader title="Profile & Wallet" />

      <div className="px-5 mt-2 space-y-6">
        {/* Wallet Card */}
        <div className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Wallet size={80} />
          </div>
          <p className="text-brand-200 text-sm font-medium mb-1">
            PathPoints Balance
          </p>
          <div className="flex items-end gap-2 mb-6">
            <h2 className="text-4xl font-display font-bold">1,250</h2>
            <span className="text-brand-200 text-sm mb-1">pts</span>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 flex justify-between items-center border border-white/20">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-400" />
              <span className="text-sm font-medium">Explorer Tier</span>
            </div>
            <span className="text-xs text-brand-200">250 to next tier</span>
          </div>
        </div>

        {/* Rewards Section */}
        <div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-3">
            Redeem Rewards
          </h3>
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                  <Coffee size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">
                    Free Coffee
                  </p>
                  <p className="text-xs text-slate-500">At partner cafes</p>
                </div>
              </div>
              <button className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg">
                500 pts
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow-soft border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <Ticket size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900">
                    Museum Pass
                  </p>
                  <p className="text-xs text-slate-500">Skip the line entry</p>
                </div>
              </div>
              <button className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg">
                1200 pts
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div>
          <h3 className="text-lg font-display font-bold text-slate-900 mb-3">
            Preferences
          </h3>
          <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Nudge Settings
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award size={18} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Travel Interests
                </span>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          </div>
        </div>

        <button
          onClick={signOut}
          className="w-full mt-6 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
          
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </motion.div>);

}