'use client';

import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  Users,
} from 'lucide-react';
import type { EventDetail, Participant, ParticipantStatus } from '@/types';
import { useCheckinStore } from '@/store/checkinStore';
import { deriveStatus } from '@/lib/checkin';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Select } from '@/components/ui/Select';
import { CheckinButton } from './CheckinButton';

interface ParticipantTableProps {
  event: EventDetail;
}

type SortKey = 'name' | 'type' | 'status';
type SortDir = 'asc' | 'desc';
type PageSize = 5 | 10 | 20;

interface RankedParticipant {
  participant: Participant;
  status: ParticipantStatus;
}

const TYPE_LABELS = { vip: 'VIP', normal: 'Normal' } as const;
const STATUS_LABELS: Record<ParticipantStatus, string> = {
  inside: 'Dentro',
  outside: 'Fora',
};
const PAGE_SIZES: PageSize[] = [5, 10, 20];
const SORT_LABELS: Record<SortKey, string> = {
  name: 'Nome',
  type: 'Tipo',
  status: 'Status',
};

function compareRows(a: RankedParticipant, b: RankedParticipant, key: SortKey): number {
  if (key === 'type') return a.participant.type.localeCompare(b.participant.type);
  if (key === 'status') return a.status.localeCompare(b.status);
  return a.participant.name.localeCompare(b.participant.name, 'pt-BR');
}

export function ParticipantTable({ event }: ParticipantTableProps) {
  const checkins = useCheckinStore((s) => s.checkins);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [pageSize, setPageSize] = useState<PageSize>(5);
  const [page, setPage] = useState(0);

  // Status atual de cada participante (considerando check-ins locais) + ordenação.
  const rows = useMemo<RankedParticipant[]>(() => {
    const list = event.participants ?? [];
    const ranked = list.map((p) => ({
      participant: p,
      status: deriveStatus(
        p,
        checkins.filter((c) => c.participant_id === p.id)
      ),
    }));
    const dir = sortDir === 'asc' ? 1 : -1;
    return ranked.sort((a, b) => dir * compareRows(a, b, sortKey));
  }, [event.participants, checkins, sortKey, sortDir]);

  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages - 1);
  const start = currentPage * pageSize;
  const visible = rows.slice(start, start + pageSize);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(0);
  }

  function handlePageSizeChange(size: PageSize) {
    setPageSize(size);
    setPage(0);
  }

  if (total === 0) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="Nenhum participante"
        description="Este evento não possui participantes cadastrados."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Mobile: controle de ordenação (no desktop usa-se o cabeçalho) */}
      <div className="flex items-center gap-2 md:hidden">
        <span className="text-xs font-medium text-slate-500">Ordenar:</span>
        <Select
          aria-label="Ordenar participantes por"
          value={sortKey}
          onChange={(v) => {
            setSortKey(v as SortKey);
            setPage(0);
          }}
          options={(Object.keys(SORT_LABELS) as SortKey[]).map((k) => ({
            value: k,
            label: SORT_LABELS[k],
          }))}
          className="w-36"
        />
        <button
          type="button"
          onClick={() => setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))}
          aria-label={sortDir === 'asc' ? 'Ordem crescente' : 'Ordem decrescente'}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50"
        >
          {sortDir === 'asc' ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Desktop / tablet: tabela com cabeçalho ordenável + paginação no rodapé do card */}
      <div className="hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto rounded-t-xl">
          <table className="w-full min-w-[640px] table-fixed divide-y divide-slate-200 text-sm">
            {/* Larguras fixas por coluna → não "sambam" ao paginar */}
            <colgroup>
              <col />
              <col className="w-28" />
              <col className="w-32" />
              <col className="w-48" />
            </colgroup>
            <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <tr>
                <SortableHeader columnKey="name" sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
                  Nome
                </SortableHeader>
                <SortableHeader columnKey="type" sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
                  Tipo
                </SortableHeader>
                <SortableHeader columnKey="status" sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
                  Status
                </SortableHeader>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((row) => (
                <ParticipantRow key={row.participant.id} row={row} event={event} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-200 px-4 py-3">
          <PaginationControls
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            start={start}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          />
        </div>
      </div>

      {/* Mobile: cards empilhados + paginação no rodapé */}
      <div className="flex flex-col gap-3 md:hidden">
        {visible.map((row) => (
          <ParticipantMobileCard key={row.participant.id} row={row} event={event} />
        ))}
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-3">
          <PaginationControls
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
            start={start}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(0, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          />
        </div>
      </div>
    </div>
  );
}

interface PaginationControlsProps {
  pageSize: PageSize;
  onPageSizeChange: (size: PageSize) => void;
  start: number;
  total: number;
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

function PaginationControls({
  pageSize,
  onPageSizeChange,
  start,
  total,
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="flex flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
      <div className="flex items-center gap-2">
        <span>Por página:</span>
        <Select
          aria-label="Itens por página"
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange(Number(v) as PageSize)}
          options={PAGE_SIZES.map((size) => ({
            value: String(size),
            label: String(size),
          }))}
          className="w-20"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="tabular-nums">
          {start + 1}–{Math.min(start + pageSize, total)} de {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrev}
            disabled={currentPage === 0}
            aria-label="Página anterior"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="px-1 tabular-nums text-slate-600">
            {currentPage + 1} / {totalPages}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={currentPage >= totalPages - 1}
            aria-label="Próxima página"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-300 text-slate-600 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface SortableHeaderProps {
  columnKey: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
  children: React.ReactNode;
}

function SortableHeader({
  columnKey,
  sortKey,
  sortDir,
  onSort,
  children,
}: SortableHeaderProps) {
  const active = sortKey === columnKey;
  return (
    <th
      className="px-4 py-3"
      aria-sort={active ? (sortDir === 'asc' ? 'ascending' : 'descending') : 'none'}
    >
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        className="inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-slate-700"
      >
        {children}
        {active ? (
          sortDir === 'asc' ? (
            <ChevronUp className="h-3.5 w-3.5" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5" />
          )
        ) : (
          <ChevronsUpDown className="h-3.5 w-3.5 opacity-40" />
        )}
      </button>
    </th>
  );
}

function ParticipantRow({ row, event }: { row: RankedParticipant; event: EventDetail }) {
  const { participant, status } = row;
  return (
    <tr className="h-14 transition-colors hover:bg-slate-50">
      <td className="truncate px-4 py-3 font-medium text-slate-900" title={participant.name}>
        {participant.name}
      </td>
      <td className="px-4 py-3">
        <Badge variant={participant.type}>{TYPE_LABELS[participant.type]}</Badge>
      </td>
      <td className="px-4 py-3">
        <Badge variant={status}>{STATUS_LABELS[status]}</Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <CheckinButton participant={participant} event={event} />
      </td>
    </tr>
  );
}

function ParticipantMobileCard({
  row,
  event,
}: {
  row: RankedParticipant;
  event: EventDetail;
}) {
  const { participant, status } = row;
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <span className="font-medium text-slate-900">{participant.name}</span>
        <div className="flex gap-1.5">
          <Badge variant={participant.type}>{TYPE_LABELS[participant.type]}</Badge>
          <Badge variant={status}>{STATUS_LABELS[status]}</Badge>
        </div>
      </div>
      <CheckinButton participant={participant} event={event} />
    </div>
  );
}

export default ParticipantTable;
