import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveSite } from '../lib/api';
import { SiteImage } from '../lib/siteImages';
import { getSiteDeepDetails } from '../data/siteDetailsData';
import { useSriLankaSync } from '../context/SriLankaSyncContext';
import { calculateSitePeakMetric, SitePeakCrowdMetric } from '../lib/peakCrowdEngine';
import {
  X,
  Navigation,
  ExternalLink,
  MapPin,
  Clock,
  Sun,
  CloudRain,
  Compass,
  Footprints,
  Sparkles,
  Calendar,
  Info,
  ShieldCheck,
  TrendingUp,
  Train,
  Car,
  Bike,
  AlertTriangle,
  CheckCircle2,
  Share2,
  Copy,
  ChevronRight,
  Flame,
  Layers,
  Thermometer,
  Wind,
  Droplets,
  Award,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SiteDetailModalProps {
  site: LiveSite | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSite?: (siteId: string) => void;
}

export function SiteDetailModal({ site, isOpen, onClose, onSelectSite }: SiteDetailModalProps) {
  const navigate = useNavigate();
  const { timeState, weatherMap, sites } = useSriLankaSync();
  const [activeTab, setActiveTab] = useState<'peaks' | 'routing' | 'paths' | 'events' | 'info'>('peaks');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('colombo');
  const [copiedCoords, setCopiedCoords] = useState(false);
  const [activeWaypoint, setActiveWaypoint] = useState<number | null>(null);

  const deepDetails = useMemo(() => {
    if (!site) return null;
    return getSiteDeepDetails(site.id, site.name, site.region, site.category);
  }, [site]);

  const peakMetric = useMemo(() => {
    if (!site) return null;
    return calculateSitePeakMetric(site);
  }, [site]);

  if (!isOpen || !site || !deepDetails || !peakMetric) return null;

  // Real-time live weather calculation
  const siteWeather = weatherMap[site.id] || site.weather || { temp: 28, condition: 'Sunny' };

  // Coordinates formatting
  const coordsString = `${site.lat.toFixed(4)}, ${site.lng.toFixed(4)}`;

  // Origins for routing simulation
  const ORIGINS: Record<string, { name: string; lat: number; lng: number; desc: string }> = {
    colombo: { name: 'Colombo Fort Station / City Center', lat: 6.9344, lng: 79.8500, desc: 'Western Province Hub' },
    airport: { name: 'Bandaranaike Int\'l Airport (CMB)', lat: 7.1808, lng: 79.8841, desc: 'Katunayake Entry Hub' },
    kandy: { name: 'Kandy Railway Station', lat: 7.2906, lng: 80.6337, desc: 'Central Highlands' },
    galle: { name: 'Galle Fort / Southern Coast', lat: 6.0329, lng: 80.2168, desc: 'Southern Highway' },
    ella: { name: 'Ella Town / Train Station', lat: 6.8667, lng: 81.0466, desc: 'Hill Country Trailhead' }
  };

  const originData = ORIGINS[selectedOrigin] || ORIGINS.colombo;

  // Approximate distance calculation using Haversine formula
  const getDistanceFromOrigin = () => {
    const R = 6371; // Earth radius in km
    const dLat = ((site.lat - originData.lat) * Math.PI) / 180;
    const dLon = ((site.lng - originData.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((originData.lat * Math.PI) / 180) *
        Math.cos((site.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightKm = R * c;
    const roadKm = Math.round(straightKm * 1.35); // Road winding factor
    const roadHours = (roadKm / 45).toFixed(1);
    return { roadKm, roadHours };
  };

  const { roadKm, roadHours } = getDistanceFromOrigin();

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText(coordsString);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2500);
  };

  const googleMapsRouteUrl = `https://www.google.com/maps/dir/?api=1&origin=${originData.lat},${originData.lng}&destination=${site.lat},${site.lng}&travelmode=driving`;
  const googleMapsDirectUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.name + ', Sri Lanka')}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm overflow-hidden">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose} />

        {/* Modal Container */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="relative w-full max-w-lg max-h-[92vh] bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl flex flex-col overflow-hidden z-10 border border-slate-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Sticky Header with Close */}
          <div className="relative h-44 sm:h-52 w-full shrink-0 bg-slate-900 overflow-hidden">
            <SiteImage
              siteName={site.name}
              src={site.imageUrl}
              alt={site.name}
              className="w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

            {/* Top action buttons */}
            <div className="absolute top-3 inset-x-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-1.5">
                {site.unescoHeritage && (
                  <span className="bg-blue-900/90 text-blue-100 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-blue-500 shadow-md backdrop-blur-sm flex items-center gap-1">
                    <Award size={12} className="text-amber-300" /> UNESCO World Heritage
                  </span>
                )}
                <span className="bg-emerald-950/80 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded-full border border-emerald-600 backdrop-blur-sm">
                  Verified Attraction
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCoords}
                  title="Copy Lat/Lng Coordinates"
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md border border-white/20 transition-all active:scale-95"
                >
                  {copiedCoords ? <CheckCircle2 size={15} className="text-emerald-400" /> : <Copy size={15} />}
                </button>
                <button
                  onClick={onClose}
                  className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md border border-white/20 transition-all active:scale-95"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Bottom Hero Meta */}
            <div className="absolute bottom-3 inset-x-4 text-white z-20">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 bg-emerald-900/80 px-2 py-0.5 rounded border border-emerald-600">
                  {site.category}
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <MapPin size={12} className="text-amber-400" /> {site.region} Province
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold leading-tight drop-shadow-md">
                {site.name}
              </h2>
              <p className="text-xs text-slate-200 line-clamp-1 font-light opacity-90">
                {deepDetails.tagline}
              </p>
            </div>
          </div>

          {/* Real-time Status Strip (Hours, Live Weather, Density) */}
          <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between border-b border-slate-800 text-xs shrink-0">
            {/* Hours status */}
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  site.isOpen !== false ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'
                }`}
              />
              <span className="font-semibold text-slate-200">
                {site.isOpen !== false ? 'Open Now' : 'Closed for Evening'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                ({site.operatingHours || '09:00 AM – 05:00 PM'})
              </span>
            </div>

            {/* Live Weather & Density */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-slate-800/90 text-amber-300 px-2 py-0.5 rounded-full font-medium text-[11px] border border-slate-700">
                <Sun size={12} className="text-amber-400" />
                <span>{siteWeather.temp}°C {siteWeather.condition}</span>
              </div>

              {/* Density Badge */}
              <div
                className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                  site.currentDensity >= 85
                    ? 'bg-rose-900/80 text-rose-200 border border-rose-700'
                    : site.currentDensity >= 60
                    ? 'bg-amber-900/80 text-amber-200 border border-amber-700'
                    : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                }`}
              >
                {site.isOpen === false ? '0% (Night)' : `${Math.round(site.currentDensity)}% Crowd`}
              </div>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div className="flex border-b border-slate-200 bg-slate-50/80 px-2 pt-1.5 shrink-0 overflow-x-auto hide-scrollbar">
            <button
              onClick={() => setActiveTab('peaks')}
              className={`flex-1 min-w-[100px] py-2 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-all ${
                activeTab === 'peaks'
                  ? 'border-[#0D6E6E] text-[#0D6E6E] bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Flame size={13} className={peakMetric.peakStatus === 'IN_PEAK_NOW' ? 'text-red-500 animate-pulse' : 'text-amber-500'} />
              <span>2 Peak Hours</span>
            </button>

            <button
              onClick={() => setActiveTab('routing')}
              className={`flex-1 min-w-[100px] py-2 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-all ${
                activeTab === 'routing'
                  ? 'border-[#0D6E6E] text-[#0D6E6E] bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Navigation size={13} />
              <span>Directions</span>
            </button>

            <button
              onClick={() => setActiveTab('paths')}
              className={`flex-1 min-w-[100px] py-2 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-all ${
                activeTab === 'paths'
                  ? 'border-[#0D6E6E] text-[#0D6E6E] bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Footprints size={13} />
              <span>Paths</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`flex-1 min-w-[100px] py-2 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-all ${
                activeTab === 'events'
                  ? 'border-[#0D6E6E] text-[#0D6E6E] bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sparkles size={13} />
              <span>Events</span>
            </button>

            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 min-w-[90px] py-2 text-xs font-bold flex items-center justify-center gap-1 border-b-2 transition-all ${
                activeTab === 'info'
                  ? 'border-[#0D6E6E] text-[#0D6E6E] bg-white rounded-t-lg shadow-2xs'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Info size={13} />
              <span>Guide</span>
            </button>
          </div>

          {/* Tab Content Body (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40 text-slate-800">
            {/* TAB: PEAK HOURS & CROWD DYNAMICS (2 PEAKS PER DAY) */}
            {activeTab === 'peaks' && (
              <div className="space-y-4">
                {/* Live Peak Status Banner */}
                <div
                  className={`p-3.5 rounded-2xl border shadow-xs flex items-start justify-between gap-3 ${
                    peakMetric.peakStatus === 'IN_PEAK_NOW'
                      ? 'bg-rose-50 border-rose-200 text-rose-950'
                      : peakMetric.peakStatus === 'APPROACHING_PEAK'
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : peakMetric.peakStatus === 'CLOSED'
                      ? 'bg-slate-100 border-slate-200 text-slate-800'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        peakMetric.peakStatus === 'IN_PEAK_NOW'
                          ? 'bg-rose-600 text-white'
                          : peakMetric.peakStatus === 'APPROACHING_PEAK'
                          ? 'bg-amber-500 text-white'
                          : peakMetric.peakStatus === 'CLOSED'
                          ? 'bg-slate-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      <Clock size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-white/80 border">
                          {peakMetric.peakStatus === 'IN_PEAK_NOW'
                            ? '⚡ Active Peak Window'
                            : peakMetric.peakStatus === 'APPROACHING_PEAK'
                            ? '⏳ Approaching Peak'
                            : peakMetric.peakStatus === 'CLOSED'
                            ? '🌙 After Hours'
                            : '✨ Low-Crowd Window'}
                        </span>
                        <span className="text-xs font-bold">
                          {peakMetric.peakStatus === 'IN_PEAK_NOW'
                            ? peakMetric.activePeakWindow?.periodName || 'High Influx Period'
                            : peakMetric.peakStatus === 'APPROACHING_PEAK'
                            ? `Peak starting in ~${peakMetric.minutesToPeak} mins`
                            : peakMetric.peakStatus === 'CLOSED'
                            ? 'Site is currently closed'
                            : 'Optimal Time to Visit'}
                        </span>
                      </div>
                      <p className="text-xs mt-1 leading-snug opacity-90">
                        {peakMetric.peakStatus === 'IN_PEAK_NOW'
                          ? `Currently in the busiest daily window (${peakMetric.activePeakWindow?.label}). Expect elevated queues.`
                          : peakMetric.peakStatus === 'APPROACHING_PEAK'
                          ? `Upcoming rush (${peakMetric.nextUpcomingPeakWindow?.label}): ${peakMetric.nextUpcomingPeakWindow?.periodName}.`
                          : peakMetric.peakStatus === 'CLOSED'
                          ? `Daily operating window: ${site.operatingHours || '09:00 AM – 05:00 PM'}.`
                          : `Great timing! Current congestion is calm (${Math.round(site.currentDensity)}%).`}
                      </p>
                    </div>
                  </div>
                </div>

                {/* The 2 Daily Peak Windows Cards */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Flame size={14} className="text-red-500" />
                      Daily Peak Hours (2 Waves Today):
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Based on Sri Lankan seasonal flow
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* Peak Window 1 */}
                    <div
                      className={`bg-white rounded-2xl p-3.5 border transition-all shadow-soft space-y-2 ${
                        peakMetric.primaryPeakWindow.isCurrentlyActive
                          ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          1st Daily Peak
                        </span>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            peakMetric.primaryPeakWindow.isCurrentlyActive
                              ? 'bg-rose-100 text-rose-800 animate-pulse'
                              : peakMetric.primaryPeakWindow.isUpcomingToday
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {peakMetric.primaryPeakWindow.isCurrentlyActive
                            ? 'Active Now'
                            : peakMetric.primaryPeakWindow.isUpcomingToday
                            ? 'Upcoming'
                            : 'Passed Today'}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-900 leading-snug">
                          {peakMetric.primaryPeakWindow.periodName}
                        </div>
                        <div className="text-xs font-mono font-bold text-[#0D6E6E] mt-0.5">
                          {peakMetric.primaryPeakWindow.label}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-1.5">
                        {peakMetric.primaryPeakWindow.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                        <span>Intensity:</span>
                        <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded">
                          {peakMetric.primaryPeakWindow.intensity} Surge
                        </span>
                      </div>
                    </div>

                    {/* Peak Window 2 (if available) */}
                    {peakMetric.secondaryPeakWindow ? (
                      <div
                        className={`bg-white rounded-2xl p-3.5 border transition-all shadow-soft space-y-2 ${
                          peakMetric.secondaryPeakWindow.isCurrentlyActive
                            ? 'border-rose-400 ring-2 ring-rose-100 bg-rose-50/20'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-900 border border-purple-200">
                            2nd Daily Peak
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                              peakMetric.secondaryPeakWindow.isCurrentlyActive
                                ? 'bg-rose-100 text-rose-800 animate-pulse'
                                : peakMetric.secondaryPeakWindow.isUpcomingToday
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {peakMetric.secondaryPeakWindow.isCurrentlyActive
                              ? 'Active Now'
                              : peakMetric.secondaryPeakWindow.isUpcomingToday
                              ? 'Upcoming'
                              : 'Passed Today'}
                          </span>
                        </div>

                        <div>
                          <div className="text-xs font-bold text-slate-900 leading-snug">
                            {peakMetric.secondaryPeakWindow.periodName}
                          </div>
                          <div className="text-xs font-mono font-bold text-[#0D6E6E] mt-0.5">
                            {peakMetric.secondaryPeakWindow.label}
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 leading-relaxed border-t border-slate-100 pt-1.5">
                          {peakMetric.secondaryPeakWindow.description}
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                          <span>Intensity:</span>
                          <span className="font-bold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded">
                            {peakMetric.secondaryPeakWindow.intensity} Surge
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-soft flex flex-col justify-center text-center space-y-1">
                        <span className="text-xs font-bold text-slate-700">Continuous Daylight Flow</span>
                        <p className="text-[11px] text-slate-500">
                          This site operates on a single primary peak window with steady daytime dispersal.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 24-Hour Bimodal Crowd Curve Visualizer */}
                <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-[#0D6E6E]" />
                        24-Hour Crowd Density Wave (Both Peaks)
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        Hourly carrying capacity load curve across the full day
                      </p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                      Cap: {site.maxCapacity} ppl
                    </span>
                  </div>

                  {/* Hourly Bar Curve */}
                  <div className="pt-2">
                    <div className="flex items-end gap-1 h-28 w-full border-b border-slate-200 pb-1">
                      {peakMetric.hourlyCurve
                        .filter((h) => h.hour >= 5 && h.hour <= 22)
                        .map((pt) => {
                          const isCurrentHour = pt.isCurrent;
                          const heightPct = Math.max(8, pt.density);
                          return (
                            <div
                              key={pt.hour}
                              className="flex-1 flex flex-col items-center justify-end h-full group relative"
                            >
                              {/* Hover Tooltip */}
                              <div className="absolute -top-10 hidden group-hover:flex flex-col items-center z-30 pointer-events-none bg-slate-900 text-white text-[9px] px-2 py-1 rounded-lg shadow-lg whitespace-nowrap">
                                <span className="font-bold">{pt.timeLabel}</span>
                                <span>{pt.density}% density ({pt.visitors} ppl)</span>
                                {pt.isPeak && <span className="text-amber-300">Peak Window {pt.peakNumber || ''}</span>}
                              </div>

                              {/* Current Hour Indicator Pin */}
                              {isCurrentHour && (
                                <div className="absolute -top-3 w-2 h-2 rounded-full bg-red-500 animate-ping" />
                              )}

                              {/* Bar */}
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={`w-full rounded-t-md transition-all ${
                                  isCurrentHour
                                    ? 'bg-red-500 shadow-sm'
                                    : pt.isPeak
                                    ? 'bg-amber-400 group-hover:bg-amber-500'
                                    : pt.density > 0
                                    ? 'bg-emerald-400/80 group-hover:bg-emerald-500'
                                    : 'bg-slate-200'
                                }`}
                              />
                            </div>
                          );
                        })}
                    </div>

                    {/* Hour Labels */}
                    <div className="flex justify-between text-[9px] text-slate-400 font-mono pt-1.5 px-0.5">
                      <span>06:00 AM (Dawn)</span>
                      <span>12:00 PM (Midday)</span>
                      <span>06:00 PM (Dusk)</span>
                      <span>10:00 PM</span>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 text-[10px] text-slate-500 pt-2 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-red-500" />
                        <span>Current Hour</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                        <span>Peak Windows (1 & 2)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                        <span>Optimal Off-Peak</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Best Off-Peak Window Recommendation */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 space-y-1.5 text-emerald-950">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <Sparkles size={14} className="text-emerald-700" />
                      Recommended Off-Peak Visiting Window
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                      +75 PathPoints
                    </span>
                  </div>
                  <p className="text-xs font-bold text-emerald-900">
                    🕒 {peakMetric.recommendedOffPeakWindow}
                  </p>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Visiting between the 2 daily peak surges offers significantly shorter wait times, cooler conditions, pristine photography lighting, and rewards you with smart dispersal travel tokens.
                  </p>
                </div>

                {/* Alternative Site Suggestion */}
                {peakMetric.suggestedAlternativeSite && (
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-soft space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Compass size={14} className="text-[#0D6E6E]" />
                        Crowd-Relief Alternative Nearby:
                      </span>
                      <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                        Low Congestion
                      </span>
                    </div>

                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <strong className="text-xs text-slate-900 block font-bold">
                          {peakMetric.suggestedAlternativeSite}
                        </strong>
                        <span className="text-[10px] text-slate-500">
                          Recommended alternate spot during peak hours
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          const targetSite = sites.find(
                            (s) =>
                              s.name.toLowerCase().includes(peakMetric.suggestedAlternativeSite.toLowerCase().split(' ')[0]) ||
                              peakMetric.suggestedAlternativeSite.toLowerCase().includes(s.name.toLowerCase())
                          );
                          if (targetSite && onSelectSite) {
                            onSelectSite(targetSite.id);
                          }
                        }}
                        className="bg-white hover:bg-slate-100 text-[#0D6E6E] border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors"
                      >
                        Explore
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 1: ROUTING & TRANSIT */}
            {activeTab === 'routing' && (
              <div className="space-y-4">
                {/* Origin Selector Card */}
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-soft">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Compass size={14} className="text-[#0D6E6E]" />
                      Select Starting Point / Origin:
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Target: {coordsString}
                    </span>
                  </div>

                  <select
                    value={selectedOrigin}
                    onChange={(e) => setSelectedOrigin(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0D6E6E]/20"
                  >
                    <option value="colombo">Colombo Fort Station (Western Hub)</option>
                    <option value="airport">Bandaranaike Int'l Airport CMB (Katunayake)</option>
                    <option value="kandy">Kandy Railway Station (Central Province)</option>
                    <option value="galle">Galle Fort (Southern Coast)</option>
                    <option value="ella">Ella Train Station (Uva Highlands)</option>
                  </select>

                  {/* Route Quick Stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                    <div className="bg-slate-50 rounded-xl p-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Distance</span>
                      <strong className="text-xs text-slate-800 font-bold">~{roadKm} km</strong>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-2">
                      <span className="text-[10px] text-slate-400 block font-medium">Drive ETA</span>
                      <strong className="text-xs text-slate-800 font-bold">~{roadHours} hrs</strong>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-2 border border-emerald-100">
                      <span className="text-[10px] text-emerald-700 block font-medium">Off-Peak Time</span>
                      <strong className="text-xs text-emerald-800 font-bold">Midday</strong>
                    </div>
                  </div>
                </div>

                {/* Primary In-App Map Navigation & Forecast Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/app/map?site=${site.id}`);
                    }}
                    className="flex-1 bg-[#0D6E6E] hover:bg-[#095454] text-white py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-transform active:scale-[0.98]"
                  >
                    <Navigation size={15} />
                    <span>Open In-App Map & GPS Route</span>
                  </button>

                  <button
                    onClick={() => {
                      onClose();
                      navigate(`/app/forecast?site=${site.id}`);
                    }}
                    className="px-3.5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-soft"
                    title="View AI Crowd Prediction"
                  >
                    <TrendingUp size={14} className="text-[#0D6E6E]" />
                    <span>AI Forecast</span>
                  </button>
                </div>

                <div className="text-right">
                  <a
                    href={googleMapsRouteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 hover:underline"
                  >
                    <span>External Google Maps directions</span>
                    <ExternalLink size={9} />
                  </a>
                </div>

                {/* Transit Options Breakdown */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Train size={14} className="text-[#0D6E6E]" />
                    Recommended Transportation Modes:
                  </h4>

                  {deepDetails.transitOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-soft space-y-1.5 hover:border-[#0D6E6E]/40 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-emerald-50 text-[#0D6E6E]">
                            {opt.mode === 'train' ? (
                              <Train size={14} />
                            ) : opt.mode === 'car' ? (
                              <Car size={14} />
                            ) : opt.mode === 'tuktuk' ? (
                              <Bike size={14} />
                            ) : (
                              <Footprints size={14} />
                            )}
                          </span>
                          <h5 className="text-xs font-bold text-slate-900">{opt.label}</h5>
                        </div>
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-mono">
                          {opt.duration}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed pl-8">
                        {opt.details}
                      </p>

                      <div className="flex items-center justify-between pl-8 pt-1 text-[10px] text-slate-500 border-t border-slate-100">
                        <span className="font-semibold text-emerald-700">
                          Highlight: {opt.routeHighlight}
                        </span>
                        <span className="font-mono font-medium text-slate-600">
                          {opt.costEstimate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: ORGANIZED PATHS & TRAILS */}
            {activeTab === 'paths' && (
              <div className="space-y-4">
                {/* Circuit Overview Card */}
                <div className="bg-gradient-to-br from-[#0D6E6E] to-[#074242] text-white rounded-2xl p-4 shadow-md">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-300 flex items-center gap-1">
                      <Compass size={12} /> Recommended Trail Circuit
                    </span>
                    <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                      {deepDetails.organizedCircuit.difficulty} Difficulty
                    </span>
                  </div>

                  <h3 className="text-base font-bold mb-1">
                    {deepDetails.organizedCircuit.circuitName}
                  </h3>
                  <p className="text-xs text-slate-100 opacity-90 leading-relaxed mb-3">
                    {deepDetails.organizedCircuit.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20 text-center">
                    <div className="bg-white/10 rounded-xl p-1.5">
                      <span className="text-[10px] text-emerald-200 block">Total Circuit Time</span>
                      <strong className="text-xs font-bold">
                        {deepDetails.organizedCircuit.totalDurationMin} Minutes
                      </strong>
                    </div>
                    <div className="bg-white/10 rounded-xl p-1.5">
                      <span className="text-[10px] text-emerald-200 block">Trail Length</span>
                      <strong className="text-xs font-bold">
                        {deepDetails.organizedCircuit.totalDistanceKm} Kilometers
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step Waypoint Flow */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Footprints size={14} className="text-[#0D6E6E]" />
                    Organized Waypoints & Landmark Sequence:
                  </h4>

                  <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
                    {deepDetails.organizedCircuit.waypoints.map((wp) => {
                      const isExpanded = activeWaypoint === wp.order;
                      return (
                        <div
                          key={wp.order}
                          onClick={() => setActiveWaypoint(isExpanded ? null : wp.order)}
                          className={`relative bg-white rounded-2xl p-3.5 border transition-all cursor-pointer shadow-2xs ${
                            isExpanded
                              ? 'border-[#0D6E6E] ring-2 ring-[#0D6E6E]/15'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {/* Dot indicator */}
                          <div className="absolute -left-6 top-3.5 w-5 h-5 rounded-full bg-[#0D6E6E] text-white text-[10px] font-bold flex items-center justify-center shadow-xs border-2 border-white">
                            {wp.order}
                          </div>

                          <div className="flex items-start justify-between gap-2">
                            <h5 className="text-xs font-bold text-slate-900 leading-snug">
                              {wp.name}
                            </h5>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span className="text-[10px] text-slate-500 font-mono">
                                {wp.durationMin}m • {wp.distanceMeters}m
                              </span>
                              <ChevronRight
                                size={13}
                                className={`text-slate-400 transition-transform ${
                                  isExpanded ? 'rotate-90 text-[#0D6E6E]' : ''
                                }`}
                              />
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
                            {wp.highlight}
                          </p>

                          {wp.tip && (
                            <div className="mt-2.5 bg-amber-50/80 border border-amber-200/70 rounded-xl p-2 flex items-start gap-1.5 text-[10px] text-amber-900">
                              <Sparkles size={12} className="text-amber-600 shrink-0 mt-0.5" />
                              <span>
                                <strong className="font-semibold">Ranger Tip:</strong> {wp.tip}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: FESTIVALS & LIVE EVENTS */}
            {activeTab === 'events' && (
              <div className="space-y-4">
                <div className="bg-purple-950 text-white rounded-2xl p-4 border border-purple-800 shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} className="text-purple-300" />
                    <h3 className="text-sm font-bold">
                      Cultural Calendar & Living Traditions
                    </h3>
                  </div>
                  <p className="text-xs text-purple-200 leading-relaxed">
                    Sri Lankan destinations experience significant crowd surges and ceremonial illuminations during Poya full moons, night pageants, and seasonal migrations.
                  </p>
                </div>

                <div className="space-y-3">
                  {deepDetails.festivalsAndEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl p-4 border border-slate-200 shadow-soft space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
                            {evt.type}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 mt-1.5">{evt.title}</h4>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            evt.status === 'Active Now'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-relaxed">{evt.description}</p>

                      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[10px]">
                        <span className="text-slate-500 font-medium flex items-center gap-1">
                          <Calendar size={11} className="text-purple-600" />
                          Season: <strong className="text-slate-800">{evt.seasonDate}</strong>
                        </span>
                        <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                          Impact: {evt.impactOnCrowd}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-xl text-[10px] text-slate-600 flex items-center gap-1.5">
                        <Clock size={11} className="text-[#0D6E6E]" />
                        <span>
                          Best Viewing Time: <strong>{evt.recommendedViewTime}</strong>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: VISITOR & ECO INFO */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                {/* Guidelines grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Dress code & etiquette */}
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-soft space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <ShieldCheck size={14} className="text-[#0D6E6E]" />
                      Dress Code & Entry Etiquette
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {deepDetails.dressCode || 'Standard modest attire recommended.'}
                    </p>
                  </div>

                  {/* Pricing & Tickets */}
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-soft space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                      <Award size={14} className="text-amber-600" />
                      Standard Entry Tariffs
                    </div>
                    <div className="text-[11px] text-slate-600 space-y-0.5 font-mono">
                      <div>Local Citizens: <strong>{deepDetails.entryFeeLocal}</strong></div>
                      <div>Foreign Travelers: <strong>{deepDetails.entryFeeForeign}</strong></div>
                    </div>
                  </div>
                </div>

                {/* Microclimate Weather Advice */}
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3.5 space-y-1.5 text-blue-950">
                  <div className="flex items-center gap-1.5 text-xs font-bold">
                    <Sun size={14} className="text-blue-700" />
                    Microclimate & Best Window
                  </div>
                  <p className="text-[11px] text-blue-900 leading-relaxed">
                    {deepDetails.weatherAdvice}
                  </p>
                  <p className="text-[10px] text-blue-800 font-semibold pt-1 border-t border-blue-200">
                    Optimal visiting window: {deepDetails.bestVisitingWindow}
                  </p>
                </div>

                {/* Eco-Tourism Guidelines */}
                <div className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-soft space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Responsible Sri Lanka Tourism Rules:
                  </h4>
                  <ul className="space-y-1.5 pl-1">
                    {deepDetails.ecoGuidelines.map((rule, idx) => (
                      <li key={idx} className="text-[11px] text-slate-600 flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Action Footer */}
          <div className="p-3.5 bg-white border-t border-slate-200 flex items-center justify-between gap-2.5 shrink-0">
            <button
              onClick={() => {
                onClose();
                navigate(`/app/forecast?site=${site.id}`);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
            >
              <TrendingUp size={14} className="text-[#0D6E6E]" />
              <span>AI Crowd Forecast</span>
            </button>

            <button
              onClick={() => {
                onClose();
                navigate(`/app/map?site=${site.id}`);
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#0D6E6E] hover:bg-[#095454] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-transform active:scale-95"
            >
              <Navigation size={14} />
              <span>In-App Live Map</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
