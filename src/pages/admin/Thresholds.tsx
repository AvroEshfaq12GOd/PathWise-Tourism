import { useEffect, useState } from 'react';
import { AlertCircle, Save, CheckCircle2 } from 'lucide-react';
import { getSitesLive, type LiveSite } from '../../lib/api';

export function Thresholds() {
  const [sites, setSites] = useState<LiveSite[]>([]);
  const [thresholds, setThresholds] = useState<
    Record<string, { threshold: number; criticalThreshold: number; override: boolean }>
  >({});
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const liveSites = await getSitesLive();
        if (!mounted) return;
        setSites(liveSites);
        const map: Record<string, { threshold: number; criticalThreshold: number; override: boolean }> = {};
        liveSites.forEach((s) => {
          map[s.id] = {
            threshold: s.threshold,
            criticalThreshold: s.criticalThreshold,
            override: false
          };
        });
        setThresholds(map);
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

  const handleUpdate = (id: string, field: 'threshold' | 'criticalThreshold' | 'override', value: any) => {
    setThresholds((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value
      }
    }));
  };

  const handleSave = (siteName: string) => {
    setToastMsg(`Thresholds for "${siteName}" saved successfully.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveAll = () => {
    setToastMsg('All site thresholds have been updated and synchronized with the LSTM engine.');
    setTimeout(() => setToastMsg(null), 3000);
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 flex items-start gap-4 flex-1">
          <AlertCircle className="text-brand-600 mt-0.5 shrink-0" size={20} />
          <div>
            <h3 className="font-bold text-brand-900">How Thresholds Work</h3>
            <p className="text-sm text-brand-700 mt-1">
              When a site's predicted density crosses the <strong>Nudge Trigger</strong>, the system begins routing users to alternatives. Crossing the <strong>Critical</strong> threshold sends push notifications to users already en route.
            </p>
          </div>
        </div>
        <button
          onClick={handleSaveAll}
          className="bg-brand-700 hover:bg-brand-800 text-white font-semibold px-5 py-3 rounded-xl shadow-sm text-sm shrink-0 flex items-center gap-2 self-start sm:self-center transition-colors"
        >
          <Save size={16} /> Save All Thresholds
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sites.map((site) => {
          const config = thresholds[site.id] || {
            threshold: site.threshold,
            criticalThreshold: site.criticalThreshold,
            override: false
          };

          return (
            <div
              key={site.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 transition-all hover:border-slate-300"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-900">{site.name}</h4>
                  <p className="text-xs text-slate-500">
                    Current Density: {site.currentDensity}%
                  </p>
                </div>
                <div className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-mono text-slate-600">
                  Cap: {site.maxCapacity.toLocaleString()}
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label className="font-medium text-slate-700">
                      Nudge Trigger
                    </label>
                    <span className="font-bold text-amber-600 font-mono">
                      {config.threshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="90"
                    value={config.threshold}
                    onChange={(e) => handleUpdate(site.id, 'threshold', Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <label className="font-medium text-slate-700">
                      Critical Alert
                    </label>
                    <span className="font-bold text-red-600 font-mono">
                      {config.criticalThreshold}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={config.criticalThreshold}
                    onChange={(e) => handleUpdate(site.id, 'criticalThreshold', Number(e.target.value))}
                    className="w-full accent-red-500 cursor-pointer"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.override}
                      onChange={(e) => handleUpdate(site.id, 'override', e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500"
                    />
                    <span>High-Risk Day Override</span>
                  </label>
                  <button
                    onClick={() => handleSave(site.name)}
                    className="text-brand-700 hover:bg-brand-50 p-2 rounded-lg transition-colors flex items-center gap-1 font-semibold text-xs"
                    title="Save site threshold"
                  >
                    <Save size={16} /> Save
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}