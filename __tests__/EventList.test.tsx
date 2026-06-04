import { beforeEach, describe, expect, test, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EventsPage from '@/app/events/page';
import { useEvents } from '@/hooks/useEvents';
import type { Event } from '@/types';

// Mockamos o hook de dados (React Query) para controlar os estados da tela.
vi.mock('@/hooks/useEvents', () => ({ useEvents: vi.fn() }));
// EventTable usa useRouter — stub simples para navegação.
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const mockedUseEvents = vi.mocked(useEvents);

// Helper para montar o retorno do hook sem `any` nem `@ts-ignore`.
function mockEventsResult(
  partial: Partial<ReturnType<typeof useEvents>>
): void {
  mockedUseEvents.mockReturnValue(
    partial as unknown as ReturnType<typeof useEvents>
  );
}

function makeEvent(overrides: Partial<Event> = {}): Event {
  return {
    id: 'EVT-001',
    name: 'Tech Summit 2025',
    date: '2025-05-15T09:00:00-03:00',
    location: 'São Paulo',
    status: 'active',
    description: 'Evento de tecnologia',
    expected_count: 12,
    checkin_count: 11,
    error_count: 1,
    entry_rate: 0.92,
    ...overrides,
  };
}

describe('Listagem de Eventos', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('Exibe skeleton enquanto carrega', () => {
    mockEventsResult({ isLoading: true, isError: false, data: undefined });

    render(<EventsPage />);

    expect(screen.getByRole('status', { name: 'Carregando eventos' })).toBeInTheDocument();
  });

  test('Exibe EmptyState quando a lista está vazia', () => {
    mockEventsResult({
      isLoading: false,
      isError: false,
      data: { data: [], total: 0 },
    });

    render(<EventsPage />);

    expect(screen.getByText('Nenhum evento encontrado')).toBeInTheDocument();
  });

  test('Exibe ErrorState e chama refetch ao clicar em "Tentar novamente"', async () => {
    const user = userEvent.setup();
    const refetch = vi.fn();
    mockEventsResult({
      isLoading: false,
      isError: true,
      data: undefined,
      refetch,
    });

    render(<EventsPage />);

    expect(
      screen.getByText('Não foi possível carregar os eventos.')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /tentar novamente/i }));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  test('Filtra eventos por status', async () => {
    const user = userEvent.setup();
    const active = makeEvent({ id: 'EVT-001', name: 'Tech Summit', status: 'active' });
    const closed = makeEvent({ id: 'EVT-002', name: 'Design Week', status: 'closed' });
    mockEventsResult({
      isLoading: false,
      isError: false,
      data: { data: [active, closed], total: 2 },
    });

    render(<EventsPage />);

    // Ambos visíveis inicialmente (tabela + cards = pode aparecer mais de uma vez).
    expect(screen.getAllByText('Tech Summit').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Design Week').length).toBeGreaterThan(0);

    // Select customizado: abre o dropdown e escolhe a opção "Ativo".
    await user.click(screen.getByRole('button', { name: 'Filtrar por status' }));
    await user.click(screen.getByRole('option', { name: 'Ativo' }));

    expect(screen.getAllByText('Tech Summit').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Design Week')).toHaveLength(0);
  });

  test('Busca por nome com debounce filtra a lista', async () => {
    const user = userEvent.setup();
    const summit = makeEvent({ id: 'EVT-001', name: 'Tech Summit', status: 'active' });
    const design = makeEvent({ id: 'EVT-002', name: 'Design Week', status: 'active' });
    mockEventsResult({
      isLoading: false,
      isError: false,
      data: { data: [summit, design], total: 2 },
    });

    render(<EventsPage />);

    await user.type(screen.getByLabelText('Buscar eventos'), 'Design');

    // Após o debounce (300ms), apenas o evento correspondente permanece.
    await waitFor(
      () => expect(screen.queryAllByText('Tech Summit')).toHaveLength(0),
      { timeout: 1500 }
    );
    expect(screen.getAllByText('Design Week').length).toBeGreaterThan(0);
  });
});
