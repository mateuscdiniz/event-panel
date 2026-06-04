'use client';

import { useMemo, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { Calendar } from 'lucide-react';
import { useEvents } from '@/hooks/useEvents';
import { EventSearch } from '@/components/events/EventSearch';
import {
  EventFilters,
  type SortOrder,
  type StatusFilter,
} from '@/components/events/EventFilters';
import { EventCard } from '@/components/events/EventCard';
import { EventListSkeleton } from '@/components/events/EventListSkeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorState } from '@/components/ui/ErrorState';
import { useT } from '@/hooks/useT';

export default function EventsPage() {
  const { t } = useT();
  const { data, isLoading, isError, refetch } = useEvents();

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 300);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [sort, setSort] = useState<SortOrder>('recent');

  const filtered = useMemo(() => {
    const events = data?.data ?? [];
    const term = debouncedSearch.trim().toLowerCase();

    return events
      .filter((e) => (status === 'all' ? true : e.status === status))
      .filter((e) => (term ? e.name.toLowerCase().includes(term) : true))
      .sort((a, b) => {
        const diff = new Date(b.date).getTime() - new Date(a.date).getTime();
        return sort === 'recent' ? diff : -diff;
      });
  }, [data, debouncedSearch, status, sort]);

  const hasActiveFilters = debouncedSearch.trim() !== '' || status !== 'all';

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-100">
          {t('events.title')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('events.subtitle')}
        </p>
      </header>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <EventSearch value={search} onChange={setSearch} />
        <EventFilters
          status={status}
          onStatusChange={setStatus}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      {isLoading && <EventListSkeleton />}

      {isError && (
        <ErrorState
          message={t('events.errorLoad')}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <EmptyState
          icon={<Calendar className="h-6 w-6" />}
          title={t('events.emptyTitle')}
          description={
            hasActiveFilters
              ? t('events.emptyFiltered')
              : t('events.emptyNone')
          }
        />
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
