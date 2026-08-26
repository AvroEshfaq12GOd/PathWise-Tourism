import React, { useEffect, useState } from 'react';
import { AlertCircle, Save } from 'lucide-react';
import { getSitesLive, type LiveSite } from '../../lib/api';
export function Thresholds() {
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
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-brand-50 border border-brand-200 rounded-xl p-5 flex items-start gap-4">
        <AlertCircle className="text-brand-600 mt-0.5" size={20} />
        <div>
          <h3 className="font-bold text-brand-900">How Thresholds Work</h3>
          <p className="text-sm text-brand-700 mt-1">
            When a site's predicted density crosses the{' '}
            <strong>Nudge Trigger</strong>, the system begins routing users to
            alternatives. Crossing the <strong>Critical</strong> threshold sends
            push notifications to users already en route.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {sites.map((site) =>
        <div
          key={site.id}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
          
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-slate-900">{site.name}</h4>
                <p className="text-xs text-slate-500">
                  Current Density: {site.currentDensity}%
                </p>
              </div>
              <div className="px-2 py-1 bg-slate-100 rounded text-xs font-mono text-slate-600">
                Cap: {site.maxCapacity}
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="font-medium text-slate-700">
                    Nudge Trigger
                  </label>
                  <span className="font-bold text-amber-600">
                    {site.threshold}%
                  </span>
                </div>
                <input
                type="range"
                min="50"
                max="100"
                defaultValue={site.threshold}
                className="w-full accent-amber-500" />
              
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <label className="font-medium text-slate-700">
                    Critical Alert
                  </label>
                  <span className="font-bold text-red-600">
                    {site.criticalThreshold}%
                  </span>
                </div>
                <input
                type="range"
                min="70"
                max="100"
                defaultValue={site.criticalThreshold}
                className="w-full accent-red-500" />
              
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input
                  type="checkbox"
                  className="rounded text-brand-600 focus:ring-brand-500" />
                
                  High-Risk Day Override
                </label>
                <button className="text-brand-700 hover:bg-brand-50 p-2 rounded-lg transition-colors">
                  <Save size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>);

}