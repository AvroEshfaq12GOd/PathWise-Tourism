import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import { KpiCard } from '../../components/admin/KpiCard';
import { AdminGoogleMap } from '../../components/admin/AdminGoogleMap';
import { getAdminOverviewData, type AdminOverviewData } from '../../lib/api';
import {
  MapPin,
  BrainCircuit,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Map as MapIcon
} from 'lucide-react';

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
