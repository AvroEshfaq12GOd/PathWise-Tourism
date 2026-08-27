import React, { useState, useEffect } from 'react';
import { useSriLankaSync } from '../../context/SriLankaSyncContext';
import {
  AdminBroadcastAlert,
  getStoredBroadcasts,
  saveBroadcastAlert,
  toggleBroadcastActive,
  deleteBroadcastAlert
} from '../../lib/broadcastStore';
import { getSriLankaTime } from '../../lib/sriLankaContext';
import {
  Radio,
  Send,
  AlertTriangle,
  CloudRain,
  ShieldAlert,
  CheckCircle2,
  Trash2,
  Power,
  Sparkles,
  MapPin,
  Clock,
  Info
} from 'lucide-react';

export function Broadcast() {
  const { sites } = useSriLankaSync();
  const [broadcasts, setBroadcasts] = useState<AdminBroadcastAlert[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AdminBroadcastAlert['severity']>('capacity_advisory');
  const [targetSiteId, setTargetSiteId] = useState('all');
  const [actionRequired, setActionRequired] = useState('');
  const [redirectSiteName, setRedirectSiteName] = useState('');
  const [author, setAuthor] = useState('PathWise Operations Command');

  const sl = getSriLankaTime();

  useEffect(() => {
    setBroadcasts(getStoredBroadcasts());

    const handleUpdate = () => {
      setBroadcasts(getStoredBroadcasts());
    };
    window.addEventListener('pathwise_broadcast_update', handleUpdate);
    return () => window.removeEventListener('pathwise_broadcast_update', handleUpdate);
  }, []);

  const handleCreateBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const targetSiteObj = sites.find((s) => s.id === targetSiteId);
    const targetSiteName = targetSiteId === 'all' ? 'All Island-Wide Certified Sites' : targetSiteObj?.name || 'Selected Site';

    saveBroadcastAlert({
      title,
      message,
      severity,
      targetSiteId,
      targetSiteName,
      author,
      actionRequired: actionRequired.trim() ? actionRequired : undefined,
      redirectSiteName: redirectSiteName.trim() ? redirectSiteName : undefined
    });

    setTitle('');
    setMessage('');
    setActionRequired('');
    setRedirectSiteName('');
    setToastMsg('Priority broadcast alert dispatched live to all connected tourist applications.');
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleToggle = (id: string) => {
    const updated = toggleBroadcastActive(id);
    setBroadcasts(updated);
    setToastMsg('Broadcast status updated.');
    setTimeout(() => setToastMsg(null), 2500);
  };

  const handleDelete = (id: string) => {
    const updated = deleteBroadcastAlert(id);
    setBroadcasts(updated);
    setToastMsg('Broadcast alert removed.');
    setTimeout(() => setToastMsg(null), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-20 right-8 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 flex items-center gap-2 text-sm font-semibold animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-slate-900">
              Emergency & Dynamic Alert Broadcast Hub
            </h1>
            <span className="bg-purple-100 text-purple-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-purple-300 flex items-center gap-1">
              <Radio size={12} /> Push Alert Dispatcher
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Publish real-time safety directives, weather warnings, peak capacity advisories, and detour instructions directly to tourist mobile apps.
          </p>
        </div>

        <div className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs flex items-center gap-3">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-bold block">Active Alerts</span>
            <span className="font-mono font-bold text-amber-300 text-sm">
              {broadcasts.filter((b) => b.active).length} Broadcasting
            </span>
          </div>
        </div>
      </div>

      {/* Composer & Active Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Broadcast Composer Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Radio size={18} className="text-[#0D6E6E]" />
            <h3 className="font-bold text-slate-900 text-base">Create Broadcast Dispatch</h3>
          </div>

          <form onSubmit={handleCreateBroadcast} className="space-y-3.5 text-xs">
            {/* Title */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Alert Headline / Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Sigiriya Rock — Summit Staircase Staggering"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0D6E6E]"
              />
            </div>

            {/* Severity & Target Site */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="capacity_advisory">Capacity Advisory</option>
                  <option value="warning">Warning / Detour</option>
                  <option value="weather">Weather Alert</option>
                  <option value="emergency">Emergency Closure</option>
                  <option value="info">General Info</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Target Attraction</label>
                <select
                  value={targetSiteId}
                  onChange={(e) => setTargetSiteId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-900 focus:outline-none"
                >
                  <option value="all">Island-Wide (All Sites)</option>
                  {sites.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Broadcast Details / Instructions *</label>
              <textarea
                required
                rows={3}
                placeholder="Describe current congestion, weather condition, or gate restriction..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#0D6E6E]"
              ></textarea>
            </div>

            {/* Action Required / Alternative Site */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">Recommended Tourist Action</label>
              <input
                type="text"
                placeholder="e.g. Divert to Pidurangala Rock or explore Water Gardens"
                value={actionRequired}
                onChange={(e) => setActionRequired(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Alternative Gem</label>
                <input
                  type="text"
                  placeholder="e.g. Pidurangala Rock"
                  value={redirectSiteName}
                  onChange={(e) => setRedirectSiteName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Authorizing Agency</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#0D6E6E] hover:bg-[#095454] text-white py-2.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm transition-transform active:scale-95 text-xs mt-2"
            >
              <Send size={14} />
              <span>Broadcast to Connected Mobile Apps</span>
            </button>
          </form>
        </div>

        {/* Right Column: Live Broadcast Feeds & Controls */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>Active Broadcast Stream</span>
              <span className="bg-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full font-mono">
                {broadcasts.length} total
              </span>
            </h3>
            <span className="text-xs text-slate-500">Auto-synchronized with tourist apps</span>
          </div>

          <div className="space-y-3">
            {broadcasts.map((b) => {
              const isEmergency = b.severity === 'emergency';
              const isWarning = b.severity === 'warning';
              const isWeather = b.severity === 'weather';

              return (
                <div
                  key={b.id}
                  className={`rounded-2xl border p-4 shadow-xs transition-all ${
                    !b.active
                      ? 'bg-slate-50/70 border-slate-200 opacity-60'
                      : isEmergency
                      ? 'bg-red-50/50 border-red-200'
                      : isWarning
                      ? 'bg-amber-50/50 border-amber-200'
                      : isWeather
                      ? 'bg-blue-50/50 border-blue-200'
                      : 'bg-emerald-50/40 border-emerald-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                          isEmergency
                            ? 'bg-red-600 text-white'
                            : isWarning
                            ? 'bg-amber-500 text-white'
                            : isWeather
                            ? 'bg-blue-500 text-white'
                            : 'bg-[#0D6E6E] text-white'
                        }`}
                      >
                        {isEmergency ? (
                          <ShieldAlert size={18} />
                        ) : isWarning ? (
                          <AlertTriangle size={18} />
                        ) : isWeather ? (
                          <CloudRain size={18} />
                        ) : (
                          <Radio size={18} />
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                              b.active ? 'bg-slate-900 text-white' : 'bg-slate-300 text-slate-700'
                            }`}
                          >
                            {b.severity.replace('_', ' ')}
                          </span>

                          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                            <MapPin size={12} className="text-slate-400" />
                            <span>{b.targetSiteName}</span>
                          </span>

                          <span className="text-[11px] text-slate-400 font-mono">• {b.timestamp}</span>
                        </div>

                        <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
                        <p className="text-xs text-slate-700 leading-relaxed">{b.message}</p>

                        {b.actionRequired && (
                          <div className="bg-white/80 p-2.5 rounded-lg border border-slate-200/80 text-[11px] text-slate-800 mt-2">
                            <span className="font-bold text-[#0D6E6E]">Safety Instruction: </span>
                            <span>{b.actionRequired}</span>
                          </div>
                        )}

                        {b.redirectSiteName && (
                          <p className="text-[11px] font-bold text-purple-700 pt-1">
                            ★ Recommended Detour: {b.redirectSiteName} (+150 PathPoints active)
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                      <button
                        onClick={() => handleToggle(b.id)}
                        className={`p-2 rounded-lg border text-xs font-semibold flex items-center gap-1 transition-colors ${
                          b.active
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200'
                            : 'bg-slate-200 text-slate-600 border-slate-300 hover:bg-slate-300'
                        }`}
                        title={b.active ? 'Disable Broadcast' : 'Enable Broadcast'}
                      >
                        <Power size={13} />
                        <span>{b.active ? 'Broadcasting' : 'Paused'}</span>
                      </button>

                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-2 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 text-slate-400 transition-colors"
                        title="Delete Broadcast"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
