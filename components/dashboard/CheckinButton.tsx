'use client';

import { toast } from 'sonner';
import type { Checkin, EventDetail, Participant } from '@/types';
import { useCheckinStore } from '@/store/checkinStore';
import { deriveStatus, validateCheckin } from '@/lib/checkin';
import { useT } from '@/hooks/useT';
import { cn } from '@/lib/utils';

interface CheckinButtonProps {
  participant: Participant;
  event: EventDetail;
}

const BASE =
  'inline-flex h-8 w-full items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 md:w-auto';
const ENABLED =
  'cursor-pointer bg-blue-600 text-white hover:bg-blue-700 focus-visible:outline-blue-600';
const DISABLED =
  'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500';

export function CheckinButton({ participant, event }: CheckinButtonProps) {
  const { t } = useT();
  const allCheckins = useCheckinStore((s) => s.checkins);
  const addCheckin = useCheckinStore((s) => s.addCheckin);

  const localCheckins = allCheckins.filter(
    (c) => c.participant_id === participant.id
  );
  const status = deriveStatus(participant, localCheckins);
  const result = validateCheckin(participant, event, allCheckins);

  if (event.status === 'closed' || event.status === 'cancelled') {
    return (
      <button
        type="button"
        disabled
        title={t('checkin.blockedTitle')}
        className={cn(BASE, DISABLED)}
      >
        {t('checkin.blocked')}
      </button>
    );
  }

  if (!result.success && result.error === 'already_checked_in') {
    return (
      <button type="button" disabled className={cn(BASE, DISABLED)}>
        {t('checkin.already')}
      </button>
    );
  }

  if (participant.type === 'normal' && status === 'inside') {
    return (
      <span className="inline-flex h-8 w-full items-center justify-center text-sm text-slate-400 dark:text-slate-500 md:w-auto">
        —
      </span>
    );
  }

  const action = result.success ? result.action : 'entry';
  const label = action === 'entry' ? t('checkin.do') : t('checkin.exit');

  const handleClick = () => {
    const check = validateCheckin(participant, event, allCheckins);

    if (!check.success) {
      if (check.error === 'already_checked_in') {
        toast.error(t('toast.already', { name: participant.name }));
      } else {
        toast.warning(t('toast.closed'));
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
      toast.success(t('toast.exit', { name: participant.name }));
    } else if (participant.type === 'vip') {
      toast.success(t('toast.vipEntry', { name: participant.name }));
    } else {
      toast.success(t('toast.normalEntry', { name: participant.name }));
    }
  };

  return (
    <button type="button" onClick={handleClick} className={cn(BASE, ENABLED)}>
      {label}
    </button>
  );
}

export default CheckinButton;
