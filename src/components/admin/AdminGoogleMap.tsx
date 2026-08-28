import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  APIProvider,
  Map as GoogleMapComponent,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useApiLoadingStatus,
  APILoadingStatus
} from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '../../config/maps';
import { AdminOverviewData } from '../../lib/api';
import { Layers, Users, ExternalLink, Car } from 'lucide-react';

interface AdminGoogleMapProps {
  sites: AdminOverviewData['sites'];
}

function AdminTrafficLayer({ enabled }: { enabled: boolean }) {
  const map = useMap();
  const trafficRef = useRef<google.maps.TrafficLayer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!trafficRef.current) {
      trafficRef.current = new google.maps.TrafficLayer();
    }
    if (enabled) {
      trafficRef.current.setMap(map);
    } else {
      trafficRef.current.setMap(null);
    }
    return () => {
      trafficRef.current?.setMap(null);
    };
  }, [map, enabled]);

  return null;
}

function InnerAdminMap({ sites }: AdminGoogleMapProps) {
  const navigate = useNavigate();
  const [activeSite, setActiveSite] = useState<AdminOverviewData['sites'][0] | null>(null);
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap');
  const [showTraffic, setShowTraffic] = useState<boolean>(true);

  return (
    <div className="relative w-full h-full font-sans">
      <GoogleMapComponent
        defaultCenter={{ lat: 7.8731, lng: 80.7718 }}
        defaultZoom={8}
        mapTypeId={mapTypeId}
        mapId="admin_overview_map"
        zoomControl={true}
        streetViewControl={false}
        mapTypeControl={false}
        className="w-full h-full"
      >
        <AdminTrafficLayer enabled={showTraffic} />

        {sites.map((site) => {
          const fillColor =
            site.currentDensity >= site.criticalThreshold
              ? '#ef4444'
              : site.currentDensity >= site.threshold
              ? '#f59e0b'
              : '#10b981';

          return (
            <AdvancedMarker
              key={site.id}
              position={{ lat: site.lat, lng: site.lng }}
              onClick={() => setActiveSite(site)}
              title={site.name}
            >
              <div className="relative cursor-pointer transition-transform hover:scale-110">
                <div
                  className="flex items-center gap-1 px-2.5 py-1 rounded-full shadow-lg border-2 border-white text-white font-bold text-xs"
                  style={{ backgroundColor: fillColor }}
                >
                  <Users size={12} />
                  <span>{site.currentDensity}%</span>
                </div>
                <div
                  className="w-2 h-2 rotate-45 mx-auto -mt-1 shadow-sm"
                  style={{ backgroundColor: fillColor }}
                />
              </div>
            </AdvancedMarker>
          );
        })}

        {activeSite && (
          <InfoWindow
            position={{ lat: activeSite.lat, lng: activeSite.lng }}
            onCloseClick={() => setActiveSite(null)}
          >
            <div className="p-1 max-w-[220px] text-slate-900 font-sans">
              <div className="flex items-start justify-between gap-1 mb-1">
                <h4 className="font-bold text-sm leading-snug">{activeSite.name}</h4>
              </div>
              <p className="text-[10px] text-slate-500 font-medium mb-1.5">{activeSite.region}</p>
              
              <div className="space-y-1 text-xs text-slate-600 mb-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <div className="flex justify-between">
                  <span>Current Density:</span>
                  <span className="font-extrabold text-[#0D6E6E]">{activeSite.currentDensity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Critical Limit:</span>
                  <span className="font-semibold text-rose-600">{activeSite.criticalThreshold}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Capacity:</span>
                  <span>{activeSite.maxCapacity.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 pt-1 border-t border-slate-100">
                <button
                  onClick={() => navigate('/admin/peak-monitor')}
                  className="w-full bg-[#0D6E6E] hover:bg-[#095454] text-white py-1.5 px-2 rounded-md text-[11px] font-bold text-center transition-colors shadow-2xs"
                >
                  Inspect in Peak Hub
                </button>
                <div className="text-right">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      activeSite.name + ', Sri Lanka'
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] text-slate-400 hover:text-slate-600 inline-flex items-center gap-1 hover:underline"
                  >
                    <span>External Google Maps</span>
                    <ExternalLink size={9} />
                  </a>
                </div>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMapComponent>

      {/* Layer Controls */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
        {/* Traffic Layer Toggle */}
        <button
          onClick={() => setShowTraffic((prev) => !prev)}
          className={`px-3 py-1.5 rounded-xl shadow-md border text-xs font-semibold backdrop-blur transition-all flex items-center gap-1.5 ${
            showTraffic
              ? 'bg-white/95 border-emerald-300 text-emerald-700 ring-2 ring-emerald-500/20'
              : 'bg-white/90 border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
          title="Toggle Google Maps Live Traffic"
        >
          <Car size={13} className={showTraffic ? 'text-emerald-600' : 'text-slate-400'} />
          <span>Traffic {showTraffic ? 'ON' : 'OFF'}</span>
        </button>

        {/* Map Type Switcher */}
        <button
          onClick={() =>
            setMapTypeId((prev) => (prev === 'roadmap' ? 'hybrid' : prev === 'hybrid' ? 'terrain' : 'roadmap'))
          }
          className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-md border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-medium"
          title="Switch Map Type"
        >
          <Layers size={13} className="text-[#0D6E6E]" />
          <span className="capitalize">{mapTypeId}</span>
        </button>
      </div>
    </div>
  );
}

function Wrapper(props: AdminGoogleMapProps) {
  const status = useApiLoadingStatus();

  if (status !== APILoadingStatus.LOADED) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 h-full w-full">
        <div className="text-center text-slate-400">
          <div className="w-8 h-8 border-3 border-[#0D6E6E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold">Loading Admin Google Maps & Traffic...</p>
        </div>
      </div>
    );
  }

  return <InnerAdminMap {...props} />;
}

export function AdminGoogleMap(props: AdminGoogleMapProps) {
  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <Wrapper {...props} />
    </APIProvider>
  );
}
