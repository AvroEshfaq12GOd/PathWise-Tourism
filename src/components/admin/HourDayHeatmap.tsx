import React from 'react';
interface HourDayHeatmapProps {
  data: number[][]; // 7 days x 24 hours
}
export function HourDayHeatmap({ data }: HourDayHeatmapProps) {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const getColor = (val: number) => {
    if (val > 80) return 'bg-brand-700';
    if (val > 60) return 'bg-brand-500';
    if (val > 40) return 'bg-brand-300';
    if (val > 20) return 'bg-brand-200';
    return 'bg-slate-100';
  };
  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="flex ml-8 mb-2">
          {Array.from({
            length: 24
          }).map((_, i) =>
          <div
            key={i}
            className="flex-1 text-[10px] text-slate-400 text-center">
            
              {i % 3 === 0 ? `${i}h` : ''}
            </div>
          )}
        </div>
        {data.map((dayData, dayIdx) =>
        <div key={dayIdx} className="flex items-center mb-1 gap-1">
            <div className="w-8 text-xs font-medium text-slate-500">
              {days[dayIdx]}
            </div>
            <div className="flex-1 flex gap-1">
              {dayData.map((val, hourIdx) =>
            <div
              key={hourIdx}
              className={`flex-1 aspect-square rounded-sm ${getColor(val)} transition-colors hover:ring-2 hover:ring-slate-400 cursor-pointer`}
              title={`${days[dayIdx]} ${hourIdx}:00 - Intensity: ${val}`} />

            )}
            </div>
          </div>
        )}
        <div className="flex items-center justify-end gap-2 mt-4 text-xs text-slate-500">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-slate-100"></div>
            <div className="w-3 h-3 rounded-sm bg-brand-200"></div>
            <div className="w-3 h-3 rounded-sm bg-brand-300"></div>
            <div className="w-3 h-3 rounded-sm bg-brand-500"></div>
            <div className="w-3 h-3 rounded-sm bg-brand-700"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    </div>);

}