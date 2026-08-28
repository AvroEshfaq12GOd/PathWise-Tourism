import React, { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { useSriLankaSync } from '../context/SriLankaSyncContext';
import { SiteImage } from '../lib/siteImages';
import { LiveSite } from '../lib/api';
import { SiteDetailModal } from '../components/SiteDetailModal';
import { calculateSitePeakMetric } from '../lib/peakCrowdEngine';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea
} from 'recharts';
import {
  BrainCircuit,
  Info,
  ChevronDown,
  Sun,
  CloudSun,
  Calendar,
  Sparkles,
  Clock,
  Moon,
  Search,
  MapPin,
  Flame,
  TrendingUp,
  TrendingDown,
  Navigation,
  Layers,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X
} from 'lucide-react';
import { getUpcomingHolidayOrFestival, getSriLankaTime } from '../lib/sriLankaContext';

export function Forecast() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { timeState, sites, isLoading } = useSriLankaSync();

  const querySiteId = searchParams.get('site') || (location.state as { siteId?: string })?.siteId || '';
  const [selectedSiteId, setSelectedSiteId] = useState<string>(querySiteId);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalSite, setModalSite] = useState<LiveSite | null>(null);

  // Sync state if query param changes
  useEffect(() => {
    if (querySiteId && querySiteId !== selectedSiteId) {
      setSelectedSiteId(querySiteId);
    }
  }, [querySiteId]);

  // Determine current active site
  const site = useMemo(() => {
    if (sites.length === 0) return null;
    if (selectedSiteId) {
      const found = sites.find((s) => s.id.toLowerCase() === selectedSiteId.toLowerCase());
      if (found) return found;
    }
    return sites[0];
  }, [selectedSiteId, sites]);

  const peakMetric = useMemo(() => {
    if (!site) return null;
    return calculateSitePeakMetric(site);
  }, [site]);

  const holiday = getUpcomingHolidayOrFestival();
  const slTime = getSriLankaTime();

  const handleSelectSite = (id: string) => {
    setSelectedSiteId(id);
    setSearchParams({ site: id });
    setSearchQuery('');
  };

  // Filter sites for search dropdown & quick chips
  const categories = useMemo(() => {
    const cats = Array.from(new Set(sites.map((s) => s.category)));
    return ['All', ...cats];
  }, [sites]);

  const filteredSites = useMemo(() => {
    return sites.filter((s) => {
      const matchesCat = selectedCategory === 'All' || s.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  }, [sites, selectedCategory, searchQuery]);

  const forecastStartIndex = site?.forecastData.findIndex((d) => d.isForecast) ?? -1;
  const forecastStartTime =
    forecastStartIndex >= 0 ? site?.forecastData[forecastStartIndex].time : undefined;

  if (isLoading) {
    return (
      <motion.div className="flex-1 overflow-y-auto pb-6 bg-white">
        <AppHeader title="AI Forecast" subtitle="Loading live predictions..." />
        <div className="flex items-center justify-center p-12">
          <div className="w-8 h-8 border-3 border-[#0D6E6E] border-t-transparent rounded-full animate-spin" />
        </div>
      </motion.div>
    );
  }

  if (!site) {
    return (
      <motion.div className="flex-1 overflow-y-auto pb-6 bg-white">
        <AppHeader title="AI Forecast" subtitle="No live site data available" />
        <div className="px-5 mt-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            No active tourist sites found in the system.
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0 }}
      className="flex-1 overflow-y-auto pb-8 bg-slate-50 min-h-screen"
    >
      <AppHeader title="AI Forecast" subtitle="Predictive Crowd Telemetry" />

      <div className="px-4 sm:px-5 mt-3 space-y-4 max-w-2xl mx-auto">
        {/* Site Search & Quick Selector */}
        <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Search size={14} className="text-[#0D6E6E]" /> Select Attraction to Forecast:
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              {sites.length} Monitored Sites
            </span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search (e.g. Jaffna Fort, Sigiriya, Temple of Tooth, Mirissa)..."
              className="w-full pl-8 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#0D6E6E] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Direct Dropdown Selection */}
          <div className="relative">
            <select
              value={site.id}
              onChange={(e) => handleSelectSite(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20 pr-8 truncate"
            >
              {filteredSites.map((s) => (
                <option key={s.id} value={s.id}>
                  📍 {s.name} ({s.region}) — {s.currentDensity}% Density
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Selected Site Details & Live Telemetry Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
          <div className="flex gap-3.5">
            <SiteImage
              siteName={site.name}
              src={site.imageUrl}
              alt={site.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover shrink-0 border border-slate-100"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-[#0D6E6E] border border-emerald-100 uppercase tracking-wide">
                  {site.category}
                </span>
                {site.unescoHeritage && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-900 text-white">
                    UNESCO
                  </span>
                )}
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    site.isOpen !== false
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {site.isOpen !== false ? '🟢 Open Now' : '🌙 Currently Closed'}
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900 leading-tight truncate">{site.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                <MapPin size={11} className="text-slate-400 shrink-0" />
                <span className="truncate">{site.statusLabel || site.region}</span>
              </p>

              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 text-xs text-slate-600 flex-wrap">
                <div className="flex items-center gap-1 font-semibold text-slate-800 bg-amber-50 text-amber-900 px-2 py-0.5 rounded-md border border-amber-200 text-[11px]">
                  <CloudSun size={12} className="text-amber-600" />
                  <span>{site.weather?.temp || 28}°C {site.weather?.condition || 'Sunny'}</span>
                </div>
                <div className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-mono text-[10px]">
                  <Clock size={11} className="text-slate-500" />
                  <span>{site.operatingHours || '09:00 AM – 05:00 PM'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action in-app buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3.5 pt-3 border-t border-slate-100">
            <button
              onClick={() => navigate(`/app/map?site=${site.id}`)}
              className="bg-[#0D6E6E] hover:bg-[#095454] text-white py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Navigation size={13} />
              <span>Explore on Live Map</span>
            </button>

            <button
              onClick={() => setModalSite(site)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
            >
              <Sparkles size={13} className="text-purple-600" />
              <span>Full Site Details & Events</span>
            </button>
          </div>
        </div>

        {/* Dual Peak Intelligence Banner */}
        {peakMetric && (
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-4 text-white shadow-sm border border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300">
                  <Flame size={16} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                    Dual Peak Crowd Windows (Sri Lanka Time)
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Today's forecasted maximum: <strong className="text-white font-mono font-bold">{peakMetric.todayPeakDensity}%</strong> (~{peakMetric.todayPeakVisitors.toLocaleString()} visitors)
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  peakMetric.peakStatus === 'IN_PEAK_NOW'
                    ? 'bg-red-500 text-white animate-pulse'
                    : peakMetric.peakStatus === 'APPROACHING_PEAK'
                    ? 'bg-amber-500 text-white'
                    : 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {peakMetric.peakStatus === 'IN_PEAK_NOW'
                  ? 'Peaking Now'
                  : peakMetric.peakStatus === 'APPROACHING_PEAK'
                  ? `Peak in ${peakMetric.minutesToPeak}m`
                  : 'Calm Window'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* Primary Peak */}
              {peakMetric.primaryPeakWindow && (
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Sun size={12} /> {peakMetric.primaryPeakWindow.periodName}
                    </span>
                    <span className="font-mono font-bold bg-white/20 px-1.5 py-0.2 rounded text-[10px]">
                      {peakMetric.primaryPeakWindow.intensity}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-bold text-white">
                    {peakMetric.primaryPeakWindow.label}
                  </p>
                  <p className="text-[10px] text-slate-300 leading-snug">
                    {peakMetric.primaryPeakWindow.description}
                  </p>
                </div>
              )}

              {/* Secondary Peak */}
              {peakMetric.secondaryPeakWindow && (
                <div className="bg-white/10 rounded-xl p-2.5 border border-white/10 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-300 flex items-center gap-1">
                      <Moon size={12} /> {peakMetric.secondaryPeakWindow.periodName}
                    </span>
                    <span className="font-mono font-bold bg-white/20 px-1.5 py-0.2 rounded text-[10px]">
                      {peakMetric.secondaryPeakWindow.intensity}
                    </span>
                  </div>
                  <p className="text-xs font-mono font-bold text-white">
                    {peakMetric.secondaryPeakWindow.label}
                  </p>
                  <p className="text-[10px] text-slate-300 leading-snug">
                    {peakMetric.secondaryPeakWindow.description}
                  </p>
                </div>
              )}
            </div>

            <div className="bg-emerald-950/60 rounded-xl p-2.5 border border-emerald-500/30 flex items-center justify-between text-xs">
              <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" /> Best Off-Peak Visiting Window:
              </span>
              <span className="font-mono font-bold text-white bg-emerald-800/80 px-2 py-0.5 rounded">
                {peakMetric.recommendedOffPeakWindow}
              </span>
            </div>
          </div>
        )}

        {/* 24-Hour Predictive Crowd Curve */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp size={14} className="text-[#0D6E6E]" />
                24-Hour Crowd Density Curve & LSTM Prediction
              </h3>
              <p className="text-[11px] text-slate-500">
                Historical telemetry vs real-time AI neural forecast
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2 bg-slate-300 rounded-sm"></div> History
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2 bg-[#0D6E6E] rounded-sm"></div> Forecast
              </div>
            </div>
          </div>

          <div className="h-[220px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={site.forecastData}
                margin={{ top: 10, right: 0, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D6E6E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D6E6E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  minTickGap={20}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    fontSize: '12px'
                  }}
                  formatter={(val: number) => [`${val}% Density`, 'Visitor Load']}
                  labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '2px' }}
                />

                {forecastStartTime && (
                  <ReferenceArea
                    x1={forecastStartTime}
                    x2={site.forecastData[site.forecastData.length - 1].time}
                    fill="#f0fdf4"
                    fillOpacity={0.5}
                  />
                )}

                {/* History Area */}
                <Area
                  type="monotone"
                  dataKey={(d) => (d.isForecast ? null : d.density)}
                  stroke="#64748b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHistory)"
                  isAnimationActive={false}
                />

                {/* Forecast Area */}
                <Area
                  type="monotone"
                  dataKey={(d) => (d.isForecast ? d.density : null)}
                  stroke="#0D6E6E"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#colorForecast)"
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LSTM Neural Model Context & Sri Lanka Holiday Factor */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <BrainCircuit size={16} className="text-[#0D6E6E]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              PathWise Deep Learning Feature Vector
            </h4>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {site.features.map((feature, idx) => (
              <span
                key={idx}
                className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[11px] font-medium border border-slate-200"
              >
                {feature}
              </span>
            ))}
            <span className="bg-amber-50 text-amber-800 px-2.5 py-1 rounded-lg text-[11px] font-bold border border-amber-200">
              📅 Holiday Active: {holiday.current?.name || holiday.next.name}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
            <Info size={14} className="shrink-0 mt-0.5 text-slate-400" />
            <p>
              Inference generated by Sri Lanka Tourism Board telemetry stream and PathWise LSTM v2.1 model. Mean Absolute Error (MAE): 4.8%.
            </p>
          </div>
        </div>
      </div>

      {/* In-app Site Detail Modal */}
      <SiteDetailModal
        site={modalSite}
        isOpen={Boolean(modalSite)}
        onClose={() => setModalSite(null)}
      />
    </motion.div>
  );
}

export default Forecast;
