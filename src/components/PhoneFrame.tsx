import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

export function PhoneFrame({
  children,
  inline = false
}: {
  children: React.ReactNode;
  inline?: boolean;
}) {
  const phoneContent = (
    <div className="relative w-full max-w-[390px] h-[844px] bg-white rounded-[48px] shadow-2xl border-[10px] border-slate-900 overflow-hidden flex flex-col shrink-0 select-none">
      {/* Dynamic Island / Notch */}
      <div className="absolute top-2 inset-x-0 flex justify-center z-50 pointer-events-none">
        <div className="w-28 h-5 bg-slate-900 rounded-full flex items-center justify-between px-3">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-800"></div>
          <div className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse"></div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-11 w-full bg-white/90 backdrop-blur-md flex items-center justify-between px-7 text-xs font-semibold text-slate-800 z-40 absolute top-0">
        <span className="text-[11px] font-bold tracking-tight">9:41</span>
        <div className="flex items-center gap-1.5 text-slate-800">
          <Signal size={13} strokeWidth={2.5} />
          <Wifi size={13} strokeWidth={2.5} />
          <Battery size={15} strokeWidth={2.5} />
        </div>
      </div>

      {/* App Content Area */}
      <div className="flex-1 min-h-0 bg-[#F8FAFC] overflow-hidden relative pt-11 flex flex-col">
        {children}
      </div>

      {/* Home Indicator */}
      <div className="absolute bottom-1.5 inset-x-0 h-1 flex justify-center z-50 pointer-events-none">
        <div className="w-32 h-1 bg-slate-400/50 rounded-full"></div>
      </div>
    </div>
  );

  if (inline) {
    return phoneContent;
  }

  return (
    <div className="min-h-screen bg-[#EAEFF4] flex items-center justify-center p-4 md:p-8 font-sans antialiased relative">
      {/* Project Meta Sidebar (Desktop only) */}
      <div className="hidden lg:flex flex-col mr-16 max-w-xs text-slate-600">
        <h1 className="text-3xl font-display font-bold text-slate-900 mb-1">
          PathWise
        </h1>
        <p className="text-xs text-slate-500 mb-6 font-medium">AI Tourism Prediction & Nudge Engine</p>
        <div className="space-y-3.5 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#0D6E6E] shrink-0"></div>
            <span>LSTM Forecasting Model</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0"></div>
            <span>Behavioral Nudge Engine</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-[#10B981] shrink-0"></div>
            <span>Real-time Crowd Mitigation</span>
          </div>
        </div>
      </div>

      {phoneContent}
    </div>
  );
}
