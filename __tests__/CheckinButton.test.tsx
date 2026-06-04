import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { toast } from 'sonner';
import { CheckinButton } from '@/components/dashboard/CheckinButton';
import { useCheckinStore } from '@/store/checkinStore';
import type { Checkin, EventDetail, Participant } from '@/types';

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
  },
}));

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

describe('CheckinButton', () => {
  beforeEach(() => {
    useCheckinStore.setState({ checkins: [] });
    vi.clearAllMocks();
  });

  test('Clique dispara check-in VIP, grava no store e atualiza o estado do botão', async () => {
    const user = userEvent.setup();
    const vip = makeParticipant({ id: 'V1', type: 'vip', status: 'outside' });
    const event = makeEvent({ participants: [vip] });

    render(<CheckinButton participant={vip} event={event} />);

    await user.click(screen.getByRole('button', { name: 'Fazer Check-in' }));

    expect(useCheckinStore.getState().checkins).toHaveLength(1);
    expect(useCheckinStore.getState().checkins[0]).toMatchObject({
      participant_id: 'V1',
      action: 'entry',
      success: true,
    });
    expect(toast.success).toHaveBeenCalledWith('Entrada registrada para Ana Pereira');
    expect(
      screen.getByRole('button', { name: 'Registrar Saída' })
    ).toBeInTheDocument();
  });

  test('Participante normal fica bloqueado após o primeiro check-in', async () => {
    const user = userEvent.setup();
    const normal = makeParticipant({ type: 'normal', status: 'outside' });
    const event = makeEvent({ participants: [normal] });

    render(<CheckinButton participant={normal} event={event} />);

    await user.click(screen.getByRole('button', { name: 'Fazer Check-in' }));

    expect(toast.success).toHaveBeenCalledWith('Check-in realizado para Ana Pereira');
    expect(
      screen.queryByRole('button', { name: 'Fazer Check-in' })
    ).not.toBeInTheDocument();
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  test('Normal que já fez check-in (histórico) renderiza botão desabilitado', () => {
    const normal = makeParticipant({ type: 'normal', status: 'outside' });
    const event = makeEvent({
      participants: [normal],
      checkins: [makeCheckin({ participant_id: normal.id, action: 'entry' })],
    });

    render(<CheckinButton participant={normal} event={event} />);

    expect(screen.getByRole('button', { name: 'Já fez check-in' })).toBeDisabled();
  });

  test('Tentativa inválida (evento encerrado) é bloqueada sem efeito colateral', async () => {
    const user = userEvent.setup();
    const participant = makeParticipant({ type: 'vip', status: 'outside' });
    const event = makeEvent({ status: 'closed', participants: [participant] });

    render(<CheckinButton participant={participant} event={event} />);

    const blocked = screen.getByRole('button', { name: 'Check-in bloqueado' });
    expect(blocked).toBeDisabled();
    expect(blocked).toHaveAttribute('title', expect.stringContaining('encerrado'));

    await user.click(blocked);
    expect(useCheckinStore.getState().checkins).toHaveLength(0);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
