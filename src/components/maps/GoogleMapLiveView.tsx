import { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useApiLoadingStatus,
  APILoadingStatus
} from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY, DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../config/maps';
import { LiveSite } from '../../lib/api';
import { Navigation, Clock, Users, Sun, Layers, ExternalLink, RefreshCw } from 'lucide-react';

interface GoogleMapLiveViewProps {
  sites: LiveSite[];
  timeOffset: number;
  onTimeOffsetChange: (offset: number) => void;
  selectedSiteId?: string | null;
  onSelectSite?: (siteId: string | null) => void;
}

function getDensityColor(density: number) {
  if (density >= 85) return { bg: 'bg-rose-500', text: 'text-rose-500', hex: '#f43f5e', label: 'Critical' };
  if (density >= 65) return { bg: 'bg-amber-500', text: 'text-amber-500', hex: '#f59e0b', label: 'Moderate' };
  if (density >= 40) return { bg: 'bg-yellow-500', text: 'text-yellow-500', hex: '#eab308', label: 'Manageable' };
  return { bg: 'bg-emerald-500', text: 'text-emerald-500', hex: '#10b981', label: 'Optimal' };
}

function InnerMap({ sites, timeOffset, onTimeOffsetChange, selectedSiteId, onSelectSite }: GoogleMapLiveViewProps) {
  const [activeSite, setActiveSite] = useState<LiveSite | null>(
    sites.find((s) => s.id === selectedSiteId) ?? null
  );
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const categories = ['all', ...Array.from(new Set(sites.map((s) => s.category).filter(Boolean)))];

  const filteredSites = categoryFilter === 'all'
    ? sites
    : sites.filter((s) => s.category.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="relative w-full h-full">
      <Map
        defaultCenter={DEFAULT_MAP_CENTER}
        defaultZoom={DEFAULT_MAP_ZOOM}
        mapTypeId={mapTypeId}
        mapId="pathwise_live_tourism_map"
        disableDefaultUI={false}
        zoomControl={true}
        streetViewControl={false}
        mapTypeControl={false}
        className="w-full h-full"
      >
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
                <div className="p-1 max-w-[240px] text-slate-900 font-sans">
                  {activeSite.imageUrl && (
                    <img
                      src={activeSite.imageUrl}
                      alt={activeSite.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-24 object-cover rounded-lg mb-2"
                    />
                  )}
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <h3 className="font-bold text-sm leading-snug">{activeSite.name}</h3>
                    <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 shrink-0">
                      {activeSite.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs my-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="text-slate-500 font-medium">Congestion Index:</span>
                    <span className="font-extrabold text-sm" style={{ color: colorInfo.hex }}>
                      {Math.round(displayDensity)}%
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Sun size={12} className="text-amber-500" />
                      <span>28°C Sunny</span>
                    </div>
                    <span>•</span>
                    <div>Max: {activeSite.maxCapacity.toLocaleString()}</div>
                  </div>

                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation size={12} />
                    <span>Get Directions</span>
                    <ExternalLink size={10} className="opacity-70" />
                  </a>
                </div>
              );
            })()}
          </InfoWindow>
        )}
      </Map>

      {/* Top Filter Chips */}
      <div className="absolute top-16 inset-x-3 z-10 flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
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

      {/* Map Style Toggle */}
      <div className="absolute top-28 right-3 z-10">
        <button
          onClick={() => setMapTypeId((prev) => (prev === 'roadmap' ? 'hybrid' : prev === 'hybrid' ? 'terrain' : 'roadmap'))}
          className="bg-white/95 backdrop-blur p-2 rounded-xl shadow-md border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1 text-xs font-medium"
          title="Switch Map Type"
        >
          <Layers size={14} className="text-emerald-600" />
          <span className="capitalize">{mapTypeId}</span>
        </button>
      </div>

      {/* Time Slider Overlay */}
      <div className="absolute bottom-6 inset-x-4 z-10 bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <Clock size={15} className="text-emerald-600" />
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
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
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
          The interactive map initialized with the provided Google Maps key. Check connectivity or project API configuration.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-500">
      <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mb-2" />
      <span className="text-xs font-semibold">Initializing Google Maps...</span>
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
