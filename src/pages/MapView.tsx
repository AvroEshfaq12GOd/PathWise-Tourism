import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { getSitesLive, type LiveSite } from '../lib/api';
import { GoogleMapLiveView } from '../components/maps/GoogleMapLiveView';

export function MapView() {
  const [timeOffset, setTimeOffset] = useState(0); // 0 = now, 1 = +1h, etc.
  const [sites, setSites] = useState<LiveSite[]>([]);
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);

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
    const timer = window.setInterval(() => void load(), 20000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  if (sites.length === 0) {
    return (
      <motion.div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-slate-500">
          <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold">Loading live Google Maps...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col relative h-full w-full"
    >
      <div className="absolute top-0 inset-x-0 z-30 pointer-events-none">
        <AppHeader title="Live Google Heatmap" />
      </div>

      <div className="flex-1 relative z-0 w-full h-full">
        <GoogleMapLiveView
          sites={sites}
          timeOffset={timeOffset}
          onTimeOffsetChange={setTimeOffset}
          selectedSiteId={selectedSiteId}
          onSelectSite={setSelectedSiteId}
        />
      </div>
    </motion.div>
  );
}

export default MapView;
