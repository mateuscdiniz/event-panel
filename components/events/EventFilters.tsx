'use client';

import type { EventStatus } from '@/types';
import { Select } from '@/components/ui/Select';
import { useT } from '@/hooks/useT';

export type StatusFilter = 'all' | EventStatus;
export type SortOrder = 'recent' | 'oldest';

interface EventFiltersProps {
  status: StatusFilter;
  onStatusChange: (status: StatusFilter) => void;
  sort: SortOrder;
  onSortChange: (sort: SortOrder) => void;
}

export function EventFilters({
  status,
  onStatusChange,
  sort,
  onSortChange,
}: EventFiltersProps) {
  const { t } = useT();

  const statusOptions = [
    { value: 'all', label: t('status.all') },
    { value: 'active', label: t('status.active') },
    { value: 'closed', label: t('status.closed') },
    { value: 'cancelled', label: t('status.cancelled') },
  ];
  const sortOptions = [
    { value: 'recent', label: t('sort.recent') },
    { value: 'oldest', label: t('sort.oldest') },
  ];

  return (
    <div className="flex gap-3">
      <div className="flex flex-1 flex-col gap-1 sm:flex-initial">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t('filters.status')}
        </span>
        <Select
          aria-label={t('filters.statusAria')}
          value={status}
          onChange={(v) => onStatusChange(v as StatusFilter)}
          options={statusOptions}
          className="w-full sm:w-40"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 sm:flex-initial">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          {t('filters.sort')}
        </span>
        <Select
          aria-label={t('filters.sortAria')}
          value={sort}
          onChange={(v) => onSortChange(v as SortOrder)}
          options={sortOptions}
          className="w-full sm:w-44"
        />
      </div>
    </div>
  );
}

export default EventFilters;
