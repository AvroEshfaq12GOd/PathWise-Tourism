import React from 'react';
interface CrowdGaugeProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
}
export function CrowdGauge({
  percentage,
  size = 120,
  strokeWidth = 12
}: CrowdGaugeProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Arc is 270 degrees (0.75 of circle)
  const arcLength = circumference * 0.75;
  const offset = arcLength - percentage / 100 * arcLength;
  let colorClass = 'text-emerald-500';
  let label = 'Low';
  if (percentage >= 85) {
    colorClass = 'text-red-500';
    label = 'Critical';
  } else if (percentage >= 65) {
    colorClass = 'text-amber-500';
    label = 'High';
  } else if (percentage >= 40) {
    colorClass = 'text-yellow-500';
    label = 'Moderate';
  }
  return (
    <div
      className="relative flex flex-col items-center justify-center"
      style={{
        width: size,
        height: size
      }}>
      
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform rotate-[135deg]">
        
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
          className="text-slate-100" />
        
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
          className={`${colorClass} transition-all duration-1000 ease-out`} />
        
      </svg>
      <div className="absolute flex flex-col items-center justify-center mt-2">
        <span className="text-3xl font-bold text-slate-800 tracking-tighter">
          {percentage}%
        </span>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider ${colorClass}`}>
          
          {label}
        </span>
      </div>
    </div>);

}