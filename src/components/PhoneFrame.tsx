import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';
export function PhoneFrame({
  children,
  inline = false



}: {children: React.ReactNode;inline?: boolean;}) {
  const phoneContent =
  <div className="relative w-full max-w-[390px] h-[844px] bg-black rounded-[50px] shadow-2xl border-[8px] border-black overflow-hidden flex flex-col shrink-0">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50 pointer-events-none">
        <div className="w-32 h-6 bg-black rounded-b-3xl"></div>
      </div>

      {/* Status Bar */}
      <div className="h-12 w-full bg-white/80 backdrop-blur-md flex items-center justify-between px-6 text-xs font-medium z-40 absolute top-0">
        <span>9:41</span>
        <div className="flex items-center gap-1.5">
          <Signal size={14} />
          <Wifi size={14} />
          <Battery size={16} />
        </div>
      </div>

      {/* App Content Area */}
      <div className="flex-1 min-h-0 bg-slate-50 overflow-hidden relative pt-14 pb-4 flex flex-col">
        {children}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1 inset-x-0 h-1 flex justify-center z-50 pointer-events-none">
        <div className="w-1/3 h-1 bg-black/20 rounded-full"></div>
      </div>
    </div>;

  if (inline) {
    return phoneContent;
  }
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Project Meta Sidebar (Desktop only) */}
      <div className="hidden lg:flex flex-col mr-12 max-w-xs text-slate-500">
        <h1 className="text-2xl font-display font-bold text-slate-800 mb-2">
          PathWise
        </h1>
        <p className="text-sm mb-4">AI Tourism Prediction & Nudge Engine</p>
        <div className="space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-brand-500"></div>
            <span>LSTM Forecasting Model</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
            <span>Behavioral Nudge Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Real-time Crowd Mitigation</span>
          </div>
        </div>
      </div>

      {phoneContent}
    </div>);

}