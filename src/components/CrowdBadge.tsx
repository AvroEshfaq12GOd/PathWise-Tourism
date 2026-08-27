import React from 'react';
import { Moon } from 'lucide-react';

interface CrowdBadgeProps {
  density: number;
  isOpen?: boolean;
}

export function CrowdBadge({ density, isOpen = true }: CrowdBadgeProps) {
  if (!isOpen) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-slate-800 text-slate-200 border border-slate-700 shadow-xs">
        <Moon size={9} className="text-amber-300" />
        <span>Closed</span>
      </span>
    );
  }

  let colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
  let label = 'Low';
  if (density >= 85) {
    colorClass = 'bg-red-100 text-red-800 border-red-200';
    label = 'Critical';
  } else if (density >= 65) {
    colorClass = 'bg-amber-100 text-amber-900 border-amber-200';
    label = 'High';
  } else if (density >= 35) {
    colorClass = 'bg-yellow-100 text-yellow-900 border-yellow-200';
    label = 'Moderate';
  }

  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-2xs ${colorClass}`}
    >
      {label}
    </span>
  );
}
