import { describe, expect, test } from 'vitest';
import { validateCheckin } from '@/lib/checkin';
import type { Checkin, EventDetail, Participant } from '@/types';

function makeParticipant(overrides: Partial<Participant> = {}): Participant {
  return {
    id: 'EVT-001-P001',
    event_id: 'EVT-001',
    name: 'Ana Pereira',
    type: 'normal',
    status: 'outside',
    checkin_count: 0,
    ...overrides,
  };
}

function makeEvent(overrides: Partial<EventDetail> = {}): EventDetail {
  return {
    id: 'EVT-001',
    name: 'Tech Summit 2025',
    date: '2025-05-15T09:00:00-03:00',
    location: 'São Paulo',
    status: 'active',
    description: 'Evento de tecnologia',
    expected_count: 12,
    checkin_count: 0,
    error_count: 0,
    entry_rate: 0,
    participants: [],
    checkins: [],
    ...overrides,
  };
}

function makeCheckin(overrides: Partial<Checkin> = {}): Checkin {
  return {
    id: 'CK-1',
    event_id: 'EVT-001',
    participant_id: 'EVT-001-P001',
    timestamp: '2025-05-15T10:00:00.000Z',
    success: true,
    action: 'entry',
    error_reason: null,
    ...overrides,
  };
}

describe('Regras de check-in (validateCheckin)', () => {
  test('Normal: primeiro check-in retorna sucesso com action "entry"', () => {
    const participant = makeParticipant({ type: 'normal', status: 'outside' });
    const event = makeEvent({ status: 'active', checkins: [] });

    const result = validateCheckin(participant, event, []);

    expect(result).toEqual({ success: true, action: 'entry' });
  });

  test('Normal: segundo check-in (já registrado, fora) retorna already_checked_in', () => {
    const participant = makeParticipant({ type: 'normal', status: 'outside' });
    const event = makeEvent({
      status: 'active',
      checkins: [makeCheckin({ participant_id: participant.id, action: 'entry' })],
    });

    const result = validateCheckin(participant, event, []);

    expect(result).toEqual({ success: false, error: 'already_checked_in' });
  });

  test('VIP: múltiplos check-ins alternam entry/exit com sucesso', () => {
    const vip = makeParticipant({ id: 'EVT-001-V001', type: 'vip', status: 'outside' });
    const event = makeEvent({ status: 'active', checkins: [] });

    const first = validateCheckin(vip, event, []);
    expect(first).toEqual({ success: true, action: 'entry' });

    const local: Checkin[] = [
      makeCheckin({
        id: 'CK-A',
        participant_id: vip.id,
        action: 'entry',
        timestamp: '2025-05-15T10:00:00.000Z',
      }),
    ];
    const second = validateCheckin(vip, event, local);
    expect(second).toEqual({ success: true, action: 'exit' });

    local.push(
      makeCheckin({
        id: 'CK-B',
        participant_id: vip.id,
        action: 'exit',
        timestamp: '2025-05-15T11:00:00.000Z',
      })
    );
    const third = validateCheckin(vip, event, local);
    expect(third).toEqual({ success: true, action: 'entry' });
  });

  test('Evento closed: bloqueia qualquer check-in', () => {
    const participant = makeParticipant({ type: 'vip', status: 'outside' });
    const event = makeEvent({ status: 'closed' });

    const result = validateCheckin(participant, event, []);

    expect(result).toEqual({ success: false, error: 'event_closed' });
  });

  test('Evento cancelled: bloqueia qualquer check-in', () => {
    const participant = makeParticipant({ type: 'vip', status: 'outside' });
    const event = makeEvent({ status: 'cancelled' });

    const result = validateCheckin(participant, event, []);

    expect(result).toEqual({ success: false, error: 'event_closed' });
  });
});
