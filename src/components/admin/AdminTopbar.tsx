import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, X, MapPin, Gift, ArrowRight } from 'lucide-react';
import { getSitesLive, getIncentivesLive, LiveSite, LiveIncentive } from '../../lib/api';
import { SriLankaLiveHeaderBanner } from '../SriLankaLiveHeaderBanner';

export function AdminTopbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sites, setSites] = useState<LiveSite[]>([]);
  const [incentives, setIncentives] = useState<LiveIncentive[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const pathParts = location.pathname.split('/').filter(Boolean);
  const pageName =
    pathParts.length > 1
      ? pathParts[1].charAt(0).toUpperCase() + pathParts[1].slice(1)
      : 'Overview';

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const [sitesData, incsData] = await Promise.all([getSitesLive(), getIncentivesLive()]);
        if (!mounted) return;
        setSites(sitesData);
        setIncentives(incsData);
      } catch {
        // fallback
      }
    }
    void loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredSites = searchQuery.trim()
    ? sites.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const filteredIncentives = searchQuery.trim()
    ? incentives.filter(
        (i) =>
          i.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.partner.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="h-16 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40 font-sans gap-4">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="shrink-0 min-w-[140px]">
        <div className="text-xs text-slate-500 font-medium mb-0.5">
          Admin / {pageName}
        </div>
        <h2 className="text-lg sm:text-xl font-display font-bold text-slate-900 leading-tight">
          {pageName}
        </h2>
      </div>

      {/* Middle: Centered Search Bar */}
      <div className="flex-1 max-w-lg mx-auto relative">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
            placeholder="Search sites, telemetry, incentives..."
            className="w-full pl-9 pr-8 py-2 bg-slate-100/90 border border-slate-200/60 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/20 outline-none transition-all shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Live Search Results Dropdown */}
        {isSearchFocused && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto">
            {filteredSites.length === 0 && filteredIncentives.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No matching sites or incentives found</p>
            ) : (
              <div className="space-y-3">
                {filteredSites.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                      Tourist Sites ({filteredSites.length})
                    </p>
                    <div className="space-y-1">
                      {filteredSites.map((site) => (
                        <div
                          key={site.id}
                          onClick={() => {
                            setSearchQuery('');
                            navigate('/admin/sites');
                          }}
                          className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#0D6E6E] flex items-center justify-center shrink-0">
                              <MapPin size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-[#0D6E6E]">
                                {site.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {site.category} • Density: {site.currentDensity}%
                              </p>
                            </div>
                          </div>
                          <ArrowRight size={12} className="text-slate-300 group-hover:text-slate-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {filteredIncentives.length > 0 && (
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 px-2">
                      Incentives & Rewards ({filteredIncentives.length})
                    </p>
                    <div className="space-y-1">
                      {filteredIncentives.map((inc) => (
                        <div
                          key={inc.id}
                          onClick={() => {
                            setSearchQuery('');
                            navigate('/admin/incentives');
                          }}
                          className="p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between cursor-pointer group transition-colors"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                              <Gift size={14} />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-900 group-hover:text-amber-700">
                                {inc.name}
                              </p>
                              <p className="text-[10px] text-slate-500">
                                {inc.partner} • {inc.pointsCost} pts
                              </p>
                            </div>
                          </div>
                          <ArrowRight size={12} className="text-slate-300 group-hover:text-slate-600" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Sri Lanka Time & Holidays Widget + Actions */}
      <div className="flex items-center gap-3 shrink-0 pr-48">
        <SriLankaLiveHeaderBanner variant="admin" />
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="System alerts"
          >
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-xs font-bold text-slate-800">System Telemetry Alerts</span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-red-50 border border-red-100">
                  <p className="font-bold text-red-800">Sigiriya Rock at 88%</p>
                  <p className="text-[11px] text-red-600">Dispersal nudges triggered to Dambulla.</p>
                </div>
                <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100">
                  <p className="font-bold text-emerald-800">LSTM Model Retrained</p>
                  <p className="text-[11px] text-emerald-600">MAE accuracy improved to 94.2%.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}