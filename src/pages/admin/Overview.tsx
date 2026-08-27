import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { KpiCard } from '../../components/admin/KpiCard';
import { AdminGoogleMap } from '../../components/admin/AdminGoogleMap';
import { getAdminOverviewData, type AdminOverviewData } from '../../lib/api';
import { calculateNationalPeakSummary, calculateSitePeakMetric } from '../../lib/peakCrowdEngine';
import {
  MapPin,
  BrainCircuit,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Map as MapIcon,
  Sparkles,
  Calendar,
  Sun,
  CloudSun,
  Clock,
  Flame,
  FileText,
  Radio,
  ArrowRight,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';
import { getSriLankaTime, getUpcomingHolidayOrFestival, SRI_LANKA_HOLIDAYS_AND_FESTIVALS } from '../../lib/sriLankaContext';

// Automatically resizes Leaflet map when layout or flexbox container dimensions settle
function MapResizer() {
  const map = useMap();

  useEffect(() => {
    // Force immediate recalculation
    map.invalidateSize();

    // Secondary timers to catch CSS flex/grid rendering delays
    const timer1 = setTimeout(() => map.invalidateSize(), 200);
    const timer2 = setTimeout(() => map.invalidateSize(), 600);

    // Watch parent container size changes (observe parent to catch layout changes)
    const container = map.getContainer();
    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });

    // Observe the map container's parent because Leaflet creates inner panes
    const target = container?.parentElement ?? container;
    if (target) {
      observer.observe(target as Element);
    }

    // fallback: listen for window resize to catch broader layout changes
    const onWindowResize = () => map.invalidateSize();
    window.addEventListener('resize', onWindowResize);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
      window.removeEventListener('resize', onWindowResize);
    };
  }, [map]);

  return null;
}

export function Overview() {
  const navigate = useNavigate();
  const [data, setData] = useState<AdminOverviewData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mapProvider, setMapProvider] = useState<'google' | 'osm'>('google');

  useEffect(() => {
    let mounted = true;

    async function load() {
      setIsLoading(true);
      try {
        const liveData = await getAdminOverviewData();
        if (!mounted) return;
        setData(liveData);
        setLoadError(null);
      } catch {
        if (!mounted) return;
        setData(null);
        setLoadError('Unable to load live admin data from the backend.');
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

  const sl = getSriLankaTime();
  const holiday = getUpcomingHolidayOrFestival();

  const peakSummary = useMemo(() => {
    if (!data?.sites) return null;
    return calculateNationalPeakSummary(data.sites);
  }, [data?.sites]);

  const criticalSites = data?.sites.filter((s) => s.currentDensity >= s.threshold) ?? [];
  const alerts = (data?.sites ?? [])
    .filter((s) => s.currentDensity >= s.threshold)
    .map((s) => ({
      ...s,
      severity: s.currentDensity >= s.criticalThreshold ? 'critical' : 'high'
    }));

  if (isLoading) {
    return <div className="text-sm text-slate-500">Loading admin overview...</div>;
  }

  if (!data) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        {loadError ?? 'No admin data is available right now.'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sri Lanka Live National Operating Environment Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#003838] to-[#0D6E6E] rounded-2xl p-4 sm:p-5 text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 bg-white/10 rounded-2xl border border-white/10 shrink-0">
              <Sparkles size={24} className="text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                  Island-wide Calendar Active
                </span>
                <span className="text-xs text-emerald-200 font-medium">
                  {sl.dateStr} ({sl.dayOfWeek})
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                {holiday.current?.name || 'Nikini Full Moon Poya Day & Public Holiday'}
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                {holiday.current?.description || 'Active statutory holiday. Surge factors automatically calibrated across Cultural Triangle and Southern Coast corridors.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 bg-black/30 backdrop-blur-sm px-4 py-2.5 rounded-xl border border-white/10">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Sri Lanka Time</span>
              <span className="text-lg font-mono font-black text-amber-300">{sl.timeStr}</span>
            </div>
            <div className="h-7 w-px bg-slate-700 mx-1"></div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Next Holiday</span>
              <span className="text-xs font-bold text-emerald-300">{holiday.next.name.split(' ')[0]} {holiday.next.name.split(' ')[1]}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Active Sites"
          value={data.metrics.activeSites}
          icon={MapPin}
          trend={`${criticalSites.length} critical`}
          trendUp={true}
        />
        
        <KpiCard
          title="Predictions / 24h"
          value={data.metrics.predictions24h.toLocaleString()}
          icon={BrainCircuit}
          trend="Live"
          trendUp={true}
        />
        
        <KpiCard
          title="Successful Nudges"
          value={`${data.metrics.successfulNudges}%`}
          icon={CheckCircle2}
          trend="Backend"
          trendUp={true}
        />
        
        <KpiCard
          title="Avg Model MAE"
          value={`${data.metrics.avgMae}%`}
          icon={Activity}
          trend="Live"
          trendUp={false}
        />
      </div>

      {/* Daily Peak Crowd Levels & Carrying Capacity Command Hub */}
      {peakSummary && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase border border-red-200 flex items-center gap-1">
                  <Flame size={10} className="text-red-600" /> Daily Peak Telemetry
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  {sl.dateStr} (SLST)
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Today's Peak Crowd Levels & Carrying Capacity Schedules
              </h3>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              <button
                onClick={() => navigate('/admin/reports')}
                className="bg-[#003838] hover:bg-[#095454] text-amber-300 border border-amber-300/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
              >
                <FileText size={14} className="text-amber-300" />
                <span>Generate Daily Report</span>
              </button>

              <button
                onClick={() => navigate('/admin/peak-monitor')}
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
              >
                <TrendingUp size={14} className="text-[#0D6E6E]" />
                <span>Peak Command Hub</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 font-medium block text-[10px] uppercase">Sites Peaking Now</span>
              <span className="text-base font-bold text-red-600 font-mono flex items-center gap-1">
                <Flame size={14} /> {peakSummary.sitesInPeakNow.length} Sites
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block text-[10px] uppercase">Approaching Peak (&lt;2h)</span>
              <span className="text-base font-bold text-amber-600 font-mono flex items-center gap-1">
                <Clock size={14} /> {peakSummary.sitesApproachingPeak.length} Sites
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block text-[10px] uppercase">Avg Forecasted Peak</span>
              <span className="text-base font-bold text-slate-900 font-mono">
                {peakSummary.avgPeakDensity}% Density
              </span>
            </div>

            <div>
              <span className="text-slate-500 font-medium block text-[10px] uppercase">Critical Surge Breaches</span>
              <span className="text-base font-bold text-purple-600 font-mono">
                {peakSummary.criticalBreachSites.length} Protected
              </span>
            </div>
          </div>

          {/* Top Priority Sites Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
            {peakSummary.metrics.slice(0, 3).map((m) => (
              <div
                key={m.siteId}
                onClick={() => navigate('/admin/peak-monitor')}
                className="p-3 rounded-xl border border-slate-200 hover:border-[#0D6E6E]/40 hover:shadow-xs transition-all bg-white cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs truncate max-w-[160px] group-hover:text-[#0D6E6E]">
                    {m.siteName}
                  </span>
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
                      m.peakStatus === 'IN_PEAK_NOW'
                        ? 'bg-red-100 text-red-700'
                        : m.peakStatus === 'APPROACHING_PEAK'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {m.peakStatus === 'IN_PEAK_NOW' ? 'Peaking Now' : m.peakStatus === 'APPROACHING_PEAK' ? `In ${m.minutesToPeak}m` : 'Normal'}
                  </span>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Peak Window:</span>
                  <span className="font-semibold text-slate-800">{m.peakWindowLabel}</span>
                </div>

                <div className="mt-1 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Today's Peak Level:</span>
                  <span className="font-mono font-bold text-amber-700">{m.todayPeakDensity}% (~{m.todayPeakVisitors.toLocaleString()})</span>
                </div>

                <div className="mt-2 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.todayPeakDensity >= 85 ? 'bg-red-500' : m.todayPeakDensity >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, m.todayPeakDensity)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Map */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex flex-wrap justify-between items-center bg-slate-50/50 flex-shrink-0 gap-3">
            <div className="flex items-center gap-3">
              <h3 className="font-bold text-slate-900 text-sm">Live Congestion Map</h3>
              <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
                <button
                  onClick={() => setMapProvider('google')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    mapProvider === 'google' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Google Maps
                </button>
                <button
                  onClick={() => setMapProvider('osm')}
                  className={`px-2.5 py-1 rounded-md transition-all ${
                    mapProvider === 'osm' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  OpenStreetMap
                </button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs font-medium">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Normal
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div> High
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div> Critical
              </span>
            </div>
          </div>

          <div className="h-[420px] w-full relative z-0">
            {mapProvider === 'google' ? (
              <AdminGoogleMap sites={data.sites} />
            ) : (
              <MapContainer
                center={[7.8731, 80.7718]}
                zoom={8}
                className="leaflet-container w-full h-full"
                zoomControl={false}
                style={{ width: '100%', height: '100%' }}
              >
                <MapResizer />
                <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                {data.sites.map((site) => {
                  const radius = Math.round(6 + (Math.min(100, site.currentDensity) / 100) * 18);
                  const fillColor =
                    site.currentDensity >= site.criticalThreshold
                      ? '#ef4444'
                      : site.currentDensity >= site.threshold
                      ? '#f59e0b'
                      : '#10b981';

                  return (
                    <CircleMarker
                      key={site.id}
                      center={[site.lat, site.lng]}
                      radius={radius}
                      pathOptions={{
                        fillColor,
                        fillOpacity: 0.75,
                        color: 'white',
                        weight: 2
                      }}
                    >
                      <Popup>
                        <div className="font-sans">
                          <p className="font-bold text-sm">{site.name}</p>
                          <p className="text-xs text-slate-500">
                            Density: {site.currentDensity}%
                          </p>
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
              </MapContainer>
            )}
          </div>
        </div>

        {/* Alerts & Logs */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-sm">
                <AlertTriangle size={18} className="text-amber-500" /> Live Alerts
              </h3>
            </div>
            <div className="p-2">
              {alerts.map((site) => (
                <div
                  key={site.id}
                  className="p-3 hover:bg-slate-50 rounded-lg transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-slate-900">
                      {site.name}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        site.severity === 'critical'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {site.currentDensity}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Threshold: {site.threshold}% • Severity: {site.severity}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
              <h3 className="font-semibold text-slate-900 text-sm">Recent Actions</h3>
            </div>
            <div className="p-5 space-y-4">
              {data.logs.map((log) => (
                <div key={log.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-900">{log.action}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-600">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>{log.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
