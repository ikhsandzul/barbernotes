import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'accent' | 'default';
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-br from-slate-900 to-slate-800 text-white border-slate-700';
      case 'accent':
        return 'bg-gradient-to-br from-amber-500 to-amber-600 text-white border-amber-400';
      default:
        return 'bg-white text-slate-800 border-slate-200';
    }
  };

  const getIconStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-slate-800/80 text-amber-400';
      case 'accent':
        return 'bg-white/20 text-white';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div
      className={`rounded-2xl p-4 shadow-sm border transition-all ${getVariantStyles()}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider opacity-85">
          {title}
        </span>
        <div className={`p-2 rounded-xl ${getIconStyles()}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="mt-2">
        <div className="text-2xl font-black tracking-tight">{value}</div>
        {subtitle && (
          <p className="text-[11px] mt-0.5 opacity-75">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
