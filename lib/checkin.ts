import type {
  CheckinAction,
  Checkin,
  EventDetail,
  Participant,
  ParticipantStatus,
} from '@/types';

export type CheckinResult =
  | { success: true; action: CheckinAction }
  | { success: false; error: 'already_checked_in' | 'event_closed' };

export function validateCheckin(
  participant: Participant,
  event: EventDetail,
  localCheckins: Checkin[]
): CheckinResult {
  if (event.status === 'closed' || event.status === 'cancelled') {
    return { success: false, error: 'event_closed' };
  }

  const myCheckins = localCheckins.filter(
    (c) => c.participant_id === participant.id
  );
  const allCheckins = [...(event.checkins ?? []), ...myCheckins];
  const myAll = allCheckins.filter(
    (c) => c.participant_id === participant.id && c.success
  );

  const currentStatus = deriveStatus(participant, myCheckins);

  if (
    participant.type === 'normal' &&
    myAll.length > 0 &&
    currentStatus === 'outside'
  ) {
    return { success: false, error: 'already_checked_in' };
  }

  const action: CheckinAction = currentStatus === 'outside' ? 'entry' : 'exit';
  return { success: true, action };
}

export function deriveStatus(
  participant: Participant,
  localCheckins: Checkin[]
): ParticipantStatus {
  if (localCheckins.length === 0) return participant.status;
  const last = [...localCheckins].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
  return last.action === 'entry' ? 'inside' : 'outside';
}
