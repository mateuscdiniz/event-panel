'use client';

import type { EventStatus } from '@/types';
import { Select } from '@/components/ui/Select';

export type StatusFilter = 'all' | EventStatus;
export type SortOrder = 'recent' | 'oldest';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativo' },
  { value: 'closed', label: 'Encerrado' },
  { value: 'cancelled', label: 'Cancelado' },
];

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'recent', label: 'Mais recente' },
  { value: 'oldest', label: 'Mais antigo' },
];

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
  return (
    <div className="flex gap-3">
      <div className="flex flex-1 flex-col gap-1 sm:flex-initial">
        <span className="text-xs font-medium text-slate-500">Status</span>
        <Select
          aria-label="Filtrar por status"
          value={status}
          onChange={(v) => onStatusChange(v as StatusFilter)}
          options={STATUS_OPTIONS}
          className="w-full sm:w-40"
        />
      </div>

      <div className="flex flex-1 flex-col gap-1 sm:flex-initial">
        <span className="text-xs font-medium text-slate-500">Ordenar por data</span>
        <Select
          aria-label="Ordenar por data"
          value={sort}
          onChange={(v) => onSortChange(v as SortOrder)}
          options={SORT_OPTIONS}
          className="w-full sm:w-44"
        />
      </div>
    </div>
  );
}

export default EventFilters;
