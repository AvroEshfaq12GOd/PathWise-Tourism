import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { CrowdGauge } from '../components/CrowdGauge';
import { CrowdBadge } from '../components/CrowdBadge';
import { getNudgesLive, getSitesLive, type LiveNudge, type LiveSite } from '../lib/api';
import {
  MapPin,
  TrendingUp,
  CloudSun,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Navigation
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<LiveSite[]>([]);
  const [nudges, setNudges] = useState<LiveNudge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [suggestionStatus, setSuggestionStatus] = useState<'pending' | 'accepted' | 'dismissed'>('pending');
  const [pointsToast, setPointsToast] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const [liveSites, liveNudges] = await Promise.all([getSitesLive(), getNudgesLive()]);
        if (!mounted) return;
        setSites(liveSites);
        setNudges(liveNudges);
      } catch {
        if (!mounted) return;
        setSites([]);
        setNudges([]);
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

  const currentSite = sites[0];
  const activeNudge = nudges[0];
  const altSite = activeNudge ? sites.find((s) => s.id === activeNudge.altSiteId) : undefined;

  const handleAcceptSuggestion = () => {
    setSuggestionStatus('accepted');
    setPointsToast('+75 PathPoints awarded! Route updated to Royal Botanical Gardens.');
    setTimeout(() => {
      setPointsToast(null);
    }, 4000);
  };

  const handleDismissSuggestion = () => {
    setSuggestionStatus('dismissed');
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto pb-6">
        <AppHeader title="Good afternoon," subtitle="Exploring Kandy" />
        <div className="px-5 pt-4 space-y-4">
          <div className="h-10 rounded-full bg-slate-100 animate-pulse" />
          <div className="h-36 rounded-3xl bg-slate-100 animate-pulse" />
          <div className="h-44 rounded-3xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!currentSite) {
    return (
      <div className="flex-1 overflow-y-auto pb-6">
        <AppHeader title="Good afternoon," subtitle="Exploring Kandy" />
        <div className="px-5 pt-8 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-slate-900">Live refresh is warming up</p>
            <p className="mt-1 text-sm text-slate-500">
              Connecting to live crowd telemetry. Please wait a moment.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto pb-6 relative"
    >
      <AppHeader title="Good afternoon," subtitle="Exploring Kandy" />

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {pointsToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 inset-x-8 z-50 bg-emerald-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-emerald-700 flex items-center gap-2 text-xs font-semibold"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span className="leading-snug">{pointsToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-5 space-y-5 mt-2">
        {/* Context Strip */}
        <div className="flex gap-2.5 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-700 whitespace-nowrap border border-slate-100">
            <CloudSun size={14} className="text-amber-500" />
            <span>28°C Sunny</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full shadow-sm text-xs font-medium text-slate-700 whitespace-nowrap border border-slate-100">
            <Calendar size={14} className="text-[#0D6E6E]" />
            <span>Public Holiday</span>
          </div>
        </div>

        {/* Main Status Card */}
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-1.5 text-[#0D6E6E] mb-1.5">
                <MapPin size={15} />
                <span className="text-xs font-bold uppercase tracking-wider">Current Location</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight">
                {currentSite.name}
              </h2>
            </div>
            <div className="bg-slate-50/80 p-1.5 rounded-2xl">
              <CrowdGauge
                percentage={currentSite.currentDensity}
                size={82}
                strokeWidth={9}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <TrendingUp size={15} className="text-red-500" />
              <span>
                {currentSite.trend === 'up'
                  ? 'Congestion rising'
                  : currentSite.trend === 'down'
                  ? 'Congestion easing'
                  : 'Crowd levels stable'}
              </span>
            </div>
            <button
              onClick={() => navigate('/app/forecast')}
              className="text-[#0D6E6E] text-xs font-bold flex items-center gap-1 hover:underline"
            >
              View Forecast <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Smart Suggestion Banner */}
        {suggestionStatus === 'pending' && activeNudge && altSite && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-gradient-to-br from-[#0c534f] to-[#073835] rounded-3xl p-5 text-white shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-15 pointer-events-none">
              <Sparkles size={72} />
            </div>
            <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Smart Suggestion
            </div>
            <p className="text-xs text-slate-100 mb-4 leading-relaxed pr-6 font-normal">
              {activeNudge.reason} Visit{' '}
              <strong className="text-white font-bold">{altSite.name}</strong> instead and earn{' '}
              <strong className="text-amber-300 font-bold">{activeNudge.incentive}</strong>.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={handleAcceptSuggestion}
                className="bg-white hover:bg-slate-100 text-[#0c534f] px-4 py-2.5 rounded-xl text-xs font-bold flex-1 shadow-sm transition-transform active:scale-95"
              >
                Accept Route
              </button>
              <button
                onClick={handleDismissSuggestion}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl text-xs font-semibold border border-white/20 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}

        {suggestionStatus === 'accepted' && altSite && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-3xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Navigation size={20} />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-900">En Route to {altSite.name}</p>
                <p className="text-[11px] text-emerald-700">+75 PathPoints pending arrival</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/app/map')}
              className="text-xs font-bold text-white bg-[#0D6E6E] px-3 py-1.5 rounded-lg shadow-sm"
            >
              Open Map
            </button>
          </motion.div>
        )}

        {/* Nearby Attractions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-display font-bold text-slate-900">
              Nearby Attractions
            </h3>
            <button
              onClick={() => navigate('/app/map')}
              className="text-[#0D6E6E] text-xs font-bold hover:underline"
            >
              See all
            </button>
          </div>

          <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-3 -mx-5 px-5">
            {sites.slice(1).map((site) => (
              <div
                key={site.id}
                onClick={() => navigate('/app/map')}
                className="min-w-[160px] max-w-[160px] bg-white rounded-2xl p-2.5 shadow-soft border border-slate-100 flex-shrink-0 cursor-pointer hover:border-brand-300 transition-all hover:shadow-md"
              >
                <div className="h-24 rounded-xl mb-2.5 bg-slate-200 overflow-hidden relative">
                  <img
                    src={site.imageUrl}
                    alt={site.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <CrowdBadge density={site.currentDensity} />
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 text-xs truncate">
                  {site.name}
                </h4>
                <p className="text-[10px] font-medium text-slate-500 mt-0.5">{site.category}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
