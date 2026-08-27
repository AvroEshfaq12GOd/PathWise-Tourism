import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { getNudgesLive, getSitesLive, type LiveNudge, type LiveSite, updateNudgeStatus } from '../lib/api';
import { MapPin, Navigation, Gift, X, Check } from 'lucide-react';
export function Nudges() {
  const [nudges, setNudges] = useState<LiveNudge[]>([]);
  const [sites, setSites] = useState<LiveSite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const [liveNudges, liveSites] = await Promise.all([getNudgesLive(), getSitesLive()]);
        if (!mounted) return;
        setNudges(liveNudges);
        setSites(liveSites);
      } catch {
        if (!mounted) return;
        setNudges([]);
        setSites([]);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void load();
    const timer = window.setInterval(() => void load(), 30000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  const handleDismiss = async (id: string) => {
    setNudges((prev) => prev.filter((n) => n.id !== id));
    setToastMsg('Alert dismissed.');
    setTimeout(() => setToastMsg(null), 3000);
    try {
      await updateNudgeStatus(id, 'dismissed');
    } catch {
      // keep optimistic UI state
    }
  };

  const handleAccept = async (id: string, incentive: string) => {
    setNudges((prev) => prev.filter((n) => n.id !== id));
    setToastMsg(`Accepted! ${incentive} added to your profile.`);
    setTimeout(() => setToastMsg(null), 3500);
    try {
      await updateNudgeStatus(id, 'accepted');
    } catch {
      // keep optimistic UI state
    }
  };

  if (isLoading) {
    return (
      <motion.div className="flex-1 overflow-y-auto pb-6">
        <AppHeader title="Smart Nudges" subtitle="Loading live alternatives" />
      </motion.div>
    );
  }

  if (!nudges.length && !sites.length) {
    return (
      <motion.div className="flex-1 overflow-y-auto pb-6">
        <AppHeader title="Smart Nudges" subtitle="No live alternatives available" />
        <div className="px-5 mt-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600 shadow-soft">
            No active nudges were returned from the backend. Check the live refresh service and the nudges collection.
          </div>
        </div>
      </motion.div>
    );
  }
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
      className="flex-1 overflow-y-auto pb-6 relative">
      
      <AppHeader title="Smart Nudges" subtitle="Personalized Alternatives" />

      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 inset-x-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold"
          >
            <Check size={16} className="text-emerald-400 shrink-0" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 mt-2">
        {/* Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar">
          {['All', 'Routes', 'Locations', 'Off-peak'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                activeFilter === filter
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Nudge Feed */}
        <div className="space-y-4">
          <AnimatePresence>
            {nudges.length === 0 ? (
              <motion.div
                initial={{
                  opacity: 0
                }}
                animate={{
                  opacity: 1
                }}
                className="text-center py-12 text-slate-500"
              >
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Check size={24} className="text-emerald-500" />
                </div>
                <p className="text-sm font-medium">You're all caught up!</p>
                <p className="text-xs mt-1">
                  No active congestion alerts for your route.
                </p>
              </motion.div>
            ) : (
              nudges.map((nudge, index) => {
                const origSite = sites.find(
                  (s) => s.id === nudge.originalSiteId
                );
                const altSite = sites.find((s) => s.id === nudge.altSiteId);
                if (!origSite || !altSite) return null;
                return (
                  <motion.div
                    key={nudge.id}
                    initial={{
                      opacity: 0,
                      y: 20
                    }}
                    animate={{
                      opacity: 1,
                      y: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -100
                    }}
                    transition={{
                      delay: index * 0.1
                    }}
                    className="bg-white rounded-2xl p-5 shadow-soft border border-slate-100 relative overflow-hidden"
                  >
                    {/* Decorative line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>

                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
                        <MapPin size={14} /> Route Alert
                      </div>
                      <button
                        onClick={() => handleDismiss(nudge.id)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X size={18} />
                      </button>
                    </div>

                    <p className="text-sm text-slate-700 mb-4 leading-relaxed font-medium">
                      {nudge.reason}
                    </p>

                    <div className="bg-slate-50 rounded-xl p-3 mb-4 flex items-center justify-between border border-slate-100">
                      <div>
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">
                          Alternative
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {altSite.name}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                          <span className="flex items-center gap-1">
                            <Navigation size={12} className="text-[#0D6E6E]" /> {nudge.travelTimeMin} min
                          </span>
                          <span>•</span>
                          <span>{nudge.distanceKm} km away</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 rounded-lg bg-slate-200 overflow-hidden flex-shrink-0">
                        <img
                          src={altSite.imageUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-brand-700 font-bold text-xs bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-100">
                        <Gift size={15} />
                        {nudge.incentive}
                      </div>
                      <button
                        onClick={() => handleAccept(nudge.id, nudge.incentive)}
                        className="bg-slate-900 hover:bg-slate-800 active:scale-95 transition-transform text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm"
                      >
                        Accept
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}