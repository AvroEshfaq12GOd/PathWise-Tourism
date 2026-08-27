import { useState } from 'react';
import { motion } from 'framer-motion';
import { AppHeader } from '../components/AppHeader';
import { useSriLankaSync } from '../context/SriLankaSyncContext';
import { GoogleMapLiveView } from '../components/maps/GoogleMapLiveView';
import { SiteDetailModal } from '../components/SiteDetailModal';
import { LiveSite } from '../lib/api';
import { Search, X, MapPin } from 'lucide-react';

export function MapView() {
  const [timeOffset, setTimeOffset] = useState(0); // 0 = now, 1 = +1h, etc.
  const { sites, isLoading } = useSriLankaSync();
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(null);
  const [modalSite, setModalSite] = useState<LiveSite | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = searchQuery.trim()
    ? sites.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  if (sites.length === 0) {
    return (
      <motion.div className="flex-1 flex items-center justify-center bg-white">
        <div className="text-center text-slate-500">
          <div className="w-8 h-8 border-3 border-[#0D6E6E] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs font-semibold">Loading live Google Maps & Traffic...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex flex-col relative h-full w-full select-none"
    >
      {/* Top Navigation & App Header */}
      <div className="absolute top-0 inset-x-0 z-30 pointer-events-auto">
        <AppHeader title="Live Crowd Map" subtitle="Sri Lanka Telemetry" />

        {/* Centered Map Destination Search Bar */}
        <div className="px-4 py-2 bg-white/90 backdrop-blur-md border-b border-slate-200/80 flex flex-col gap-2">
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder="Search tourist sites, heritage, beaches..."
              className="w-full pl-8 pr-7 py-1.5 bg-slate-100/90 border border-slate-200/70 rounded-full text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/20 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Autocomplete Search Dropdown */}
          {isSearchFocused && searchQuery.trim() && (
            <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-2 max-h-48 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
              {searchResults.length === 0 ? (
                <p className="text-[11px] text-slate-400 text-center py-2">No matching sites found</p>
              ) : (
                <div className="space-y-1">
                  {searchResults.map((site) => (
                    <div
                      key={site.id}
                      onClick={() => {
                        setSelectedSiteId(site.id);
                        setModalSite(site);
                        setSearchQuery('');
                      }}
                      className="p-1.5 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-[#0D6E6E] shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-slate-900 group-hover:text-[#0D6E6E]">
                            {site.name}
                          </p>
                          <p className="text-[10px] text-slate-500">{site.category}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {site.currentDensity}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Map Body Canvas */}
      <div className="flex-1 relative z-0 w-full h-full pt-24">
        <GoogleMapLiveView
          sites={sites}
          timeOffset={timeOffset}
          onTimeOffsetChange={setTimeOffset}
          selectedSiteId={selectedSiteId}
          onSelectSite={setSelectedSiteId}
          onOpenDetails={(site) => setModalSite(site)}
          searchQuery={searchQuery}
        />
      </div>

      {/* Real-time Site Detail Modal */}
      <SiteDetailModal
        site={modalSite}
        isOpen={Boolean(modalSite)}
        onClose={() => setModalSite(null)}
      />
    </motion.div>
  );
}

export default MapView;
