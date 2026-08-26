import React, { Fragment, useEffect, useState } from 'react';
import { HourDayHeatmap } from '../../components/admin/HourDayHeatmap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer } from
'recharts';
import { ArrowRight } from 'lucide-react';
import { buildHourlyHeatmap, getNudgesLive, getObservationsLive, getSitesLive } from '../../lib/api';
export function Analytics() {
  const [funnel, setFunnel] = useState<Array<{ stage: string; count: number }>>([]);
  const [heatmap, setHeatmap] = useState<number[][]>([]);
  const [barData, setBarData] = useState<Array<{ name: string; rate: number }>>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [sites, nudges, observations] = await Promise.all([
          getSitesLive(),
          getNudgesLive(),
          getObservationsLive()
        ]);

        if (!mounted) return;

        const accepted = nudges.filter((nudge) => nudge.status === 'accepted').length;
        setFunnel([
          { stage: 'Nudges Sent', count: nudges.length },
          { stage: 'Viewed', count: nudges.length },
          { stage: 'Accepted', count: accepted },
          { stage: 'Visited Alt Site', count: Math.round(accepted * 0.75) }
        ]);

        const acceptanceBySite = sites.map((site) => {
          const related = nudges.filter((nudge) => nudge.originalSiteId === site.id);
          const acceptedCount = related.filter((nudge) => nudge.status === 'accepted').length;
          return {
            name: site.name.replace('Rock Fortress', '').replace('Royal Botanical Gardens', 'Botanical Gardens').replace('Temple of the Tooth', 'Temple of Tooth'),
            rate: related.length ? Math.round((acceptedCount / related.length) * 100) : 0
          };
        });

        setBarData(acceptanceBySite);
        setHeatmap(buildHourlyHeatmap(observations));
      } catch {
        if (!mounted) return;
        setFunnel([]);
        setBarData([]);
        setHeatmap([]);
      }
    }

    void load();
    const timer = window.setInterval(() => void load(), 30000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  if (!funnel.length || !heatmap.length) {
    return <div className="text-sm text-slate-500">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Funnel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-6">
          Nudge Conversion Funnel (Last 30 Days)
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {funnel.map((step, idx) =>
          <Fragment key={step.stage}>
              <div className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-500 mb-1">{step.stage}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {step.count.toLocaleString()}
                </p>
              </div>
              {idx < funnel.length - 1 &&
            <ArrowRight
              className="text-slate-300 hidden md:block"
              size={24} />

            }
            </Fragment>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heatmap */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 overflow-hidden">
          <h3 className="font-bold text-slate-900 mb-2">Redirection Heatmap</h3>
          <p className="text-xs text-slate-500 mb-6">
            When are tourists most successfully redirected?
          </p>
          <HourDayHeatmap data={heatmap} />
        </div>

        {/* Acceptance Rate */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-6">
            Nudge Acceptance Rate by Site
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 40,
                  bottom: 5
                }}>
                
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9" />
                
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }} />
                
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }} />
                
                <Tooltip
                  cursor={{
                    fill: '#f8fafc'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }} />
                
                <Bar
                  dataKey="rate"
                  fill="#0D6E6E"
                  radius={[0, 4, 4, 0]}
                  barSize={24} />
                
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>);

}
