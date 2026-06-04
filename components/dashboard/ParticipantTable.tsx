'use client';

import { Users } from 'lucide-react';
import type { EventDetail, Participant, ParticipantStatus } from '@/types';
import { useCheckinStore } from '@/store/checkinStore';
import { deriveStatus } from '@/lib/checkin';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CheckinButton } from './CheckinButton';

interface ParticipantTableProps {
  event: EventDetail;
}

const TYPE_LABELS = { vip: 'VIP', normal: 'Normal' } as const;
const STATUS_LABELS: Record<ParticipantStatus, string> = {
  inside: 'Dentro',
  outside: 'Fora',
};

// Hook: status atual do participante considerando check-ins locais (Zustand).
function useLiveStatus(participant: Participant): ParticipantStatus {
  const checkins = useCheckinStore((s) => s.checkins);
  const local = checkins.filter((c) => c.participant_id === participant.id);
  return deriveStatus(participant, local);
}

function ParticipantRow({
  participant,
  event,
}: {
  participant: Participant;
  event: EventDetail;
}) {
  const status = useLiveStatus(participant);

  return (
    <tr className="transition-colors hover:bg-slate-50">
      <td className="px-4 py-3 font-medium text-slate-900">{participant.name}</td>
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
  participant,
  event,
}: {
  participant: Participant;
  event: EventDetail;
}) {
  const status = useLiveStatus(participant);

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

export function ParticipantTable({ event }: ParticipantTableProps) {
  const participants = event.participants ?? [];

  if (participants.length === 0) {
    return (
      <EmptyState
        icon={<Users className="h-6 w-6" />}
        title="Nenhum participante"
        description="Este evento não possui participantes cadastrados."
      />
    );
  }

  return (
    <>
      {/* Desktop / tablet: tabela */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {participants.map((p) => (
              <ParticipantRow key={p.id} participant={p} event={event} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards empilhados */}
      <div className="flex flex-col gap-3 md:hidden">
        {participants.map((p) => (
          <ParticipantMobileCard key={p.id} participant={p} event={event} />
        ))}
      </div>
    </>
  );
}

export default ParticipantTable;
