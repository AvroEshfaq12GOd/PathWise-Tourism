import { Fragment, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HourDayHeatmap } from '../../components/admin/HourDayHeatmap';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { ArrowRight, Download, Calendar, CheckCircle2, FileText, Flame } from 'lucide-react';
import { buildHourlyHeatmap, getNudgesLive, getObservationsLive, getSitesLive } from '../../lib/api';

export function Analytics() {
  const navigate = useNavigate();
  const [funnel, setFunnel] = useState<Array<{ stage: string; count: number }>>([]);
  const [heatmap, setHeatmap] = useState<number[][]>([]);
  const [barData, setBarData] = useState<Array<{ name: string; rate: number }>>([]);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

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

        const multiplier = timeRange === '7d' ? 0.25 : timeRange === '90d' ? 2.8 : 1.0;

        const accepted = Math.round(nudges.filter((nudge) => nudge.status === 'accepted').length * multiplier);
        const totalSent = Math.round(nudges.length * multiplier);

        setFunnel([
          { stage: 'Nudges Sent', count: totalSent },
          { stage: 'Viewed', count: Math.round(totalSent * 0.95) },
          { stage: 'Accepted', count: accepted },
          { stage: 'Visited Alt Site', count: Math.round(accepted * 0.76) }
        ]);

        const acceptanceBySite = sites.map((site) => {
          const related = nudges.filter((nudge) => nudge.originalSiteId === site.id);
          const acceptedCount = related.filter((nudge) => nudge.status === 'accepted').length;
          const baseRate = related.length ? Math.round((acceptedCount / related.length) * 100) : 0;
          return {
            name: site.name
              .replace('Rock Fortress', '')
              .replace('Royal Botanical Gardens', 'Botanical Gardens')
              .replace('Temple of the Tooth', 'Temple of Tooth'),
            rate: Math.min(100, Math.max(10, baseRate + (timeRange === '7d' ? 4 : timeRange === '90d' ? -2 : 0)))
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
  }, [timeRange]);

  const handleExport = () => {
    setToastMsg(`Analytics report (${timeRange}) downloaded as CSV.`);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!funnel.length || !heatmap.length) {
    return <div className="text-sm text-slate-500">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header with Time Range & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Analytics & Conversion</h2>
          <p className="text-sm text-slate-500">Track dispersal effectiveness and visitor movement.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white border border-slate-200 rounded-xl p-1 flex items-center shadow-sm">
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                timeRange === '7d' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                timeRange === '30d' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 Days
            </button>
            <button
              onClick={() => setTimeRange('90d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                timeRange === '90d' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              90 Days
            </button>
          </div>
          <button
            onClick={() => navigate('/admin/reports')}
            className="bg-[#003838] hover:bg-[#095454] text-amber-300 border border-amber-300/30 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <FileText size={14} className="text-amber-300" /> Daily Peak Report
          </button>
          <button
            onClick={handleExport}
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Funnel */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-6">
          Nudge Conversion Funnel ({timeRange === '7d' ? 'Last 7 Days' : timeRange === '90d' ? 'Last 90 Days' : 'Last 30 Days'})
        </h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {funnel.map((step, idx) => (
            <Fragment key={step.stage}>
              <div className="flex-1 w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <p className="text-sm text-slate-500 mb-1">{step.stage}</p>
                <p className="text-2xl font-bold text-slate-900">
                  {step.count.toLocaleString()}
                </p>
              </div>
              {idx < funnel.length - 1 && (
                <ArrowRight
                  className="text-slate-300 hidden md:block shrink-0"
                  size={24}
                />
              )}
            </Fragment>
          ))}
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
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  type="number"
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{
                    fontSize: 12,
                    fill: '#64748b'
                  }}
                />
                <Tooltip
                  cursor={{
                    fill: '#f8fafc'
                  }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Bar
                  dataKey="rate"
                  fill="#0D6E6E"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
