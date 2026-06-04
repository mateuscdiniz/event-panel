// Junta classes condicionais, ignorando valores falsy.
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}

// Formata uma data ISO para exibição (ex: "15 mai 2025, 09:00").
// `locale` é um código BCP47 (ex: 'pt-BR', 'en-US').
export function formatDate(iso: string, locale = 'pt-BR'): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Formata a taxa de entrada como percentual inteiro.
// A API entrega fração (0.92); o tipo prevê 0–100. Normaliza ambos.
export function formatPercent(rate: number): string {
  const pct = rate <= 1 ? rate * 100 : rate;
  return `${Math.round(pct)}%`;
}

// Formata apenas hora:minuto — usado no eixo do gráfico.
export function formatTime(iso: string, locale = 'pt-BR'): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}
