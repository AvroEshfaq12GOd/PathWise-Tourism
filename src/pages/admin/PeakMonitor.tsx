import React, { useState, useMemo } from 'react';
import { useSriLankaSync } from '../../context/SriLankaSyncContext';
import { calculateSitePeakMetric, calculateNationalPeakSummary, SitePeakCrowdMetric } from '../../lib/peakCrowdEngine';
import { getSriLankaTime } from '../../lib/sriLankaContext';
import {
  Flame,
  Clock,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  CheckCircle2,
  Filter,
  BarChart3,
  SlidersHorizontal,
  ChevronDown,
  Search,
  X
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

export function PeakMonitor() {
  const { sites, refreshAll } = useSriLankaSync();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<'all' | 'in_peak' | 'approaching' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const sl = getSriLankaTime();
  const summary = useMemo(() => calculateNationalPeakSummary(sites), [sites]);

  const activeMetrics = useMemo(() => {
    return summary.metrics.filter((m) => {
      const matchSearch =
        !searchQuery.trim() ||
        m.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.siteId.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchSearch) return false;
      if (selectedTab === 'in_peak') return m.peakStatus === 'IN_PEAK_NOW';
      if (selectedTab === 'approaching') return m.peakStatus === 'APPROACHING_PEAK';
      if (selectedTab === 'critical') return m.surgeRiskLevel === 'CRITICAL' || m.isBreachedNow;
      return true;
    });
  }, [summary.metrics, selectedTab, searchQuery]);

  const currentSelectedMetric = useMemo(() => {
    if (selectedSiteId) {
      return summary.metrics.find((m) => m.siteId === selectedSiteId) || summary.metrics[0];
    }
    return summary.sitesInPeakNow[0] || summary.sitesApproachingPeak[0] || summary.metrics[0];
  }, [selectedSiteId, summary]);

  const handleTriggerNudge = (siteName: string, altSite: string) => {
    setToastMsg(`Alternative diversion nudge dispatched to all tourists for ${siteName} -> ${altSite}. (+150 PathPoints active)`);
    setTimeout(() => setToastMsg(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Daily Peak Hours & Carrying Capacity Command Hub
            </h1>
            <span className="bg-red-100 text-red-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-red-300 flex items-center gap-1">
              <Flame size={12} /> Live Peak Tracker
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time daily peak crowd telemetry, scheduled peak windows, hourly load curves, and automated diversion triggers.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-900 text-white px-4 py-2 rounded-xl text-xs">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Sri Lanka Time</span>
            <span className="font-mono font-bold text-amber-300 text-sm">{sl.timeStr}</span>
          </div>
          <div className="h-6 w-px bg-slate-700"></div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Peak Status</span>
            <span className="font-bold text-emerald-400">{summary.sitesInPeakNow.length} Sites Peaking Now</span>
          </div>
        </div>
      </div>

      {/* Top Triage KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* In Peak Now */}
        <div
          onClick={() => setSelectedTab('in_peak')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedTab === 'in_peak'
              ? 'bg-red-50 border-red-300 ring-2 ring-red-400'
              : 'bg-white border-slate-200 hover:border-red-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-700 flex items-center gap-1">
              <Flame size={14} className="text-red-600 animate-pulse" /> Sites In Peak Now
            </span>
            <span className="text-2xl font-mono font-black text-red-600">{summary.sitesInPeakNow.length}</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {summary.sitesInPeakNow.length > 0
              ? summary.sitesInPeakNow.map((s) => s.siteName).slice(0, 2).join(', ') + (summary.sitesInPeakNow.length > 2 ? '...' : '')
              : 'No sites currently at peak hour.'}
          </p>
        </div>

        {/* Approaching Peak */}
        <div
          onClick={() => setSelectedTab('approaching')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedTab === 'approaching'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
              <Clock size={14} className="text-amber-600" /> Approaching Peak (&lt;2h)
            </span>
            <span className="text-2xl font-mono font-black text-amber-600">{summary.sitesApproachingPeak.length}</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            {summary.sitesApproachingPeak.length > 0
              ? summary.sitesApproachingPeak.map((s) => `${s.siteName} (${s.minutesToPeak}m)`).slice(0, 2).join(', ')
              : 'No sites approaching peak in the next 2 hours.'}
          </p>
        </div>

        {/* Critical Breach Risk */}
        <div
          onClick={() => setSelectedTab('critical')}
          className={`p-4 rounded-xl border cursor-pointer transition-all ${
            selectedTab === 'critical'
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400'
              : 'bg-white border-slate-200 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1">
              <AlertTriangle size={14} className="text-purple-600" /> Critical Capacity Surge
            </span>
            <span className="text-2xl font-mono font-black text-purple-600">{summary.criticalBreachSites.length}</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Predicted to reach &gt;85% carrying capacity today.
          </p>
        </div>
      </div>

      {/* Main Interactive Grid: Selected Site 24-Hour Peak Curve & Control Panel */}
      {currentSelectedMetric && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {currentSelectedMetric.region} Region
                </span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  {currentSelectedMetric.category}
                </span>
                {currentSelectedMetric.peakStatus === 'IN_PEAK_NOW' && (
                  <span className="text-[10px] font-extrabold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded flex items-center gap-1">
                    <Flame size={10} /> Active Peak Window
                  </span>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900 mt-1">
                {currentSelectedMetric.siteName}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Max Carrying Capacity: <strong>{currentSelectedMetric.maxCapacity.toLocaleString()} visitors</strong> • Threshold: <strong>{currentSelectedMetric.threshold}%</strong> • Critical: <strong>{currentSelectedMetric.criticalThreshold}%</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Daily Peak Window</span>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                  <Clock size={13} className="text-[#0D6E6E]" /> {currentSelectedMetric.peakWindowLabel}
                </span>
              </div>

              <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-amber-700 block">Today's Peak Level</span>
                <span className="text-sm font-mono font-black text-amber-900">
                  {currentSelectedMetric.todayPeakDensity}% (~{currentSelectedMetric.todayPeakVisitors.toLocaleString()} visitors)
                </span>
              </div>

              <button
                onClick={() => handleTriggerNudge(currentSelectedMetric.siteName, currentSelectedMetric.suggestedAlternativeSite)}
                className="bg-[#0D6E6E] hover:bg-[#095454] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-transform active:scale-95"
              >
                <Send size={13} />
                <span>Deploy Diversion Nudge</span>
              </button>
            </div>
          </div>

          {/* 24-Hour Projected Load Curve Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5">
                <BarChart3 size={15} className="text-[#0D6E6E]" />
                <span>24-Hour Density Profile & Peak Window Today (SLST)</span>
              </span>
              <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded bg-emerald-500"></div> Forecast Density
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-1 bg-amber-500"></div> Nudge Threshold ({currentSelectedMetric.threshold}%)
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-1 bg-red-500"></div> Critical Cap ({currentSelectedMetric.criticalThreshold}%)
                </span>
              </div>
            </div>

            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={currentSelectedMetric.hourlyCurve}>
                  <defs>
                    <linearGradient id="peakDensityGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D6E6E" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0D6E6E" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="timeLabel" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const item = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg space-y-1">
                            <p className="font-bold text-amber-300">{item.timeLabel}</p>
                            <p>Density: <strong>{item.density}%</strong></p>
                            <p>Est. Visitors: <strong>~{item.visitors.toLocaleString()}</strong></p>
                            {item.isPeak && <p className="text-red-400 font-bold">★ Daily Peak Window</p>}
                            {item.isCurrent && <p className="text-emerald-400 font-bold">● Current Hour</p>}
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <ReferenceLine y={currentSelectedMetric.threshold} stroke="#f59e0b" strokeDasharray="3 3" />
                  <ReferenceLine y={currentSelectedMetric.criticalThreshold} stroke="#ef4444" strokeDasharray="3 3" />
                  <Area type="monotone" dataKey="density" stroke="#0D6E6E" strokeWidth={2.5} fill="url(#peakDensityGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Operational Directive Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
                Automated Carrying Capacity Directive
              </span>
              <p className="text-slate-700 leading-relaxed">
                {currentSelectedMetric.recommendedAction}
              </p>
            </div>
            <div>
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
                Suggested Diversion Alternative Site
              </span>
              <p className="text-[#0D6E6E] font-bold leading-relaxed">
                {currentSelectedMetric.suggestedAlternativeSite}
              </p>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Eligible for instant +150 to +200 PathPoints gamified tourist reward vouchers.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of All Site Peak Cards */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
            <span>All Site Peak Schedules & Daily Density Ledger</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded-full font-bold">
              {activeMetrics.length} Sites
            </span>
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search Box */}
            <div className="relative min-w-[220px]">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sites (e.g. Jaffna)..."
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0D6E6E] outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/80 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All ({summary.metrics.length})
              </button>
              <button
                onClick={() => setSelectedTab('in_peak')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTab === 'in_peak' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Peaking Now ({summary.sitesInPeakNow.length})
              </button>
              <button
                onClick={() => setSelectedTab('approaching')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTab === 'approaching' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Approaching ({summary.sitesApproachingPeak.length})
              </button>
              <button
                onClick={() => setSelectedTab('critical')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTab === 'critical' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Critical ({summary.criticalBreachSites.length})
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeMetrics.map((m) => {
            const isSelected = (currentSelectedMetric?.siteId === m.siteId);
            return (
              <div
                key={m.siteId}
                onClick={() => setSelectedSiteId(m.siteId)}
                className={`bg-white rounded-xl border p-4 shadow-xs cursor-pointer transition-all hover:shadow-md flex flex-col justify-between ${
                  isSelected ? 'border-[#0D6E6E] ring-2 ring-[#0D6E6E]/20 bg-emerald-50/20' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{m.siteName}</h4>
                      <p className="text-[11px] text-slate-500">{m.region} • {m.category}</p>
                    </div>

                    {m.peakStatus === 'IN_PEAK_NOW' ? (
                      <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase border border-red-200 flex items-center gap-1">
                        <Flame size={10} /> Peaking
                      </span>
                    ) : m.peakStatus === 'APPROACHING_PEAK' ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200">
                        In {m.minutesToPeak}m
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-medium px-2 py-0.5 rounded">
                        {m.peakStatus === 'CLOSED' ? 'Closed' : 'Normal'}
                      </span>
                    )}
                  </div>

                  {/* Daily Peak Progress Meter */}
                  <div className="mt-3.5 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">Today's Peak Crowd:</span>
                      <span className={`font-mono font-bold ${m.todayPeakDensity >= 85 ? 'text-red-600' : 'text-slate-900'}`}>
                        {m.todayPeakDensity}% (~{m.todayPeakVisitors.toLocaleString()})
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          m.todayPeakDensity >= 85
                            ? 'bg-red-500'
                            : m.todayPeakDensity >= 70
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(100, m.todayPeakDensity)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2.5">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-slate-400" />
                      <span>{m.peakWindowLabel}</span>
                    </div>
                    <span className="font-mono text-slate-600">Live: {m.currentDensity}%</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium truncate max-w-[170px]">
                    Alt: {m.suggestedAlternativeSite.split('&')[0]}
                  </span>
                  <span className="text-xs font-bold text-[#0D6E6E] flex items-center gap-1">
                    <span>Inspect</span>
                    <ArrowRight size={12} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
