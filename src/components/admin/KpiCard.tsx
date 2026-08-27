import { LucideIcon } from 'lucide-react';
interface KpiCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}
export function KpiCard({
  title,
  value,
  icon: Icon,
  trend,
  trendUp
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-slate-500">{title}</h3>
        <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-bold text-slate-900">{value}</div>
        {trend &&
        <div
          className={`text-sm font-semibold ${trendUp ? 'text-emerald-700' : 'text-slate-600'}`}>
          
            {trendUp ? '↑' : '↓'} {trend}
          </div>
        }
      </div>
    </div>);

}