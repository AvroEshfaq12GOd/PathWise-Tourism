import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal } from '../../components/admin/Modal';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flame,
  Search,
  X,
  ExternalLink,
  Eye,
  Sliders,
  MapPin,
  TrendingUp,
  Sun,
  ShieldCheck,
  Navigation,
  Sparkles,
  Users
} from 'lucide-react';
import { getSitesLive, type LiveSite } from '../../lib/api';
import { SiteImage } from '../../lib/siteImages';
import { calculateSitePeakMetric } from '../../lib/peakCrowdEngine';

export function Sites() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<LiveSite | null>(null);
  const [inspectingSite, setInspectingSite] = useState<LiveSite | null>(null);
  const [sites, setSites] = useState<LiveSite[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Form State
  const [name, setName] = useState('');
  const [region, setRegion] = useState('Central');
  const [category, setCategory] = useState('Heritage');
  const [maxCapacity, setMaxCapacity] = useState('5000');
  const [lat, setLat] = useState('7.2906');
  const [lng, setLng] = useState('80.6337');
  const [isActive, setIsActive] = useState(true);

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
    return () => {
      mounted = false;
    };
  }, []);

  const regions = useMemo(() => {
    const set = new Set(sites.map((s) => s.region.split(' ')[0]));
    return ['All', ...Array.from(set)];
  }, [sites]);

  const categories = useMemo(() => {
    const set = new Set(sites.map((s) => s.category));
    return ['All', ...Array.from(set)];
  }, [sites]);

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const matchRegion =
        selectedRegion === 'All' ||
        site.region.toLowerCase().includes(selectedRegion.toLowerCase());
      const matchCategory =
        selectedCategory === 'All' ||
        site.category.toLowerCase() === selectedCategory.toLowerCase();
      const matchSearch =
        !searchQuery.trim() ||
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRegion && matchCategory && matchSearch;
    });
  }, [sites, selectedRegion, selectedCategory, searchQuery]);

  const openAddModal = () => {
    setEditingSite(null);
    setName('');
    setRegion('Central');
    setCategory('Heritage');
    setMaxCapacity('5000');
    setLat('7.2906');
    setLng('80.6337');
    setIsActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (site: LiveSite) => {
    setEditingSite(site);
    setName(site.name);
    setRegion(site.region);
    setCategory(site.category);
    setMaxCapacity(site.maxCapacity.toString());
    setLat(site.lat.toString());
    setLng(site.lng.toString());
    setIsActive(site.isActive);
    setIsModalOpen(true);
  };

  const handleDeleteSite = (id: string, siteName: string) => {
    if (confirm(`Are you sure you want to delete ${siteName}?`)) {
      setSites((prev) => prev.filter((s) => s.id !== id));
      if (inspectingSite?.id === id) setInspectingSite(null);
      setToastMsg(`Site "${siteName}" deleted successfully.`);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleSaveSite = () => {
    if (!name.trim()) return;

    if (editingSite) {
      // Update
      setSites((prev) =>
        prev.map((s) =>
          s.id === editingSite.id
            ? {
                ...s,
                name,
                region,
                category,
                maxCapacity: parseInt(maxCapacity, 10) || 5000,
                lat: parseFloat(lat) || 7.2906,
                lng: parseFloat(lng) || 80.6337,
                isActive
              }
            : s
        )
      );
      setToastMsg(`Site "${name}" updated.`);
    } else {
      // Create new
      const newSite: LiveSite = {
        id: `site-${Date.now()}`,
        name,
        region,
        category,
        maxCapacity: parseInt(maxCapacity, 10) || 5000,
        lat: parseFloat(lat) || 7.2906,
        lng: parseFloat(lng) || 80.6337,
        currentDensity: Math.floor(Math.random() * 40) + 20,
        trend: 'stable',
        threshold: 75,
        criticalThreshold: 85,
        isActive,
        imageUrl: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=800',
        weather: { temp: 28, condition: 'Sunny' },
        features: ['Historical Significance', 'Live Telemetry', 'LSTM v2.1'],
        forecastData: [
          { time: '08:00', density: 30, isForecast: false },
          { time: '10:00', density: 45, isForecast: false },
          { time: '12:00', density: 65, isForecast: false },
          { time: '14:00', density: 72, isForecast: true },
          { time: '16:00', density: 55, isForecast: true },
          { time: '18:00', density: 40, isForecast: true }
        ]
      };
      setSites((prev) => [newSite, ...prev]);
      setToastMsg(`Site "${name}" created.`);
    }

    setTimeout(() => setToastMsg(null), 3000);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Managed Tourist Sites & Telemetry Registry</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded-full font-bold">
              {sites.length} Active
            </span>
          </h2>
          <p className="text-sm text-slate-500">
            Search, select, inspect, and configure capacities and dual peak thresholds.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Eye size={16} /> Preview Tourist App
          </button>
          <button
            onClick={openAddModal}
            className="bg-[#0D6E6E] text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-[#095454] transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Site
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by site name (e.g. Jaffna, Sigiriya, Kandy), region, or keyword..."
              className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-[#0D6E6E] focus:ring-2 focus:ring-[#0D6E6E]/20 outline-none transition-all"
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

          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0D6E6E]/20 flex-1 md:flex-none"
            >
              <option value="All">All Regions</option>
              {regions.filter((r) => r !== 'All').map((r) => (
                <option key={r} value={r}>
                  {r} Province / Region
                </option>
              ))}
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#0D6E6E]/20 flex-1 md:flex-none"
            >
              <option value="All">All Categories</option>
              {categories.filter((c) => c !== 'All').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredSites.length}</strong> of {sites.length} sites
          </span>
          {(searchQuery || selectedRegion !== 'All' || selectedCategory !== 'All') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedRegion('All');
                setSelectedCategory('All');
              }}
              className="text-[#0D6E6E] font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Sites Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="px-6 py-4">Site Name</th>
                <th className="px-6 py-4">Region</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Operating Hours</th>
                <th className="px-6 py-4 bg-amber-50/60 text-amber-900 font-bold">Today's Peak Level & Window</th>
                <th className="px-6 py-4">Live Weather</th>
                <th className="px-6 py-4">Max Capacity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSites.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-500">
                    <p className="text-sm font-semibold">No sites match your search criteria.</p>
                    <p className="text-xs text-slate-400 mt-1">Try clearing your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                filteredSites.map((site) => {
                  const peakMetric = calculateSitePeakMetric(site);
                  const isSelected = inspectingSite?.id === site.id;
                  return (
                    <tr
                      key={site.id}
                      onClick={() => setInspectingSite(site)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        isSelected ? 'bg-emerald-50/40 ring-1 ring-inset ring-[#0D6E6E]' : ''
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                            <SiteImage
                              siteName={site.name}
                              src={site.imageUrl}
                              alt={site.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-900 block hover:text-[#0D6E6E]">
                              {site.name}
                            </span>
                            {site.unescoHeritage && (
                              <span className="text-[9px] font-extrabold text-blue-700 uppercase">
                                UNESCO
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">{site.region}</td>
                      <td className="px-6 py-4 text-slate-600">{site.category}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full w-fit ${
                              site.isOpen !== false
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                site.isOpen !== false ? 'bg-emerald-500' : 'bg-slate-400'
                              }`}
                            />
                            {site.isOpen !== false ? 'Open Now' : 'Closed'}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                            {site.operatingHours || '09:00 AM – 05:00 PM'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 bg-amber-50/30">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                                peakMetric.todayPeakDensity >= 85
                                  ? 'bg-red-600 text-white font-extrabold'
                                  : peakMetric.todayPeakDensity >= 70
                                  ? 'bg-amber-500 text-white font-bold'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {peakMetric.todayPeakDensity}% Peak
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              (~{peakMetric.todayPeakVisitors.toLocaleString()})
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] text-slate-700 font-semibold">
                            <Clock size={12} className="text-slate-400" />
                            <span>{peakMetric.peakWindowLabel}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 text-xs font-semibold">
                          ☀️ {site.weather?.temp ? `${site.weather.temp}°C` : '28°C'}{' '}
                          {site.weather?.condition || 'Clear'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600 font-semibold">
                        {site.maxCapacity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            site.isActive
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {site.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setInspectingSite(site)}
                            className="p-1.5 text-slate-500 hover:text-[#0D6E6E] transition-colors rounded-lg hover:bg-slate-100"
                            title="Inspect live site telemetry"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => openEditModal(site)}
                            className="p-1.5 text-slate-500 hover:text-brand-600 transition-colors rounded-lg hover:bg-slate-100"
                            title="Edit site properties"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSite(site.id, site.name)}
                            className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100"
                            title="Delete site"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin Site Inspector Modal */}
      {inspectingSite && (
        <Modal
          isOpen={Boolean(inspectingSite)}
          onClose={() => setInspectingSite(null)}
          title={`Admin Telemetry Inspector: ${inspectingSite.name}`}
        >
          <div className="space-y-4 font-sans max-w-lg">
            <div className="flex gap-3">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                <SiteImage
                  siteName={inspectingSite.name}
                  src={inspectingSite.imageUrl}
                  alt={inspectingSite.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-[#0D6E6E] border border-emerald-100 uppercase">
                    {inspectingSite.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{inspectingSite.region}</span>
                </div>
                <h3 className="font-bold text-base text-slate-900 leading-tight truncate">
                  {inspectingSite.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lat: {inspectingSite.lat.toFixed(4)}, Lng: {inspectingSite.lng.toFixed(4)}
                </p>
              </div>
            </div>

            {/* Live Metrics Matrix */}
            {(() => {
              const peakMetric = calculateSitePeakMetric(inspectingSite);
              return (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-medium block uppercase">
                        Current Density
                      </span>
                      <span className="text-base font-extrabold text-[#0D6E6E] font-mono">
                        {inspectingSite.currentDensity}%
                      </span>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-3 border border-amber-200">
                      <span className="text-[10px] text-amber-700 font-medium block uppercase">
                        Forecast Peak
                      </span>
                      <span className="text-base font-extrabold text-amber-900 font-mono">
                        {peakMetric.todayPeakDensity}%
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                      <span className="text-[10px] text-slate-500 font-medium block uppercase">
                        Max Capacity
                      </span>
                      <span className="text-base font-bold text-slate-800 font-mono">
                        {inspectingSite.maxCapacity.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Dual Peak Window Box */}
                  <div className="bg-slate-900 rounded-xl p-3.5 text-white space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                      <span className="flex items-center gap-1">
                        <Flame size={14} /> Dual Peak Windows
                      </span>
                      <span className="font-mono">{peakMetric.peakWindowLabel}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-white/10 rounded-lg p-2">
                        <span className="font-bold text-amber-200 block">
                          {peakMetric.primaryPeakWindow?.periodName || 'Primary Peak'}
                        </span>
                        <span className="font-mono">
                          {peakMetric.primaryPeakWindow?.label || '09:00 AM – 11:30 AM'}
                        </span>
                      </div>
                      <div className="bg-white/10 rounded-lg p-2">
                        <span className="font-bold text-amber-200 block">
                          {peakMetric.secondaryPeakWindow?.periodName || 'Secondary Peak'}
                        </span>
                        <span className="font-mono">
                          {peakMetric.secondaryPeakWindow?.label || '03:30 PM – 06:00 PM'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Quick Admin Actions */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setInspectingSite(null);
                  navigate(`/app/forecast?site=${inspectingSite.id}`);
                }}
                className="py-2.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <TrendingUp size={14} className="text-[#0D6E6E]" />
                <span>View AI Forecast</span>
              </button>

              <button
                onClick={() => {
                  setInspectingSite(null);
                  openEditModal(inspectingSite);
                }}
                className="py-2.5 px-3 rounded-lg bg-[#0D6E6E] hover:bg-[#095454] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <Edit2 size={14} />
                <span>Edit Site Parameters</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit / Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSite ? 'Edit Site Configuration' : 'Add New Monitored Site'}
      >
        <div className="space-y-4 font-sans">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Site Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none font-semibold"
              placeholder="e.g. Nallur Kandaswamy Kovil"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Region
              </label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="Central">Central Province</option>
                <option value="Northern">Northern Province (Jaffna)</option>
                <option value="Southern">Southern Coast</option>
                <option value="Western">Western Province (Colombo)</option>
                <option value="Eastern">Eastern Province (Trincomalee)</option>
                <option value="North Central">North Central (Anuradhapura/Polonnaruwa)</option>
                <option value="Uva">Uva Province (Ella)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
              >
                <option value="Heritage">Heritage & Ancient Fortress</option>
                <option value="Cultural">Cultural & Religious Landmark</option>
                <option value="Nature">Nature & Scenic Viewpoint</option>
                <option value="Wildlife">Wildlife & National Park</option>
                <option value="Coastal">Coastal & Beach Landmark</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Max Capacity
              </label>
              <input
                type="number"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
                placeholder="5000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Latitude
              </label>
              <input
                type="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                placeholder="7.2906"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Longitude
              </label>
              <input
                type="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none font-mono"
                placeholder="80.6337"
              />
            </div>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
              <span>Active in live crowd telemetry stream</span>
            </label>
          </div>
          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveSite}
              className="px-4 py-2 text-sm font-medium text-white bg-[#0D6E6E] hover:bg-[#095454] rounded-lg shadow-sm"
            >
              {editingSite ? 'Save Changes' : 'Save Site'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Sites;
