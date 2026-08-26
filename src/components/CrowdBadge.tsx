import React from 'react';
export function CrowdBadge({ density }: {density: number;}) {
  let colorClass = 'bg-emerald-100 text-emerald-700';
  let label = 'Low';
  if (density >= 85) {
    colorClass = 'bg-red-100 text-red-700';
    label = 'Critical';
  } else if (density >= 65) {
    colorClass = 'bg-amber-100 text-amber-700';
    label = 'High';
  } else if (density >= 40) {
    colorClass = 'bg-yellow-100 text-yellow-700';
    label = 'Mod';
  }
  return (
    <span
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${colorClass}`}>
      
      {label}
    </span>);

}