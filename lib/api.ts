import type { Event, EventDetail } from '@/types';

const BASE_URL = 'https://ThiagoLifters.github.io/api_test';

export async function fetchEvents(): Promise<{ data: Event[]; total: number }> {
  const res = await fetch(`${BASE_URL}/api/events.json`);
  if (!res.ok) throw new Error('Falha ao carregar eventos');
  return res.json();
}

export async function fetchEvent(id: string): Promise<EventDetail> {
  const res = await fetch(`${BASE_URL}/api/events/${id}.json`);
  if (!res.ok) throw new Error('Evento não encontrado');
  return res.json();
}
