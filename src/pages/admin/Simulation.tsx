import React, { useState, useMemo } from 'react';
import { useSriLankaSync } from '../../context/SriLankaSyncContext';
import { calculateSitePeakMetric } from '../../lib/peakCrowdEngine';
import {
  BrainCircuit,
  Sliders,
  Sparkles,
  CloudRain,
  Ship,
  Calendar,
  Flame,
  TrendingUp,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function Simulation() {
  const { sites } = useSriLankaSync();
  const [selectedScenario, setSelectedScenario] = useState<'custom' | 'poya' | 'monsoon' | 'cruise' | 'nudge_boost'>('poya');

  // Simulation Parameters
  const [generalSurgePercent, setGeneralSurgePercent] = useState<number>(35);
  const [monsoonSeverity, setMonsoonSeverity] = useState<number>(0);
  const [cruisePassengers, setCruisePassengers] = useState<number>(0);
  const [nudgeIncentiveMultiplier, setNudgeIncentiveMultiplier] = useState<number>(1.0);

  const applyPreset = (preset: 'poya' | 'monsoon' | 'cruise' | 'nudge_boost') => {
    setSelectedScenario(preset);
    if (preset === 'poya') {
      setGeneralSurgePercent(45);
      setMonsoonSeverity(0);
      setCruisePassengers(0);
      setNudgeIncentiveMultiplier(1.2);
    } else if (preset === 'monsoon') {
      setGeneralSurgePercent(-20);
      setMonsoonSeverity(70);
      setCruisePassengers(0);
      setNudgeIncentiveMultiplier(1.5);
    } else if (preset === 'cruise') {
      setGeneralSurgePercent(15);
      setMonsoonSeverity(0);
      setCruisePassengers(2500);
      setNudgeIncentiveMultiplier(1.0);
    } else if (preset === 'nudge_boost') {
      setGeneralSurgePercent(20);
      setMonsoonSeverity(0);
      setCruisePassengers(0);
      setNudgeIncentiveMultiplier(2.2); // Aggressive diversion
    }
  };

  const simulationResults = useMemo(() => {
    return sites.map((site) => {
      const baseMetric = calculateSitePeakMetric(site);
      let simulatedDensity = baseMetric.todayPeakDensity;

      // 1. General surge
      simulatedDensity += (simulatedDensity * (generalSurgePercent / 100));

      // 2. Monsoon effect: outdoor drops, indoor/heritage sheltered increases
      if (monsoonSeverity > 0) {
        if (site.category === 'Nature & Wildlife' || site.id.includes('sigiriya') || site.id.includes('mirissa')) {
          simulatedDensity -= (simulatedDensity * (monsoonSeverity / 150));
        } else if (site.category === 'Museum & Culture' || site.id.includes('dambulla') || site.id.includes('colombo')) {
          simulatedDensity += (simulatedDensity * (monsoonSeverity / 250));
        }
      }

      // 3. Cruise ship effect (concentrated on Western and Southern coast)
      if (cruisePassengers > 0) {
        if (site.region === 'Western' || site.region === 'Southern' || site.id.includes('colombo') || site.id.includes('galle')) {
          const addedPerc = (cruisePassengers / site.maxCapacity) * 35;
          simulatedDensity += addedPerc;
        }
      }

      // 4. Nudge incentive dampening effect
      if (nudgeIncentiveMultiplier > 1.0) {
        // High density sites get diverted towards lower density gems
        if (simulatedDensity > 75) {
          const diverted = (simulatedDensity - 70) * ((nudgeIncentiveMultiplier - 1.0) * 0.45);
          simulatedDensity = Math.max(65, simulatedDensity - diverted);
        }
      }

      simulatedDensity = Math.min(100, Math.max(10, Math.round(simulatedDensity)));
      const simulatedVisitors = Math.round((simulatedDensity / 100) * site.maxCapacity);
      const isCritical = simulatedDensity >= site.criticalThreshold || simulatedDensity >= 85;

      return {
        siteId: site.id,
        siteName: site.name.replace('Rock Fortress', '').replace('Royal Botanical Gardens', 'Botanical Gardens'),
        region: site.region,
        basePeakDensity: baseMetric.todayPeakDensity,
        simulatedDensity,
        diff: simulatedDensity - baseMetric.todayPeakDensity,
        baseVisitors: baseMetric.todayPeakVisitors,
        simulatedVisitors,
        isCritical,
        threshold: site.threshold,
        criticalThreshold: site.criticalThreshold
      };
    });
  }, [sites, generalSurgePercent, monsoonSeverity, cruisePassengers, nudgeIncentiveMultiplier]);

  const criticalCount = simulationResults.filter((s) => s.isCritical).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-display font-bold text-slate-900">
              AI "What-If" Predictive Scenario Sandbox
            </h1>
            <span className="bg-brand-100 text-brand-700 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-brand-300 flex items-center gap-1">
              <BrainCircuit size={12} /> LSTM Stress Tester
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Simulate island-wide festival surges, heavy monsoon storms, port cruise arrivals, and test the diversion capacity of gamified PathPoint incentives.
          </p>
        </div>
      </div>

      {/* Preset Scenario Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => applyPreset('poya')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedScenario === 'poya'
              ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
              : 'bg-white border-slate-200 hover:border-amber-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
              <Calendar size={14} className="text-amber-600" /> Full Moon Poya Surge
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">+45% volume across temples & cultural triangle.</p>
        </button>

        <button
          onClick={() => applyPreset('monsoon')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedScenario === 'monsoon'
              ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-400'
              : 'bg-white border-slate-200 hover:border-blue-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
              <CloudRain size={14} className="text-blue-600" /> Southwest Monsoon Storm
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Suppresses coastal walks; shifts to indoor museums.</p>
        </button>

        <button
          onClick={() => applyPreset('cruise')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedScenario === 'cruise'
              ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400'
              : 'bg-white border-slate-200 hover:border-purple-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
              <Ship size={14} className="text-purple-600" /> Colombo Port Cruise Liner
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">+2,500 simultaneous passengers on Colombo & Galle.</p>
        </button>

        <button
          onClick={() => applyPreset('nudge_boost')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            selectedScenario === 'nudge_boost'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400'
              : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles size={14} className="text-emerald-600" /> +200 PathPoints Diversion
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Aggressive reward nudges to protect fragile UNESCO sites.</p>
        </button>
      </div>

      {/* Interactive Controls Sandbox */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Sliders size={16} className="text-[#0D6E6E]" />
            <span>Interactive Stress Simulation Controls</span>
          </h3>
          <span className="text-xs font-semibold text-slate-500">
            {criticalCount} sites entering critical capacity under this model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
          {/* General Surge */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-slate-700">
              <span>National Volume Surge</span>
              <span className="font-mono text-[#0D6E6E]">{generalSurgePercent > 0 ? `+${generalSurgePercent}%` : `${generalSurgePercent}%`}</span>
            </div>
            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={generalSurgePercent}
              onChange={(e) => {
                setSelectedScenario('custom');
                setGeneralSurgePercent(parseInt(e.target.value, 10));
              }}
              className="w-full accent-[#0D6E6E]"
            />
            <span className="text-[10px] text-slate-400">Baseline island-wide tourist flux</span>
          </div>

          {/* Monsoon Severity */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Monsoon Rain Intensity</span>
              <span className="font-mono text-blue-600">{monsoonSeverity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={monsoonSeverity}
              onChange={(e) => {
                setSelectedScenario('custom');
                setMonsoonSeverity(parseInt(e.target.value, 10));
              }}
              className="w-full accent-blue-600"
            />
            <span className="text-[10px] text-slate-400">Shifts outdoor to sheltered attractions</span>
          </div>

          {/* Cruise Liner */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-slate-700">
              <span>Port Cruise Liner Surge</span>
              <span className="font-mono text-purple-600">+{cruisePassengers.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5000"
              step="500"
              value={cruisePassengers}
              onChange={(e) => {
                setSelectedScenario('custom');
                setCruisePassengers(parseInt(e.target.value, 10));
              }}
              className="w-full accent-purple-600"
            />
            <span className="text-[10px] text-slate-400">Sudden Western / Southern port load</span>
          </div>

          {/* Nudge Incentive Multiplier */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-bold text-slate-700">
              <span>PathPoints Nudge Power</span>
              <span className="font-mono text-emerald-600">{nudgeIncentiveMultiplier.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="3.0"
              step="0.2"
              value={nudgeIncentiveMultiplier}
              onChange={(e) => {
                setSelectedScenario('custom');
                setNudgeIncentiveMultiplier(parseFloat(e.target.value));
              }}
              className="w-full accent-emerald-600"
            />
            <span className="text-[10px] text-slate-400">Diversion strength of gamified rewards</span>
          </div>
        </div>
      </div>

      {/* Simulated Load Comparison Chart */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">
            Simulated Peak Density vs Baseline Today (%)
          </h3>
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-slate-300"></div> Baseline Today
            </span>
            <span className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded bg-[#0D6E6E]"></div> Simulated Peak
            </span>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={simulationResults}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="siteName" tick={{ fontSize: 9 }} interval={0} angle={-25} textAnchor="end" height={60} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="bg-slate-900 text-white p-2.5 rounded-lg text-xs shadow-lg space-y-1">
                        <p className="font-bold text-amber-300">{item.siteName}</p>
                        <p>Baseline: <strong>{item.basePeakDensity}%</strong></p>
                        <p>Simulated: <strong className={item.isCritical ? 'text-red-400' : 'text-emerald-400'}>{item.simulatedDensity}%</strong></p>
                        <p>Shift: <strong>{item.diff >= 0 ? `+${item.diff}%` : `${item.diff}%`}</strong></p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="basePeakDensity" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="simulatedDensity" fill="#0D6E6E" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
