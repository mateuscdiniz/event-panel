'use client';

import { toast } from 'sonner';
import type { Checkin, EventDetail, Participant } from '@/types';
import { useCheckinStore } from '@/store/checkinStore';
import { deriveStatus, validateCheckin } from '@/lib/checkin';
import { cn } from '@/lib/utils';

interface CheckinButtonProps {
  participant: Participant;
  event: EventDetail;
}

// Mobile (<768px): botão full-width nos cards | Desktop (md+): largura automática na tabela.
// Altura fixa (h-8) para que a linha da tabela não mude de altura entre estados.
const BASE =
  'inline-flex h-8 w-full items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:w-auto';
const ENABLED =
  'cursor-pointer bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600';
const DISABLED =
  'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500';

export function CheckinButton({ participant, event }: CheckinButtonProps) {
  const allCheckins = useCheckinStore((s) => s.checkins);
  const addCheckin = useCheckinStore((s) => s.addCheckin);

  const localCheckins = allCheckins.filter(
    (c) => c.participant_id === participant.id
  );
  const status = deriveStatus(participant, localCheckins);
  const result = validateCheckin(participant, event, allCheckins);

  // Evento encerrado/cancelado → bloqueia tudo (com tooltip).
  if (event.status === 'closed' || event.status === 'cancelled') {
    return (
      <button
        type="button"
        disabled
        title="Evento encerrado — check-ins desabilitados"
        className={cn(BASE, DISABLED)}
      >
        Check-in bloqueado
      </button>
    );
  }

  // Normal que já entrou e saiu não reentra.
  if (!result.success && result.error === 'already_checked_in') {
    return (
      <button type="button" disabled className={cn(BASE, DISABLED)}>
        Já fez check-in
      </button>
    );
  }

  // Normal que está dentro não tem ação de saída.
  // Mantém a mesma altura do botão para a linha não "dançar".
  if (participant.type === 'normal' && status === 'inside') {
    return (
      <span className="inline-flex h-8 w-full items-center justify-center text-sm text-slate-400 dark:text-slate-500 md:w-auto">
        —
      </span>
    );
  }

  // result.success === true a partir daqui.
  const action = result.success ? result.action : 'entry';
  const label = action === 'entry' ? 'Fazer Check-in' : 'Registrar Saída';

  const handleClick = () => {
    const check = validateCheckin(participant, event, allCheckins);

    if (!check.success) {
      if (check.error === 'already_checked_in') {
        toast.error(`${participant.name} já realizou o check-in`);
      } else {
        toast.warning('Evento encerrado — check-ins desabilitados');
      }
      return;
    }

    const checkin: Checkin = {
      id: crypto.randomUUID(),
      event_id: event.id,
      participant_id: participant.id,
      timestamp: new Date().toISOString(),
      success: true,
      action: check.action,
      error_reason: null,
    };
    addCheckin(checkin);

    if (check.action === 'exit') {
      toast.success(`Saída registrada para ${participant.name}`);
    } else if (participant.type === 'vip') {
      toast.success(`Entrada registrada para ${participant.name}`);
    } else {
      toast.success(`Check-in realizado para ${participant.name}`);
    }
  };

  return (
    <button type="button" onClick={handleClick} className={cn(BASE, ENABLED)}>
      {label}
    </button>
  );
}

export default CheckinButton;
