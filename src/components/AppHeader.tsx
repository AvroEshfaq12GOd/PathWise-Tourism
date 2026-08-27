import { useState } from 'react';
import { Bell, X, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SriLankaLiveHeaderBanner } from './SriLankaLiveHeaderBanner';

export function AppHeader({
  title,
  subtitle
}: {
  title: string;
  subtitle?: string;
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);
  const navigate = useNavigate();

  return (
    <>
      <SriLankaLiveHeaderBanner variant="app" />
      <div className="px-5 py-3.5 bg-white/95 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between border-b border-slate-100">
        <div>
          {subtitle && (
            <p className="text-xs text-slate-500 font-medium mb-0.5 tracking-tight">
              {subtitle}
            </p>
          )}
          <h1 className="text-xl font-display font-bold text-slate-900 leading-tight">
            {title}
          </h1>
        </div>
        <button
          onClick={() => {
            setShowNotifications(true);
            setUnreadCount(0);
          }}
          className="relative p-2 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          )}
        </button>
      </div>

      {/* Notifications Modal Drawer */}
      {showNotifications && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-xs shadow-2xl border border-slate-200 overflow-hidden font-sans">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-emerald-400" />
                <h3 className="font-bold text-sm">Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 space-y-2.5 max-h-72 overflow-y-auto">
              <div
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/app/nudges');
                }}
                className="p-3 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100/70 transition-colors"
              >
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs mb-1">
                  <AlertTriangle size={14} className="text-amber-600 shrink-0" />
                  <span>High Congestion Alert</span>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  Temple of the Tooth reached 92% capacity. Route to Botanical Gardens to earn +75 pts.
                </p>
                <span className="text-[10px] text-amber-700 font-semibold mt-1 inline-block">5 min ago • Tap to view</span>
              </div>

              <div
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/app/profile');
                }}
                className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer hover:bg-emerald-100/70 transition-colors"
              >
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs mb-1">
                  <Sparkles size={14} className="text-emerald-600 shrink-0" />
                  <span>Bonus Reward Active</span>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  You have 1,250 PathPoints available. Free coffee & museum passes ready to redeem!
                </p>
                <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">1 hour ago • Tap to redeem</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Close
              </button>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-xs font-bold text-[#0D6E6E] hover:underline flex items-center gap-1"
              >
                <Check size={12} /> Mark all read
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
