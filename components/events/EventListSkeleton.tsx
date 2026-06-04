// Exemplo de uso:
//   {isLoading && <EventListSkeleton />}

'use client';

import { Skeleton } from '@/components/ui/Skeleton';
import { useT } from '@/hooks/useT';

const CARDS = 6;

export function EventListSkeleton() {
  const { t } = useT();
  return (
    <div
      role="status"
      aria-label={t('events.loadingAria')}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: CARDS }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
      <span className="sr-only">{t('events.loadingAria')}</span>
    </div>
  );
}

export default EventListSkeleton;
