import React from 'react';
import { Moon } from 'lucide-react';

interface CrowdGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  isOpen?: boolean;
}

export function CrowdGauge({
  percentage,
  size = 120,
  strokeWidth = 12,
  isOpen = true
}: CrowdGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Arc is 270 degrees (0.75 of circle)
  const arcLength = circumference * 0.75;
  const effectivePercentage = isOpen ? percentage : 0;
  const offset = arcLength - (effectivePercentage / 100) * arcLength;

  let colorClass = 'text-emerald-500';
  let label = 'Low';

  if (!isOpen) {
    colorClass = 'text-slate-400';
    label = 'Closed';
  } else if (percentage >= 85) {
    colorClass = 'text-red-500';
    label = 'Critical';
  } else if (percentage >= 65) {
    colorClass = 'text-amber-500';
    label = 'High';
  } else if (percentage >= 35) {
    colorClass = 'text-yellow-500';
    label = 'Moderate';
  }

  return (
    <div
      className="relative flex flex-col items-center justify-center font-sans"
      style={{
        width: size,
        height: size
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform rotate-[135deg]"
      >
        {/* Background Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          className="text-slate-100"
        />

        {/* Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`${colorClass} transition-all duration-700 ease-out`}
        />
      </svg>

      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        {!isOpen ? (
          <>
            <Moon size={size > 90 ? 20 : 14} className="text-slate-600 mb-0.5" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Closed
            </span>
          </>
        ) : (
          <>
            <span
              className="font-display font-black text-slate-900 tracking-tight"
              style={{ fontSize: size * 0.26 }}
            >
              {Math.round(percentage)}%
            </span>
            <span
              className={`font-extrabold uppercase tracking-wider ${
                percentage >= 85
                  ? 'text-red-600'
                  : percentage >= 65
                  ? 'text-amber-600'
                  : percentage >= 35
                  ? 'text-yellow-600'
                  : 'text-emerald-600'
              }`}
              style={{ fontSize: size * 0.11 }}
            >
              {label}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
