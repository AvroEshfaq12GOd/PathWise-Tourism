import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { getSitesLive, type LiveSite } from '../lib/api';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea } from
'recharts';
import { BrainCircuit, Info, ChevronDown } from 'lucide-react';
export function Forecast() {
  const [sites, setSites] = useState<LiveSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const liveSites = await getSitesLive();
        if (!mounted) return;
        setSites(liveSites);
        setSelectedSiteId((current) => current || liveSites[0]?.id || '');
      } catch {
        if (!mounted) return;
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

  const site = useMemo(
    () => sites.find((s) => s.id === selectedSiteId) || sites[0],
    [selectedSiteId, sites]
  );

  const forecastStartIndex = site?.forecastData.findIndex((d) => d.isForecast) ?? -1;
  const forecastStartTime =
  forecastStartIndex >= 0 ?
  site?.forecastData[forecastStartIndex].time :
  undefined;

  if (isLoading) {
    return (
      <motion.div className="flex-1 overflow-y-auto pb-6 bg-white">
        <AppHeader title="AI Forecast" subtitle="Loading live predictions" />
      </motion.div>
    );
  }

  if (!site) {
    return (
      <motion.div className="flex-1 overflow-y-auto pb-6 bg-white">
        <AppHeader title="AI Forecast" subtitle="No live site data available" />
        <div className="px-5 mt-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            The backend returned no active sites, so there is nothing to forecast yet.
          </div>
        </div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20
      }}
      animate={{
        opacity: 1,
        x: 0
      }}
      exit={{
        opacity: 0
      }}
      className="flex-1 overflow-y-auto pb-6 bg-white">
      
      <AppHeader title="AI Forecast" subtitle="Predictive Analysis" />

      <div className="px-5 mt-4">
        {/* Site Selector */}
        <div className="relative mb-6">
          <select
            value={selectedSiteId}
            onChange={(e) => setSelectedSiteId(e.target.value)}
            className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-3 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500">
            
            {sites.map((s) =>
            <option key={s.id} value={s.id}>
                {s.name}
              </option>
            )}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 top-3.5 text-slate-400 pointer-events-none" />
          
        </div>

        {/* Chart Area */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">
              24h Crowd Density
            </h3>
            <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-slate-300 rounded-full"></div>{' '}
                History
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-brand-500 rounded-full"></div>{' '}
                Prediction
              </div>
            </div>
          </div>

          <div className="h-[240px] w-full relative">
            {isLoading ?
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 rounded-xl z-10 backdrop-blur-sm">
                <BrainCircuit
                className="text-brand-500 animate-pulse mb-2"
                size={24} />
              
                <span className="text-xs font-medium text-brand-700">
                  Running LSTM Inference...
                </span>
              </div> :
            null}

            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={site.forecastData}
                margin={{
                  top: 10,
                  right: 0,
                  left: -20,
                  bottom: 0
                }}>
                
                <defs>
                  <linearGradient id="colorHistory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient
                    id="colorForecast"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1">
                    
                    <stop offset="5%" stopColor="#0D6E6E" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D6E6E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9" />
                
                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: '#64748b'
                  }}
                  minTickGap={30} />
                
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 10,
                    fill: '#64748b'
                  }}
                  domain={[0, 100]} />
                
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    fontSize: '12px'
                  }}
                  labelStyle={{
                    fontWeight: 'bold',
                    color: '#0f172a',
                    marginBottom: '4px'
                  }} />
                

                {forecastStartTime &&
                <ReferenceArea
                  x1={forecastStartTime}
                  x2={site.forecastData[site.forecastData.length - 1].time}
                  fill="#f0f9f9"
                  fillOpacity={0.5} />

                }

                {/* History Area */}
                <Area
                  type="monotone"
                  dataKey={(d) => d.isForecast ? null : d.density}
                  stroke="#64748b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHistory)"
                  isAnimationActive={false} />
                

                {/* Forecast Area */}
                <Area
                  type="monotone"
                  dataKey={(d) => d.isForecast ? d.density : null}
                  stroke="#0D6E6E"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1}
                  fill="url(#colorForecast)"
                  isAnimationActive={!isLoading} />
                
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LSTM Features */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
          <div className="flex items-center gap-2 mb-3">
            <BrainCircuit size={16} className="text-brand-600" />
            <h4 className="text-sm font-bold text-slate-800">Model Inputs</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {site.features.map((feature, idx) =>
            <span
              key={idx}
              className="bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 border border-slate-200 shadow-sm">
              
                {feature}
              </span>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-500">
            <Info size={14} className="flex-shrink-0 mt-0.5 text-slate-400" />
            <p>
              Predictions generated by PathWise LSTM v2.1. Mean Absolute Error (MAE) on validation set: 6.2%.
            </p>
          </div>
        </div>
      </div>
    </motion.div>);

}