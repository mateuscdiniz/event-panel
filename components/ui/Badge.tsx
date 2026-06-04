import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'active'
  | 'closed'
  | 'cancelled'
  | 'vip'
  | 'normal'
  | 'inside'
  | 'outside';

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  // Status de evento
  active:
    'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/15 dark:text-green-300 dark:ring-green-400/20',
  closed:
    'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-500/15 dark:text-red-300 dark:ring-red-400/20',
  cancelled:
    'bg-gray-100 text-gray-600 ring-gray-400/30 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-500/30',
  // Tipo de participante
  vip: 'bg-amber-50 text-amber-700 ring-amber-600/30 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-400/20',
  normal:
    'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-500/30',
  // Status do participante
  inside:
    'bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-500/15 dark:text-green-300 dark:ring-green-400/20',
  outside:
    'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-slate-700/50 dark:text-slate-300 dark:ring-slate-500/30',
};

interface BadgeProps {
  variant: BadgeVariant;
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset',
        VARIANT_STYLES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export default Badge;
