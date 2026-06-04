// Exemplo de uso:
//   <Skeleton className="h-4 w-32" />
//   <Skeleton className="h-10 w-10 rounded-full" />

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={cn('animate-pulse rounded-md bg-slate-200/70 dark:bg-slate-700/50', className)}
    />
  );
}

export default Skeleton;
