import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useApiLoadingStatus,
  APILoadingStatus
} from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../config/maps';
import { LiveSite } from '../../lib/api';
import { SiteImage } from '../../lib/siteImages';
import { Navigation, Clock, Users, Sun, Layers, ExternalLink, RefreshCw, Car } from 'lucide-react';

interface GoogleMapLiveViewProps {
  sites: LiveSite[];
  timeOffset: number;
  onTimeOffsetChange: (offset: number) => void;
  selectedSiteId?: string | null;
  onSelectSite?: (siteId: string | null) => void;
  onOpenDetails?: (site: LiveSite) => void;
  searchQuery?: string;
}

function getDensityColor(density: number) {
  if (density >= 85) return { bg: 'bg-rose-500', text: 'text-rose-500', hex: '#f43f5e', label: 'Critical' };
  if (density >= 65) return { bg: 'bg-amber-500', text: 'text-amber-500', hex: '#f59e0b', label: 'Moderate' };
  if (density >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-500', hex: '#eab308', label: 'Manageable' };
  return { bg: 'bg-emerald-500', text: 'text-emerald-500', hex: '#10b981', label: 'Optimal' };
}

/**
 * Controller sub-component that interacts directly with the Google Map instance.
 * Manages Google Maps TrafficLayer and smooth pan/zoom when site selection changes.
 */
function MapTrafficAndCamera({
  showTraffic,
  selectedSite
}: {
  showTraffic: boolean;
  selectedSite: LiveSite | null;
}) {
  const map = useMap();
  const trafficLayerRef = useRef<google.maps.TrafficLayer | null>(null);

  // Setup / toggle real-time Google Maps Traffic Layer
  useEffect(() => {
    if (!map) return;

    if (!trafficLayerRef.current) {
      trafficLayerRef.current = new google.maps.TrafficLayer();
    }

    if (showTraffic) {
      trafficLayerRef.current.setMap(map);
    } else {
      trafficLayerRef.current.setMap(null);
    }

    return () => {
      trafficLayerRef.current?.setMap(null);
    };
  }, [map, showTraffic]);

  // Pan camera to selected site
  useEffect(() => {
    if (!map || !selectedSite) return;
    map.panTo({ lat: selectedSite.lat, lng: selectedSite.lng });
    map.setZoom(Math.max(map.getZoom() ?? 8, 12));
  }, [map, selectedSite]);

  return null;
}

function InnerMap({
  sites,
  timeOffset,
  onTimeOffsetChange,
  selectedSiteId,
  onSelectSite,
  onOpenDetails,
  searchQuery = ''
}: GoogleMapLiveViewProps) {
  const navigate = useNavigate();
  const [activeSite, setActiveSite] = useState<LiveSite | null>(
    sites.find((s) => s.id === selectedSiteId) ?? null
  );
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    if (selectedSiteId) {
      const site = sites.find((s) => s.id === selectedSiteId);
      if (site) setActiveSite(site);
    }
  }, [selectedSiteId, sites]);

  const categories = ['all', ...Array.from(new Set(sites.map((s) => s.category).filter(Boolean)))];

  const filteredSites = sites.filter((s) => {
    const matchesCategory =
      categoryFilter === 'all' || s.category.toLowerCase() === categoryFilter.toLowerCase();
    const matchesSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative w-full h-full font-sans">
      <Map
        defaultCenter={DEFAULT_MAP_CENTER}
        defaultZoom={DEFAULT_MAP_ZOOM}
        mapTypeId={mapTypeId}
        mapId="pathwise_live_tourism_map"
        disableDefaultUI={false}
        zoomControl={true}
        streetViewControl={false}
        mapTypeControl={false}
        internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
        className="w-full h-full"
      >
        {/* Google Maps Real-Time Traffic & Camera Controller */}
        <MapTrafficAndCamera showTraffic={showTraffic} selectedSite={activeSite} />

        {filteredSites.map((site) => {
          const forecastPoints = site.forecastData.filter((point) => point.isForecast);
          const displayDensity =
            timeOffset === 0
              ? site.currentDensity
              : forecastPoints[Math.min(timeOffset - 1, Math.max(0, forecastPoints.length - 1))]?.density ?? site.currentDensity;

          const colorInfo = getDensityColor(displayDensity);
          const isSelected = activeSite?.id === site.id;

          return (
            <AdvancedMarker
              key={site.id}
              position={{ lat: site.lat, lng: site.lng }}
              onClick={() => {
                setActiveSite(site);
                onSelectSite?.(site.id);
              }}
              title={site.name}
            >
              <div className="relative cursor-pointer transition-transform hover:scale-110">
                {/* Pulse ring for high congestion */}
                {displayDensity >= 80 && (
                  <span
                    className="absolute -inset-1 rounded-full animate-ping opacity-75"
                    style={{ backgroundColor: colorInfo.hex }}
                  />
                )}

                {/* Marker body */}
                <div
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg border-2 text-white font-bold text-xs ${
                    isSelected ? 'border-slate-900 scale-105' : 'border-white'
                  }`}
                  style={{ backgroundColor: colorInfo.hex }}
                >
                  <Users size={12} />
                  <span>{Math.round(displayDensity)}%</span>
                </div>

                {/* Pin stem arrow */}
                <div
                  className="w-2 h-2 rotate-45 mx-auto -mt-1 shadow-sm"
                  style={{ backgroundColor: colorInfo.hex }}
                />
              </div>
            </AdvancedMarker>
          );
        })}

        {activeSite && (
          <InfoWindow
            position={{ lat: activeSite.lat, lng: activeSite.lng }}
            onCloseClick={() => {
              setActiveSite(null);
              onSelectSite?.(null);
            }}
          >
            {(() => {
              const forecastPoints = activeSite.forecastData.filter((point) => point.isForecast);
              const displayDensity =
                timeOffset === 0
                  ? activeSite.currentDensity
                  : forecastPoints[Math.min(timeOffset - 1, Math.max(0, forecastPoints.length - 1))]?.density ?? activeSite.currentDensity;
              const colorInfo = getDensityColor(displayDensity);

              const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                activeSite.name + ', Sri Lanka'
              )}`;

              return (
                <div className="p-1 max-w-[260px] text-slate-900 font-sans">
                  <div className="relative mb-2">
                    <SiteImage
                      siteName={activeSite.name}
                      src={activeSite.imageUrl}
                      alt={activeSite.name}
                      className="w-full h-28 object-cover rounded-lg"
                    />
                      {activeSite.unescoHeritage && (
                        <span className="absolute top-1.5 left-1.5 bg-blue-900/90 text-blue-100 backdrop-blur-sm text-[9px] font-extrabold px-2 py-0.5 rounded-md border border-blue-700 shadow-sm">
                          UNESCO World Heritage
                        </span>
                      )}
                      <span className="absolute bottom-1.5 right-1.5 bg-emerald-950/85 text-emerald-300 backdrop-blur-sm text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-700">
                        Live Monitored
                      </span>
                    </div>
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <div>
                      <h3 className="font-bold text-sm leading-snug">{activeSite.name}</h3>
                      <p className="text-[10px] text-slate-500 font-medium">{activeSite.region}</p>
                    </div>
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-50 text-[#0D6E6E] shrink-0 border border-emerald-100">
                      {activeSite.category}
                    </span>
                  </div>

                  {activeSite.description && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 my-1.5 leading-snug">
                      {activeSite.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs my-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-600 font-medium">
                      {activeSite.isOpen === false ? 'Operating Status:' : 'LSTM Crowd Density:'}
                    </span>
                    <span
                      className="font-extrabold text-xs px-2 py-0.5 rounded-full"
                      style={
                        activeSite.isOpen === false
                          ? { backgroundColor: '#f1f5f9', color: '#475569' }
                          : { backgroundColor: colorInfo.bg, color: colorInfo.hex }
                      }
                    >
                      {activeSite.isOpen === false ? '🌙 Closed (0%)' : `${Math.round(displayDensity)}%`}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 mb-2 flex items-center justify-between bg-slate-100/70 px-2 py-1 rounded">
                    <span>Hours: <strong className="text-slate-700 font-mono">{activeSite.operatingHours || '09:00 AM – 05:00 PM'}</strong></span>
                    <span>Cap: {activeSite.maxCapacity.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 mb-2.5">
                    <div className="flex items-center gap-1">
                      <Sun size={11} className="text-amber-500" />
                      <span>{activeSite.weather.temp ? `${activeSite.weather.temp}°C` : '28°C'} {activeSite.weather.condition}</span>
                    </div>
                    <span>•</span>
                    <div className="truncate">{activeSite.statusLabel || activeSite.region}</div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    {onOpenDetails && (
                      <button
                        onClick={() => onOpenDetails(activeSite)}
                        className="w-full bg-[#0D6E6E] hover:bg-[#095454] text-white py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Navigation size={12} />
                        <span>Site Details & Directions</span>
                      </button>
                    )}

                    <button
                      onClick={() => navigate(`/app/forecast?site=${activeSite.id}`)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-1.5 px-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                    >
                      <Users size={12} className="text-[#0D6E6E]" />
                      <span>View AI Crowd Forecast</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </InfoWindow>
        )}
      </Map>

      {/* Top Filter Chips */}
      <div className="absolute top-3 inset-x-3 z-10 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize whitespace-nowrap shadow-md transition-all ${
              categoryFilter === cat
                ? 'bg-slate-900 text-white scale-105'
                : 'bg-white/95 backdrop-blur text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat === 'all' ? 'All Sites' : cat}
          </button>
        ))}
      </div>

      {/* Floating Controls: Real-Time Traffic Layer & Map Style */}
      <div className="absolute top-14 right-3 z-10 flex flex-col gap-2">
        {/* Live Traffic Layer Toggle */}
        <button
          onClick={() => setShowTraffic((prev) => !prev)}
          className={`p-2 rounded-xl shadow-md border flex items-center gap-1.5 text-xs font-semibold backdrop-blur transition-all ${
            showTraffic
              ? 'bg-white/95 border-emerald-300 text-emerald-700 ring-2 ring-emerald-500/20'
              : 'bg-white/90 border-slate-200 text-slate-500 hover:text-slate-800'
          }`}
          title="Toggle Google Maps Live Traffic Layer"
        >
          <div className="relative">
            <Car size={14} className={showTraffic ? 'text-emerald-600' : 'text-slate-400'} />
            {showTraffic && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>
          <span>Traffic {showTraffic ? 'ON' : 'OFF'}</span>
        </button>

        {/* Map Type Switcher */}
        <button
          onClick={() =>
            setMapTypeId((prev) => (prev === 'roadmap' ? 'hybrid' : prev === 'hybrid' ? 'terrain' : 'roadmap'))
          }
          className="bg-white/95 backdrop-blur p-2 rounded-xl shadow-md border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 text-xs font-medium"
          title="Switch Map Type (Roadmap / Satellite / Terrain)"
        >
          <Layers size={14} className="text-[#0D6E6E]" />
          <span className="capitalize">{mapTypeId}</span>
        </button>
      </div>

      {/* Time Slider Overlay */}
      <div className="absolute bottom-6 inset-x-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Clock size={15} className="text-[#0D6E6E]" />
            <span>LSTM Neural Crowd Forecast</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
            {timeOffset === 0 ? 'Live Now' : `+${timeOffset}h Prediction`}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="4"
          step="1"
          value={timeOffset}
          onChange={(e) => onTimeOffsetChange(parseInt(e.target.value, 10))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0D6E6E]"
        />

        <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-semibold px-0.5">
          <span>Current</span>
          <span>+1 Hour</span>
          <span>+2 Hours</span>
          <span>+3 Hours</span>
          <span>+4 Hours</span>
        </div>
      </div>
    </div>
  );
}

function MapLoadingFallback() {
  const status = useApiLoadingStatus();

  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-3">
          <RefreshCw size={20} />
        </div>
        <h4 className="text-sm font-bold text-slate-900 mb-1">Google Maps API Notice</h4>
        <p className="text-xs text-slate-500 max-w-xs mb-3">
          Initializing Google Maps with real-time traffic and crowd telemetry.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-500">
      <div className="w-8 h-8 border-3 border-[#0D6E6E] border-t-transparent rounded-full animate-spin mb-2" />
      <span className="text-xs font-semibold">Initializing Google Maps & Traffic Layer...</span>
    </div>
  );
}

export function GoogleMapLiveView(props: GoogleMapLiveViewProps) {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <InnerMapWrapper {...props} />
    </APIProvider>
  );
}

function InnerMapWrapper(props: GoogleMapLiveViewProps) {
  const status = useApiLoadingStatus();

  if (status !== APILoadingStatus.LOADED) {
    return <MapLoadingFallback />;
  }

  return <InnerMap {...props} />;
}
