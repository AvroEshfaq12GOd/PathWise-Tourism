import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { CrowdGauge } from '../components/CrowdGauge';
import { CrowdBadge } from '../components/CrowdBadge';
import { SiteImage } from '../lib/siteImages';
import { useSriLankaSync } from '../context/SriLankaSyncContext';
import { SiteDetailModal } from '../components/SiteDetailModal';
import { getStoredBroadcasts, AdminBroadcastAlert } from '../lib/broadcastStore';
import {
  MapPin,
  TrendingUp,
  CloudSun,
  Calendar,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Navigation,
  Search,
  ChevronDown,
  Layers,
  ExternalLink,
  Moon,
  Sun,
  Footprints,
  Compass,
  Radio,
  AlertTriangle,
  Flame,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();
  const { timeState, sites, dynamicNudges, isLoading } = useSriLankaSync();
  const [selectedSiteId, setSelectedSiteId] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [suggestionStatus, setSuggestionStatus] = useState<'pending' | 'accepted' | 'dismissed'>('pending');
  const [pointsToast, setPointsToast] = useState<string | null>(null);
  const [modalSite, setModalSite] = useState<any | null>(null);
  const [broadcasts, setBroadcasts] = useState<AdminBroadcastAlert[]>([]);
  const [dismissedAlertIds, setDismissedAlertIds] = useState<string[]>([]);

  useEffect(() => {
    setBroadcasts(getStoredBroadcasts());
    const handleUpdate = () => setBroadcasts(getStoredBroadcasts());
    window.addEventListener('pathwise_broadcast_update', handleUpdate);
    return () => window.removeEventListener('pathwise_broadcast_update', handleUpdate);
  }, []);

  const activeAlerts = useMemo(() => {
    return broadcasts.filter((b) => b.active && !dismissedAlertIds.includes(b.id));
  }, [broadcasts, dismissedAlertIds]);

  const currentSite = useMemo(() => {
    return sites.find((s) => s.id === selectedSiteId) || sites[0];
  }, [sites, selectedSiteId]);

  const activeNudge = dynamicNudges[0];
  const altSite = activeNudge ? sites.find((s) => s.id === activeNudge.altSiteId) : undefined;

  const greeting = timeState.isNight ? 'Good evening,' : timeState.hour < 12 ? 'Good morning,' : 'Good afternoon,';

  const categories = useMemo(() => {
    const cats = new Set(sites.map((s) => s.category));
    return ['All', ...Array.from(cats)];
  }, [sites]);

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const matchesCat = selectedCategory === 'All' || site.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [sites, selectedCategory, searchQuery]);

  const handleAcceptSuggestion = () => {
    setSuggestionStatus('accepted');
    setPointsToast(`+75 PathPoints awarded! Route updated to ${altSite?.name || 'alternative site'}.`);
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
        <AppHeader title={greeting} subtitle="Discover Sri Lanka" />
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
        <AppHeader title={greeting} subtitle="Discover Sri Lanka" />
        <div className="px-5 pt-8 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-slate-900">Live telemetry warming up</p>
            <p className="mt-1 text-sm text-slate-500">
              Connecting to real-time Sri Lanka crowd telemetry. Please wait...
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
      className="flex-1 overflow-y-auto pb-8 relative"
    >
      <AppHeader title={greeting} subtitle="Discover Sri Lanka" />

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
        {/* Context Strip & Location Picker */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto hide-scrollbar">
          <div className="relative flex-1 min-w-[200px]">
            <select
              value={currentSite.id}
              onChange={(e) => setSelectedSiteId(e.target.value)}
              aria-label="Current Location"
              className="w-full appearance-none bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-full pl-8 pr-7 py-2 shadow-xs focus:ring-2 focus:ring-[#0D6E6E]/20 outline-none truncate"
            >
              {sites.map((s) => (
                <option key={s.id} value={s.id}>
                  📍 {s.name} ({s.region.split(' ')[0]})
                </option>
              ))}
            </select>
            <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#0D6E6E] pointer-events-none" />
            <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-full shadow-xs text-xs font-medium text-slate-700 whitespace-nowrap border border-slate-200 shrink-0">
            <CloudSun size={13} className="text-amber-500" />
            <span>{currentSite.weather.temp ? `${currentSite.weather.temp}°C` : '28°C'} {currentSite.weather.condition}</span>
          </div>
        </div>

        {/* Live Official Broadcast / Emergency Banners */}
        {activeAlerts.length > 0 && (
          <div className="space-y-2">
            {activeAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-2xl border shadow-xs text-xs flex items-start justify-between gap-3 ${
                  alert.severity === 'emergency'
                    ? 'bg-red-500 text-white border-red-600'
                    : alert.severity === 'warning'
                    ? 'bg-amber-500 text-white border-amber-600'
                    : alert.severity === 'weather'
                    ? 'bg-blue-600 text-white border-blue-700'
                    : 'bg-slate-900 text-white border-slate-800'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white/20 shrink-0 mt-0.5">
                    {alert.severity === 'emergency' ? (
                      <ShieldAlert size={15} />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle size={15} />
                    ) : (
                      <Radio size={15} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="uppercase text-[9px] bg-white/25 px-1.5 py-0.2 rounded font-extrabold">
                        Priority Advisory
                      </span>
                      <span>{alert.title}</span>
                    </div>
                    <p className="text-[11px] opacity-90 mt-1 leading-snug">{alert.message}</p>
                    {alert.actionRequired && (
                      <p className="text-[10px] bg-white/15 px-2 py-1 rounded-md mt-1.5 font-semibold">
                        ★ {alert.actionRequired}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setDismissedAlertIds((prev) => [...prev, alert.id])}
                  className="text-white/70 hover:text-white text-xs px-1.5 py-0.5 rounded shrink-0"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Main Location Live Status Card */}
        <div className="bg-white rounded-3xl p-5 shadow-soft border border-slate-100 relative overflow-hidden">
          <div className="flex justify-between items-start relative z-10 gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[#0D6E6E] mb-1 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                  {currentSite.category}
                </span>
                {currentSite.unescoHeritage && (
                  <span className="text-[9px] font-extrabold bg-blue-900 text-white px-1.5 py-0.5 rounded shadow-xs">
                    UNESCO
                  </span>
                )}
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                    currentSite.isOpen !== false
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${currentSite.isOpen !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                  {currentSite.isOpen !== false ? 'Open Now' : 'Closed'}
                </span>
              </div>
              <h2 className="text-xl font-display font-bold text-slate-900 leading-tight truncate">
                {currentSite.name}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                {currentSite.statusLabel || currentSite.region}
              </p>
            </div>
            <div className="bg-slate-50/80 p-1.5 rounded-2xl shrink-0">
              <CrowdGauge
                percentage={currentSite.currentDensity}
                size={78}
                strokeWidth={8}
                isOpen={currentSite.isOpen !== false}
              />
            </div>
          </div>

          {/* Quick Action Navigation & Paths Buttons */}
          <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 relative z-10">
            <button
              onClick={() => setModalSite(currentSite)}
              className="bg-[#0D6E6E] hover:bg-[#095454] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-transform active:scale-95"
            >
              <Navigation size={13} />
              <span>Routing & Paths</span>
            </button>

            <button
              onClick={() => setModalSite(currentSite)}
              className="bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles size={13} className="text-purple-600" />
              <span>Events & Live Hub</span>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 relative z-10">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <TrendingUp size={14} className={currentSite.isOpen === false ? 'text-slate-400' : currentSite.trend === 'up' ? 'text-red-500' : 'text-emerald-500'} />
              <span>
                {currentSite.isOpen === false
                  ? `Operating Hours: ${currentSite.operatingHours || '09:00 AM – 05:00 PM'}`
                  : currentSite.trend === 'up'
                  ? 'Congestion rising'
                  : currentSite.trend === 'down'
                  ? 'Congestion easing'
                  : 'Crowd levels stable'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/app/forecast?site=${currentSite.id}`)}
                className="text-[#0D6E6E] text-xs font-bold flex items-center gap-1 hover:underline"
              >
                Forecast <ArrowRight size={13} />
              </button>
            </div>
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
              <Sparkles size={14} /> Smart Dispersal Nudge
            </div>
            <p className="text-xs text-slate-100 mb-4 leading-relaxed pr-4 font-normal">
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

        {/* Search & Category Filter Section */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-display font-bold text-slate-900 flex items-center gap-1.5">
                <Layers size={18} className="text-[#0D6E6E]" />
                All Monitored Attractions ({filteredSites.length})
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                Live crowd intelligence across Sri Lanka's top destinations
              </p>
            </div>
            <button
              onClick={() => navigate('/app/map')}
              className="text-[#0D6E6E] text-xs font-bold hover:underline shrink-0"
            >
              Open Map →
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 35+ sites by name, region, or keyword..."
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-1.5 overflow-x-auto hide-scrollbar pb-2 mb-3">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#0D6E6E] text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Grid of All Attractions */}
          <div className="grid grid-cols-2 gap-3">
            {filteredSites.map((site) => (
              <div
                key={site.id}
                onClick={() => {
                  setSelectedSiteId(site.id);
                  setModalSite(site);
                }}
                className="bg-white rounded-2xl p-2.5 shadow-soft border border-slate-100 cursor-pointer hover:border-[#0D6E6E]/40 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="h-24 rounded-xl mb-2 bg-slate-200 overflow-hidden relative">
                    <SiteImage
                      siteName={site.name}
                      src={site.imageUrl}
                      alt={site.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {site.unescoHeritage && (
                      <div className="absolute top-1.5 left-1.5 bg-blue-900/90 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded shadow-sm">
                        UNESCO
                      </div>
                    )}
                    <div className="absolute top-1.5 right-1.5">
                      <CrowdBadge density={site.currentDensity} isOpen={site.isOpen !== false} />
                    </div>
                  </div>
                  <h4 className="font-bold text-slate-900 text-xs line-clamp-1 group-hover:text-[#0D6E6E]">
                    {site.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate">{site.region}</p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1.5 border-t border-slate-100">
                  <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px]">
                    {site.category.split(' ')[0]}
                  </span>
                  <span className="font-bold text-slate-700">{site.currentDensity}% Density</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Site Details, Routing, Events & Organized Circuit Modal */}
      <SiteDetailModal
        site={modalSite}
        isOpen={Boolean(modalSite)}
        onClose={() => setModalSite(null)}
      />
    </motion.div>
  );
}
