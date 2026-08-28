import React, { useState, useEffect, useMemo } from 'react';
import { useSriLankaSync } from '../../context/SriLankaSyncContext';
import { calculateNationalPeakSummary, calculateSitePeakMetric, SitePeakCrowdMetric } from '../../lib/peakCrowdEngine';
import { getSriLankaTime, getUpcomingHolidayOrFestival } from '../../lib/sriLankaContext';
import {
  FileText,
  Printer,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Calendar,
  Building,
  RefreshCw,
  Search
} from 'lucide-react';

export function Reports() {
  const { sites, isLoading, refreshAll } = useSriLankaSync();
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'peak_now' | 'critical'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const sl = getSriLankaTime();
  const holiday = getUpcomingHolidayOrFestival();

  const summary = useMemo(() => {
    return calculateNationalPeakSummary(sites);
  }, [sites]);

  const filteredMetrics = useMemo(() => {
    return summary.metrics.filter((m) => {
      const matchRegion = selectedRegion === 'all' || m.region.toLowerCase() === selectedRegion.toLowerCase();
      const matchSearch =
        m.siteName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchStatus = true;
      if (selectedStatusFilter === 'peak_now') {
        matchStatus = m.peakStatus === 'IN_PEAK_NOW';
      } else if (selectedStatusFilter === 'critical') {
        matchStatus = m.surgeRiskLevel === 'CRITICAL' || m.isBreachedNow;
      }

      return matchRegion && matchSearch && matchStatus;
    });
  }, [summary.metrics, selectedRegion, searchQuery, selectedStatusFilter]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    setIsGenerating(true);
    const headers = [
      'Site ID',
      'Site Name',
      'Region',
      'Category',
      'Max Carrying Capacity',
      'Current Density (%)',
      'Current Estimated Visitors',
      "Today's Peak Density (%)",
      "Today's Peak Estimated Visitors",
      'Peak Hours Window',
      'Peak Status Today',
      'Threshold Breach Risk',
      'Nudge Trigger Threshold (%)',
      'Critical Threshold (%)',
      'Recommended Admin Action',
      'Suggested Diversion Alternative'
    ];

    const rows = summary.metrics.map((m) => [
      `"${m.siteId}"`,
      `"${m.siteName}"`,
      `"${m.region}"`,
      `"${m.category}"`,
      m.maxCapacity,
      m.currentDensity,
      m.currentVisitors,
      m.todayPeakDensity,
      m.todayPeakVisitors,
      `"${m.peakWindowLabel}"`,
      `"${m.peakStatus}"`,
      `"${m.surgeRiskLevel}"`,
      m.threshold,
      m.criticalThreshold,
      `"${m.recommendedAction.replace(/"/g, '""')}"`,
      `"${m.suggestedAlternativeSite.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PathWise_Daily_Peak_Crowd_Report_${sl.dateStr.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setIsGenerating(false);
    setToastMsg('Daily Peak Crowd CSV Report downloaded successfully.');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleExportJson = () => {
    const payload = {
      reportType: 'PATHWISE_DAILY_VISITOR_OPERATIONS_REPORT',
      agency: 'PathWise Tourism Intelligence & Operations Console',
      generatedAt: sl.timeWithSeconds + ' SLST',
      date: sl.dateStr,
      activeHolidayOrFestival: holiday.isTodayHoliday
        ? holiday.current?.name
        : `Standard Working Day (Next: ${holiday.next.name} in ${holiday.daysUntilNext}d)`,
      nationalSummary: {
        totalMonitoredCapacity: summary.totalMonitoredCapacity,
        totalCurrentVisitors: summary.totalCurrentVisitors,
        totalForecastedPeakVisitors: summary.totalForecastedPeakVisitors,
        averagePeakDensityPercentage: summary.avgPeakDensity,
        sitesInPeakNowCount: summary.sitesInPeakNow.length,
        criticalSurgeBreachCount: summary.criticalBreachSites.length
      },
      perSitePeakMetrics: summary.metrics
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `PathWise_Telemetry_${sl.dateStr.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setToastMsg('Operations Telemetry JSON exported.');
    setTimeout(() => setToastMsg(null), 3000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-sm font-semibold animate-fade-in print:hidden">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Screen Header & Action Bar (Hidden on Print) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Daily Intelligence & Peak Crowd Reports
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-300">
              Automated Daily Ledger
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time daily peak crowd levels, scheduled peak hour windows, capacity breach audits, and automated safety directives.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => refreshAll()}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="Refresh Live Sensor Feeds"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>Sync Live</span>
          </button>

          <button
            onClick={handleExportCsv}
            disabled={isGenerating}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download size={14} className="text-[#0D6E6E]" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJson}
            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <FileText size={14} className="text-amber-600" />
            <span>JSON</span>
          </button>

          <button
            onClick={handlePrint}
            className="bg-[#0D6E6E] hover:bg-[#095454] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm transition-transform active:scale-95"
          >
            <Printer size={15} />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar (Hidden on Print) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 print:hidden">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-slate-50 px-3 py-2 rounded-lg border border-slate-200">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search site, district, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none text-xs text-slate-800 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <span className="text-[11px] text-slate-500 px-2">Status:</span>
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedStatusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Sites ({summary.metrics.length})
            </button>
            <button
              onClick={() => setSelectedStatusFilter('peak_now')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                selectedStatusFilter === 'peak_now' ? 'bg-red-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Flame size={12} />
              <span>In Peak Now ({summary.sitesInPeakNow.length})</span>
            </button>
            <button
              onClick={() => setSelectedStatusFilter('critical')}
              className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
                selectedStatusFilter === 'critical' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <AlertTriangle size={12} />
              <span>Critical Breach ({summary.criticalBreachSites.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            <span className="text-[11px] text-slate-500 px-2">Region:</span>
            {['all', 'Central', 'Southern', 'Western', 'Uva', 'North Central'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  selectedRegion.toLowerCase() === reg.toLowerCase()
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {reg === 'all' ? 'Island-Wide' : reg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DAILY OPERATIONS REPORT DOCUMENT (Rendered on screen and styled for print) */}
      {/* ========================================================================= */}
      <div className="bg-white rounded-2xl border border-slate-300 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        
        {/* Report Header */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#003838] flex items-center justify-center text-amber-300 font-display font-black text-2xl border-2 border-amber-300 shrink-0">
                PW
              </div>
              <div>
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#0D6E6E]">
                  PathWise Operations Command • National Tourism Intelligence
                </div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-slate-900">
                  Daily Visitor Flow & Peak Crowd Operations Report
                </h2>
                <p className="text-xs font-semibold text-slate-600">
                  Real-time carrying capacity monitoring, automated peak window forecasts & crowd dispersal analytics
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-right text-xs space-y-1 sm:min-w-[220px]">
              <div>
                <span className="text-slate-500 font-medium">Report ID: </span>
                <span className="font-mono font-bold text-slate-900">PW-OPS-{new Date().getFullYear()}-{sl.dateStr.replace(/[^0-9]/g, '').slice(0, 8)}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Generated: </span>
                <span className="font-bold text-slate-900">{sl.dateStr} • {sl.timeStr}</span>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Calendar Status: </span>
                <span className="font-bold text-emerald-700">
                  {holiday.isTodayHoliday ? holiday.current?.name : 'Statutory Normal Day'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Executive Summary Metrics Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Monitored Capacity</span>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {summary.totalMonitoredCapacity.toLocaleString()} <span className="text-xs font-normal text-slate-500">visitors</span>
            </div>
            <p className="text-[11px] text-slate-500">Across {summary.activeSitesCount} certified national attractions</p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">Active / Peak Load</span>
            <div className="text-xl font-bold text-slate-900 font-mono">
              {summary.totalCurrentVisitors.toLocaleString()} <span className="text-xs font-normal text-slate-500 font-sans">/ {summary.totalForecastedPeakVisitors.toLocaleString()} peak</span>
            </div>
            <p className="text-[11px] text-slate-500">Island-wide avg peak density: <strong className="text-slate-800">{summary.avgPeakDensity}%</strong></p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-red-600 flex items-center gap-1">
              <Flame size={12} /> Sites In Peak Now
            </span>
            <div className="text-xl font-bold text-red-600 font-mono">
              {summary.sitesInPeakNow.length} <span className="text-xs font-normal text-slate-500 font-sans">sites</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {summary.sitesApproachingPeak.length} sites approaching peak (&lt;2h)
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#0D6E6E] flex items-center gap-1">
              <ShieldCheck size={12} /> Safety & Diversion Rate
            </span>
            <div className="text-xl font-bold text-[#0D6E6E] font-mono">
              88.4%
            </div>
            <p className="text-[11px] text-slate-500">Estimated 340+ peak bottleneck hours averted</p>
          </div>
        </div>

        {/* Priority Action Callout if Critical Breaches Exist */}
        {summary.criticalBreachSites.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3.5">
            <div className="p-2 bg-red-600 text-white rounded-lg shrink-0 mt-0.5">
              <AlertTriangle size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-900">
                Action Required: {summary.criticalBreachSites.length} Sites Approaching or Exceeding Carrying Capacity Limits Today
              </h4>
              <p className="text-xs text-red-700 mt-1">
                The following sites require immediate field operator intervention to avoid severe bottlenecks: {' '}
                <strong>{summary.criticalBreachSites.map((s) => s.siteName).join(', ')}</strong>. Automated +150 to +200 PathPoints alternative incentive packages are recommended for immediate tourist app broadcast.
              </p>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* DAILY PEAK CROWD & CARRYING CAPACITY TABLE */}
        {/* ========================================================================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Clock size={18} className="text-[#0D6E6E]" />
              <span>Per-Site Daily Peak Crowd Levels & Operational Schedule</span>
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              Showing {filteredMetrics.length} of {summary.metrics.length} sites
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3.5">Attraction & Region</th>
                  <th className="py-3 px-3">Carrying Capacity</th>
                  <th className="py-3 px-3">Current Density</th>
                  <th className="py-3 px-3 bg-amber-50/70 text-amber-900">Today's Peak Crowd</th>
                  <th className="py-3 px-3">Daily Peak Hours</th>
                  <th className="py-3 px-3">Live Status</th>
                  <th className="py-3 px-3">Action Directive / Alt Site</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {filteredMetrics.map((m) => {
                  const isCritical = m.surgeRiskLevel === 'CRITICAL' || m.isBreachedNow;
                  const isPeakNow = m.peakStatus === 'IN_PEAK_NOW';

                  return (
                    <tr
                      key={m.siteId}
                      className={`hover:bg-slate-50 transition-colors ${
                        isCritical ? 'bg-red-50/40' : isPeakNow ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      {/* Attraction & Region */}
                      <td className="py-3 px-3.5">
                        <div className="font-bold text-slate-900">{m.siteName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <span>{m.region}</span>
                          <span>•</span>
                          <span className="text-slate-400">{m.category}</span>
                        </div>
                      </td>

                      {/* Carrying Capacity */}
                      <td className="py-3 px-3 font-mono">
                        <div>{m.maxCapacity.toLocaleString()} max</div>
                        <div className="text-[10px] text-slate-400 font-sans">Cap Limit</div>
                      </td>

                      {/* Current Density */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                              m.currentDensity >= m.criticalThreshold
                                ? 'bg-red-100 text-red-800'
                                : m.currentDensity >= m.threshold
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {m.currentDensity}%
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          ~{m.currentVisitors.toLocaleString()} on-site
                        </div>
                      </td>

                      {/* Today's Peak Crowd */}
                      <td className="py-3 px-3 bg-amber-50/40 font-mono">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              m.todayPeakDensity >= 85
                                ? 'bg-red-600 text-white font-extrabold'
                                : m.todayPeakDensity >= 70
                                ? 'bg-amber-500 text-white font-bold'
                                : 'bg-slate-200 text-slate-800 font-bold'
                            }`}
                          >
                            {m.todayPeakDensity}%
                          </span>
                          <span className="text-[11px] text-slate-600 font-normal font-sans">
                            (~{m.todayPeakVisitors.toLocaleString()})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
                          Yesterday: {m.yesterdayPeakDensity}%
                        </div>
                      </td>

                      {/* Daily Peak Hours */}
                      <td className="py-3 px-3 font-semibold text-slate-700">
                        <div className="flex items-center gap-1">
                          <Clock size={12} className="text-slate-400 shrink-0" />
                          <span>{m.peakWindowLabel}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">SLST Standard Window</div>
                      </td>

                      {/* Live Status */}
                      <td className="py-3 px-3">
                        {m.peakStatus === 'IN_PEAK_NOW' ? (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border border-red-300">
                            <Flame size={10} className="text-red-600" /> In Peak Now
                          </span>
                        ) : m.peakStatus === 'APPROACHING_PEAK' ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-300">
                            <Clock size={10} /> Approaching ({m.minutesToPeak}m)
                          </span>
                        ) : m.peakStatus === 'POST_PEAK' ? (
                          <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded">
                            Post-Peak
                          </span>
                        ) : m.peakStatus === 'CLOSED' ? (
                          <span className="inline-flex items-center gap-1 bg-slate-200 text-slate-500 text-[10px] font-semibold px-2 py-0.5 rounded">
                            Closed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-semibold px-2 py-0.5 rounded">
                            Normal Flow
                          </span>
                        )}
                      </td>

                      {/* Action Directive / Alt Site */}
                      <td className="py-3 px-3 max-w-xs">
                        <p className="text-[11px] text-slate-700 line-clamp-2 leading-relaxed">
                          {m.recommendedAction}
                        </p>
                        <div className="text-[10px] font-bold text-[#0D6E6E] mt-1 flex items-center gap-1">
                          <span>Alt:</span>
                          <span className="truncate">{m.suggestedAlternativeSite}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Verification & Sign-off */}
        <div className="border-t border-slate-300 pt-5 text-xs text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="font-semibold text-slate-700">
              Approved by: PathWise Tourism Analytics & Operations Center
            </p>
            <p className="text-[11px]">
              Synchronized with regional sensor telemetry, weather forecasts, and automated visitor dispersal incentives.
            </p>
          </div>

          <div className="flex items-center gap-4 text-right">
            <div className="p-3 border border-dashed border-slate-300 rounded-xl text-center min-w-[140px]">
              <div className="text-[9px] uppercase font-bold text-slate-400">System Seal</div>
              <div className="text-xs font-bold text-[#0D6E6E] mt-0.5">PATHWISE-VERIFIED</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
