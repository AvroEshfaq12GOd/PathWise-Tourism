import React from 'react';
import { useSriLankaSync } from '../context/SriLankaSyncContext';
import { Clock, Moon, Sun, Sparkles, RefreshCw } from 'lucide-react';

export function SriLankaLiveBanner() {
  const { timeState, isWeatherLoading, refreshAll } = useSriLankaSync();

  return (
    <div className="bg-slate-900 text-white px-4 py-2.5 shadow-md flex items-center justify-between border-b border-slate-800 text-xs">
      {/* Left: Clock & Day/Night */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-slate-800/90 text-amber-300 px-2 py-0.5 rounded-full font-mono font-semibold border border-slate-700">
          {timeState.isNight ? (
            <Moon size={12} className="text-amber-300 animate-pulse" />
          ) : (
            <Sun size={12} className="text-amber-400 animate-spin-slow" />
          )}
          <span>{timeState.timeWithSeconds}</span>
        </div>
        <span className="text-[10px] text-slate-400 hidden sm:inline">
          Asia/Colombo (UTC+5:30)
        </span>
      </div>

      {/* Center/Right: Live Sync status & Poya / Refresh */}
      <div className="flex items-center gap-2">
        {timeState.isPoyaDay && (
          <div className="hidden sm:flex items-center gap-1 bg-purple-900/60 text-purple-200 border border-purple-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
            <Sparkles size={10} className="text-purple-300" />
            <span>Poya Surge Active</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-950/70 border border-emerald-800 px-2 py-0.5 rounded-full font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Meteorology</span>
        </div>

        <button
          onClick={() => void refreshAll()}
          title="Refresh Live Sri Lanka Weather & Density"
          className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition"
        >
          <RefreshCw size={12} className={isWeatherLoading ? 'animate-spin text-emerald-400' : ''} />
        </button>
      </div>
    </div>
  );
}
