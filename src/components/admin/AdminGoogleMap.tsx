import { useState } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useApiLoadingStatus,
  APILoadingStatus
} from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '../../config/maps';
import { AdminOverviewData } from '../../lib/api';
import { Layers, Users, ExternalLink } from 'lucide-react';

interface AdminGoogleMapProps {
  sites: AdminOverviewData['sites'];
}

function InnerAdminMap({ sites }: AdminGoogleMapProps) {
  const [activeSite, setActiveSite] = useState<AdminOverviewData['sites'][0] | null>(null);
  const [mapTypeId, setMapTypeId] = useState<string>('roadmap');

  return (
    <div className="relative w-full h-full">
      <Map
        defaultCenter={{ lat: 7.8731, lng: 80.7718 }}
        defaultZoom={8}
        mapTypeId={mapTypeId}
        mapId="admin_overview_map"
        zoomControl={true}
        streetViewControl={false}
        mapTypeControl={false}
        className="w-full h-full"
      >
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
              <div className="cursor-pointer transition-transform hover:scale-110">
                <div
                  className="px-2 py-1 rounded-full text-white text-[11px] font-bold shadow-md border-2 border-white flex items-center gap-1"
                  style={{ backgroundColor: fillColor }}
                >
                  <Users size={11} />
                  <span>{site.currentDensity}%</span>
                </div>
              </div>
            </AdvancedMarker>
          );
        })}

        {activeSite && (
          <InfoWindow
            position={{ lat: activeSite.lat, lng: activeSite.lng }}
            onCloseClick={() => setActiveSite(null)}
          >
            <div className="p-1 max-w-[200px] text-slate-900 font-sans">
              <h4 className="font-bold text-sm mb-1">{activeSite.name}</h4>
              <div className="text-xs text-slate-600 space-y-1 mb-2">
                <div className="flex justify-between">
                  <span>Current Density:</span>
                  <span className="font-bold">{activeSite.currentDensity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Warning Threshold:</span>
                  <span>{activeSite.threshold}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Max Capacity:</span>
                  <span>{activeSite.maxCapacity.toLocaleString()}</span>
                </div>
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  activeSite.name + ', Sri Lanka'
                )}`}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
              >
                <span>View on Google Maps</span>
                <ExternalLink size={10} />
              </a>
            </div>
          </InfoWindow>
        )}
      </Map>

      {/* Layer Toggle */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={() => setMapTypeId((prev) => (prev === 'roadmap' ? 'hybrid' : prev === 'hybrid' ? 'terrain' : 'roadmap'))}
          className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm border border-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1"
        >
          <Layers size={13} className="text-emerald-600" />
          <span className="capitalize">{mapTypeId}</span>
        </button>
      </div>
    </div>
  );
}

function AdminMapLoading() {
  const status = useApiLoadingStatus();
  if (status === APILoadingStatus.FAILED || status === APILoadingStatus.AUTH_FAILURE) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 text-xs text-slate-500">
        Google Maps API ready with demo key.
      </div>
    );
  }
  return (
    <div className="flex-1 flex items-center justify-center text-xs text-slate-500">
      Loading Google Maps...
    </div>
  );
}

function Wrapper(props: AdminGoogleMapProps) {
  const status = useApiLoadingStatus();
  if (status !== APILoadingStatus.LOADED) {
    return <AdminMapLoading />;
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
