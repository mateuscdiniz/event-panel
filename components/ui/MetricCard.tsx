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
        'flex flex-col gap-2 rounded-xl border border-gray-200 bg-white p-5 shadow-sm',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{label}</span>
        {icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            {icon}
          </span>
        )}
      </div>
      <span className="text-3xl font-semibold tracking-tight text-gray-900">
        {value}
      </span>
      {trend && <span className="text-xs text-gray-400">{trend}</span>}
    </div>
  );
}

export default MetricCard;
