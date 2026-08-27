import { useEffect, useState } from 'react';
import { Modal } from '../../components/admin/Modal';
import { Plus, Edit2, Trash2, CheckCircle2, AlertCircle, Clock, Flame } from 'lucide-react';
import { getSitesLive, type LiveSite } from '../../lib/api';
import { SiteImage } from '../../lib/siteImages';
import { calculateSitePeakMetric } from '../../lib/peakCrowdEngine';

export function Sites() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<LiveSite | null>(null);
  const [sites, setSites] = useState<LiveSite[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Managed Sites</h2>
          <p className="text-sm text-slate-500">
            Configure physical boundaries and capacities.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-brand-800 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add Site
        </button>
      </div>

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
              {sites.map((site) => {
                const peakMetric = calculateSitePeakMetric(site);
                return (
                <tr
                  key={site.id}
                  className="hover:bg-slate-50/50 transition-colors"
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
                        <span className="font-semibold text-slate-900 block">{site.name}</span>
                        {site.unescoHeritage && (
                          <span className="text-[9px] font-extrabold text-blue-700 uppercase">UNESCO</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{site.region}</td>
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
                      ☀️ {site.weather?.temp ? `${site.weather.temp}°C` : '28°C'} {site.weather?.condition || 'Clear'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-slate-600">
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
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(site)}
                        className="p-1.5 text-slate-400 hover:text-brand-600 transition-colors rounded-lg hover:bg-slate-100"
                        title="Edit site"
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
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSite ? 'Edit Site' : 'Add New Site'}
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
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
              placeholder="e.g. Lotus Tower"
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
                <option value="Central">Central</option>
                <option value="Western">Western</option>
                <option value="Southern">Southern</option>
                <option value="Northern">Northern</option>
                <option value="Eastern">Eastern</option>
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
                <option value="Heritage">Heritage</option>
                <option value="Nature">Nature</option>
                <option value="Cultural">Cultural</option>
                <option value="Urban">Urban</option>
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
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
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
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
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
              <span>Active in telemetry monitoring</span>
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
              className="px-4 py-2 text-sm font-medium text-white bg-brand-700 hover:bg-brand-800 rounded-lg shadow-sm"
            >
              {editingSite ? 'Save Changes' : 'Save Site'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
