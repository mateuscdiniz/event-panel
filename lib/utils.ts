import type { EventStatus } from '@/types';

// Junta classes condicionais, ignorando valores falsy.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

// Formata uma data ISO para exibição em pt-BR (ex: "15 mai 2025, 09:00").
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Rótulo em pt-BR para o status do evento.
export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  active: 'Ativo',
  closed: 'Encerrado',
  cancelled: 'Cancelado',
};

// Formata a taxa de entrada como percentual inteiro.
// A API entrega fração (0.92); o tipo prevê 0–100. Normaliza ambos.
export function formatPercent(rate: number): string {
  const pct = rate <= 1 ? rate * 100 : rate;
  return `${Math.round(pct)}%`;
}

// Formata apenas hora:minuto (pt-BR) — usado no eixo do gráfico.
export function formatTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
