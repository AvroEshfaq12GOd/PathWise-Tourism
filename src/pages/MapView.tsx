import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { AppHeader } from '../components/AppHeader';
import { getSitesLive, type LiveSite } from '../lib/api';
import { Clock, Navigation } from 'lucide-react';
export function MapView() {
  const [timeOffset, setTimeOffset] = useState(0); // 0 = now, 1 = +1h, etc.
  const [sites, setSites] = useState<LiveSite[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const liveSites = await getSitesLive();
        if (!mounted) return;
        setSites(liveSites);
      } catch {
        if (!mounted) return;
        setSites([]);
      }
    }

    void load();
    const timer = window.setInterval(() => void load(), 30000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  if (sites.length === 0) {
    return (
      <motion.div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-slate-500">
          <p className="text-sm font-semibold">Loading live map...</p>
        </div>
      </motion.div>
    );
  }

  const getDensityColor = (density: number) => {
    if (density >= 85) return '#ef4444'; // red
    if (density >= 65) return '#f59e0b'; // amber
    if (density >= 40) return '#eab308'; // yellow
    return '#10b981'; // emerald
  };
  return (
    <motion.div
      initial={{
        opacity: 0
      }}
      animate={{
        opacity: 1
      }}
      exit={{
        opacity: 0
      }}
      className="flex-1 flex flex-col relative">
      
      <div className="absolute top-0 inset-x-0 z-30 pointer-events-none">
        <AppHeader title="Live Heatmap" />
      </div>

      <div className="flex-1 relative z-0">
        <MapContainer
          center={[7.2906, 80.6337]} // Kandy center
          zoom={12}
          zoomControl={false}
          className="w-full h-full">
          
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution="&copy; OpenStreetMap contributors" />
          

          {sites.map((site) => {
            const forecastPoints = site.forecastData.filter((point) => point.isForecast);
            const displayDensity =
              timeOffset === 0
                ? site.currentDensity
                : forecastPoints[Math.min(timeOffset - 1, forecastPoints.length - 1)]?.density ?? site.currentDensity;
            return (
              <CircleMarker
                key={site.id}
                center={[site.lat, site.lng]}
                radius={Math.max(15, displayDensity / 3)}
                pathOptions={{
                  fillColor: getDensityColor(displayDensity),
                  fillOpacity: 0.6,
                  color: getDensityColor(displayDensity),
                  weight: 2
                }}>
                
                <Popup className="rounded-xl">
                  <div className="p-1 min-w-[150px]">
                    <h3 className="font-bold text-sm mb-1">{site.name}</h3>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Live Crowd:</span>
                      <span className="font-bold">
                        {Math.round(displayDensity)}%
                      </span>
                    </div>
                    <button className="mt-3 w-full bg-brand-700 text-white py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1">
                      <Navigation size={12} /> Route Here
                    </button>
                  </div>
                </Popup>
              </CircleMarker>);

          })}
        </MapContainer>
      </div>

      {/* Time Slider Overlay */}
      <div className="absolute bottom-6 inset-x-5 z-30 bg-white rounded-2xl p-4 shadow-lg border border-slate-100">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-800">
            <Clock size={16} className="text-brand-600" />
            <span>Forecast Time</span>
          </div>
          <span className="text-xs font-medium text-brand-700 bg-brand-50 px-2 py-1 rounded-md">
            {timeOffset === 0 ? 'Live Now' : `+${timeOffset} Hours`}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="4"
          step="1"
          value={timeOffset}
          onChange={(e) => setTimeOffset(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600" />
        
        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium px-1">
          <span>Now</span>
          <span>+1h</span>
          <span>+2h</span>
          <span>+3h</span>
          <span>+4h</span>
        </div>
      </div>
    </motion.div>);

}