import React, { useState, useEffect } from 'react';
import { Clock, Calendar, Sparkles, Sun, CloudRain, Moon, Info, X } from 'lucide-react';
import { getSriLankaTime, getUpcomingHolidayOrFestival, SRI_LANKA_HOLIDAYS_AND_FESTIVALS, SriLankaHoliday } from '../lib/sriLankaContext';

interface SriLankaLiveHeaderBannerProps {
  variant?: 'app' | 'admin';
}

export const SriLankaLiveHeaderBanner: React.FC<SriLankaLiveHeaderBannerProps> = ({ variant = 'app' }) => {
  const [slTime, setSlTime] = useState(getSriLankaTime());
  const [holidayData, setHolidayData] = useState(getUpcomingHolidayOrFestival());
  const [showCalendarModal, setShowCalendarModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlTime(getSriLankaTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const isCurrentHoliday = Boolean(holidayData.current);

  if (variant === 'admin') {
    return (
      <>
        <div className="flex items-center gap-3 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs shadow-sm border border-slate-800">
          {/* SL Time */}
          <div className="flex items-center gap-1.5 border-r border-slate-700 pr-3">
            <Clock size={13} className="text-amber-400 animate-pulse" />
            <div>
              <span className="text-[10px] text-slate-400 font-medium mr-1">SLT:</span>
              <span className="font-mono font-bold text-amber-300">{slTime.timeStr}</span>
            </div>
          </div>

          {/* Today's Holiday or Next Upcoming */}
          <button
            onClick={() => setShowCalendarModal(true)}
            className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors text-left"
            title="View 2026/2027 Sri Lanka Holiday & Festival Calendar"
          >
            <Sparkles size={13} className="text-emerald-400 shrink-0" />
            {isCurrentHoliday ? (
              <>
                <span className="max-w-[190px] truncate font-medium text-slate-200">
                  {holidayData.current?.name}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold uppercase">
                  {holidayData.current?.type || 'Active'}
                </span>
              </>
            ) : (
              <>
                <span className="max-w-[190px] truncate font-medium text-slate-300">
                  Standard Day • Next: {holidayData.next.name.split(' ')[0]} {holidayData.next.type === 'Poya' ? 'Poya' : ''}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700 text-[9px] font-mono font-bold">
                  in {holidayData.daysUntilNext}d
                </span>
              </>
            )}
          </button>
        </div>

        {showCalendarModal && (
          <CalendarModal onClose={() => setShowCalendarModal(false)} />
        )}
      </>
    );
  }

  // App Mobile / Tablet Banner (Rich contextual ribbon)
  return (
    <>
      <div className="bg-gradient-to-r from-[#003838] via-[#0D6E6E] to-[#125858] text-white px-4 py-2.5 shadow-sm text-xs font-sans">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Live Sri Lankan Standard Time */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
            <div className="flex items-center gap-1">
              <Clock size={13} className="text-amber-300" />
              <span className="text-emerald-200 text-[10px] font-semibold uppercase tracking-wider">Sri Lanka Time:</span>
              <span className="font-mono font-extrabold text-white text-xs tracking-tight">{slTime.timeStr}</span>
            </div>
            <span className="hidden sm:inline text-emerald-300/60">•</span>
            <span className="hidden sm:inline text-emerald-100/90 text-[11px] font-medium">{slTime.dateStr} ({slTime.dayOfWeek})</span>
          </div>

          {/* Holiday / Festival / Calendar Pill */}
          <button
            onClick={() => setShowCalendarModal(true)}
            className="flex items-center gap-2 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-400/30 px-2.5 py-1 rounded-full text-slate-100 hover:text-white transition-all group shrink-0"
          >
            <Sparkles size={12} className="text-amber-300 group-hover:rotate-12 transition-transform" />
            {isCurrentHoliday ? (
              <>
                <span className="font-medium text-[11px] max-w-[140px] sm:max-w-[200px] truncate text-emerald-100">
                  {holidayData.current?.name}
                </span>
                <span className="bg-amber-400/20 text-amber-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-amber-300/30 uppercase">
                  Active Today
                </span>
              </>
            ) : (
              <>
                <span className="font-medium text-[11px] max-w-[140px] sm:max-w-[200px] truncate text-emerald-100">
                  Next: {holidayData.next.name}
                </span>
                <span className="bg-white/10 text-amber-300 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border border-white/20">
                  in {holidayData.daysUntilNext} days ({holidayData.next.month} {holidayData.next.day})
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {showCalendarModal && (
        <CalendarModal onClose={() => setShowCalendarModal(false)} />
      )}
    </>
  );
};

function CalendarModal({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<'All' | 'Poya' | 'Festival' | 'Public'>('All');

  const filtered = SRI_LANKA_HOLIDAYS_AND_FESTIVALS.filter(
    (h) => filter === 'All' || h.type === filter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden font-sans flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 to-[#0D6E6E] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl">
              <Calendar size={20} className="text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Sri Lanka Calendar & Festivals</h3>
              <p className="text-xs text-emerald-200">Public Holidays, Poya Days & Key Cultural Peraheras</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs overflow-x-auto">
          {(['All', 'Poya', 'Festival', 'Public'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                filter === t
                  ? 'bg-[#0D6E6E] text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {t === 'All' ? 'All Events' : t === 'Poya' ? 'Full Moon Poya Days' : t === 'Festival' ? 'Cultural Festivals' : 'Public & Bank Holidays'}
            </button>
          ))}
        </div>

        {/* List of holidays */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 divide-y divide-slate-100">
          {filtered.map((item, idx) => (
            <div key={idx} className="pt-2.5 first:pt-0 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="bg-slate-100 text-slate-800 rounded-xl p-2 text-center min-w-[48px] shrink-0 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-500">{item.month}</div>
                  <div className="text-lg font-black text-slate-900 leading-none">{item.day}</div>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-sm text-slate-900">{item.name}</h4>
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        item.type === 'Poya'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : item.type === 'Festival'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center text-xs text-slate-500">
          PathWise AI crowd models incorporate full Moon Poya days & festive surges into real-time congestion forecasting.
        </div>
      </div>
    </div>
  );
}
