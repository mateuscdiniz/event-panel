'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  CheckCircle,
  TrendingUp,
  Users,
  XCircle,
} from 'lucide-react';
import { useEvent } from '@/hooks/useEvent';
import { useCheckinStore } from '@/store/checkinStore';
import { MetricCard } from '@/components/ui/MetricCard';
import { Badge } from '@/components/ui/Badge';
import { ErrorState } from '@/components/ui/ErrorState';
import { Skeleton } from '@/components/ui/Skeleton';
import { CheckinChart } from '@/components/dashboard/CheckinChart';
import { ParticipantTable } from '@/components/dashboard/ParticipantTable';
import {
  EVENT_STATUS_LABELS,
  formatDate,
  formatPercent,
} from '@/lib/utils';

export default function EventDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading, isError, refetch } = useEvent(id);

  const localCheckins = useCheckinStore((s) => s.checkins);

  // Check-ins simulados deste evento (Zustand) — somados às métricas e ao gráfico.
  const localForEvent = useMemo(
    () => localCheckins.filter((c) => c.event_id === id),
    [localCheckins, id]
  );
  const localSuccess = localForEvent.filter((c) => c.success).length;
  const localErrors = localForEvent.filter((c) => !c.success).length;

  const chartCheckins = useMemo(
    () => [...(event?.checkins ?? []), ...localForEvent],
    [event?.checkins, localForEvent]
  );

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !event) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
        <BackLink />
        <ErrorState
          message="Não foi possível carregar o evento."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <BackLink />

      {/* A) Header do evento */}
      <header className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {event.name}
          </h1>
          <Badge variant={event.status}>
            {EVENT_STATUS_LABELS[event.status]}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
          <span>{formatDate(event.date)}</span>
          <span>·</span>
          <span>{event.location}</span>
        </div>
        <p className="max-w-3xl text-sm text-slate-600">{event.description}</p>
      </header>

      {/* B) Métricas (4 cards) — mobile: 1 col | tablet: 2 cols | desktop: 4 cols */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Participantes Esperados"
          value={event.expected_count}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricCard
          label="Check-ins Realizados"
          value={event.checkin_count + localSuccess}
          icon={<CheckCircle className="h-5 w-5" />}
          trend={localSuccess > 0 ? `+${localSuccess} locais` : undefined}
        />
        <MetricCard
          label="Tentativas com Erro"
          value={event.error_count + localErrors}
          icon={<XCircle className="h-5 w-5" />}
          trend={localErrors > 0 ? `+${localErrors} locais` : undefined}
        />
        <MetricCard
          label="Taxa de Entrada"
          value={formatPercent(event.entry_rate)}
          icon={<TrendingUp className="h-5 w-5" />}
        />
      </section>

      {/* C) Lista de participantes */}
      <section className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-slate-900">Participantes</h2>
        <ParticipantTable event={event} />
      </section>

      {/* D) Gráfico de evolução */}
      <section>
        <CheckinChart checkins={chartCheckins} />
      </section>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/events"
      className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-slate-500 transition-colors hover:text-blue-600"
    >
      <ArrowLeft className="h-4 w-4" />
      Voltar para eventos
    </Link>
  );
}

function DashboardSkeleton() {
  return (
    <div
      className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6"
      role="status"
      aria-label="Carregando evento"
    >
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-2xl" />
    </div>
  );
}
