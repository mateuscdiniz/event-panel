import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  trend?: string; // opcional, ex: "+3 nas últimas 2h"
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{label}</span>
        {icon && (
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-100">
            {icon}
          </span>
        )}
      </div>
      <span className="text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
        {value}
      </span>
      {trend && <span className="text-xs font-medium text-emerald-600">{trend}</span>}
    </div>
  );
}

export default MetricCard;
