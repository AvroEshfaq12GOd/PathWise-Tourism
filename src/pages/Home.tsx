import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  Sparkles } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
export function Home() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<LiveSite[]>([]);
  const [nudges, setNudges] = useState<LiveNudge[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto pb-6">
        <AppHeader title="Loading live data" subtitle="Connecting to backend" />
        <div className="px-5 pt-8 space-y-4">
          <div className="h-28 rounded-3xl bg-slate-100 animate-pulse" />
          <div className="h-40 rounded-3xl bg-slate-100 animate-pulse" />
          <div className="h-40 rounded-3xl bg-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!currentSite) {
    return (
      <div className="flex-1 overflow-y-auto pb-6">
        <AppHeader title="No live data yet" subtitle="Backend is reachable, but no current observations were returned" />
        <div className="px-5 pt-8 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
            <p className="text-sm font-semibold text-slate-900">Live refresh is warming up</p>
            <p className="mt-1 text-sm text-slate-500">
              The backend now refreshes crowd data in the background. If this message stays here, the live API or database has no active records yet.
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      exit={{
        opacity: 0
      }}
      className="flex-1 overflow-y-auto pb-6">
      
      <AppHeader title="Good afternoon," subtitle="Exploring Kandy" />

      <div className="px-5 space-y-6 mt-2">
        {/* Context Strip */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm text-xs text-slate-600 whitespace-nowrap border border-slate-100">
            <CloudSun size={14} className="text-amber-500" />
            <span>{currentSite.weather.temp}°C {currentSite.weather.condition}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm text-xs text-slate-600 whitespace-nowrap border border-slate-100">
            <Calendar size={14} className="text-brand-500" />
            <span>Public Holiday</span>
          </div>
        </div>

        {/* Main Status Card */}
        <div className="bg-white rounded-3xl p-6 shadow-soft border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-full blur-3xl -mr-10 -mt-10"></div>

          <div className="flex justify-between items-start relative z-10">
            <div>
              <div className="flex items-center gap-1.5 text-brand-700 mb-1">
                <MapPin size={16} />
                <span className="text-sm font-semibold">Current Location</span>
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900 leading-tight w-48">
                {currentSite.name}
              </h2>
            </div>
            <div className="bg-slate-50 p-2 rounded-2xl">
              <CrowdGauge
                percentage={currentSite.currentDensity}
                size={80}
                strokeWidth={8} />
              
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 relative z-10">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <TrendingUp size={16} className="text-red-500" />
              <span>
                {currentSite.trend === 'up'
                  ? 'Congestion rising'
                  : currentSite.trend === 'down'
                    ? 'Congestion easing'
                    : 'Crowd levels stable'}
              </span>
            </div>
            <button
              onClick={() => navigate('/forecast')}
              className="text-brand-700 text-sm font-semibold flex items-center gap-1">
              
              View Forecast <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Smart Suggestion Banner */}
        {activeNudge && altSite &&
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.95
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          transition={{
            delay: 0.2
          }}
          className="bg-gradient-to-br from-brand-700 to-brand-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <Sparkles size={64} />
            </div>
            <div className="flex items-center gap-2 text-brand-200 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Smart Suggestion
            </div>
            <p className="text-sm text-brand-50 mb-4 leading-relaxed pr-8">
              {activeNudge.reason} Visit{' '}
              <strong className="text-white">{altSite.name}</strong> instead and
              earn{' '}
              <strong className="text-amber-400">
                {activeNudge.incentive}
              </strong>
              .
            </p>
            <div className="flex gap-3">
              <button className="bg-white text-brand-900 px-4 py-2 rounded-xl text-sm font-bold flex-1 shadow-sm">
                Accept Route
              </button>
              <button className="bg-brand-800 text-white px-4 py-2 rounded-xl text-sm font-medium border border-brand-600">
                Dismiss
              </button>
            </div>
          </motion.div>
        }

        {/* Nearby Attractions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-display font-bold text-slate-900">
              Nearby Attractions
            </h3>
            <button className="text-brand-700 text-sm font-medium">
              See all
            </button>
          </div>

          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-4 -mx-5 px-5">
            {sites.slice(1).map((site) =>
            <div
              key={site.id}
              className="min-w-[160px] bg-white rounded-2xl p-3 shadow-soft border border-slate-100 flex-shrink-0">
              
                <div className="h-24 rounded-xl mb-3 bg-slate-200 overflow-hidden relative">
                  <img
                  src={site.imageUrl}
                  alt={site.name}
                  className="w-full h-full object-cover" />
                
                  <div className="absolute top-2 right-2">
                    <CrowdBadge density={site.currentDensity} />
                  </div>
                </div>
                <h4 className="font-semibold text-slate-900 text-sm truncate">
                  {site.name}
                </h4>
                <p className="text-xs text-slate-500 mt-1">{site.category}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>);

}