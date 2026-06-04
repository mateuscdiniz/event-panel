export type Locale = 'pt' | 'en';

export const LOCALES: Locale[] = ['pt', 'en'];

export const DATE_LOCALES: Record<Locale, string> = {
  pt: 'pt-BR',
  en: 'en-US',
};

type Dict = Record<string, string>;
type Params = Record<string, string | number>;

const pt: Dict = {
  'common.retry': 'Tentar novamente',
  'common.participants': 'participantes',
  'common.backToEvents': 'Voltar para eventos',
  'common.errorGeneric': 'Algo deu errado.',

  'footer.tagline': 'Painel de gestão de eventos',

  'events.title': 'Eventos',
  'events.subtitle': 'Gerencie eventos, métricas e check-in de participantes.',
  'events.searchPlaceholder': 'Buscar por nome do evento...',
  'events.searchAria': 'Buscar eventos',
  'events.loadingAria': 'Carregando eventos',
  'events.emptyTitle': 'Nenhum evento encontrado',
  'events.emptyFiltered': 'Tente ajustar os filtros de busca.',
  'events.emptyNone': 'Ainda não há eventos cadastrados.',
  'events.errorLoad': 'Não foi possível carregar os eventos.',
  'events.seeDetails': 'Ver detalhes',

  'filters.status': 'Status',
  'filters.statusAria': 'Filtrar por status',
  'filters.sort': 'Ordenar por data',
  'filters.sortAria': 'Ordenar por data',
  'sort.recent': 'Mais recente',
  'sort.oldest': 'Mais antigo',

  'status.all': 'Todos',
  'status.active': 'Ativo',
  'status.closed': 'Encerrado',
  'status.cancelled': 'Cancelado',

  'type.vip': 'VIP',
  'type.normal': 'Normal',
  'pstatus.inside': 'Dentro',
  'pstatus.outside': 'Fora',

  'dashboard.errorLoad': 'Não foi possível carregar o evento.',
  'dashboard.loadingAria': 'Carregando evento',
  'dashboard.participants': 'Participantes',
  'metrics.expected': 'Participantes Esperados',
  'metrics.checkins': 'Check-ins Realizados',
  'metrics.errors': 'Tentativas com Erro',
  'metrics.entryRate': 'Taxa de Entrada',
  'metrics.localTrend': '+{count} locais',

  'chart.title': 'Evolução de check-ins',
  'chart.emptyTitle': 'Sem check-ins registrados',
  'chart.emptyDesc': 'Ainda não há entradas para exibir no gráfico.',
  'chart.time': 'Horário',
  'chart.cumulative': 'Check-ins acumulados',

  'table.name': 'Nome',
  'table.type': 'Tipo',
  'table.status': 'Status',
  'table.action': 'Ação',
  'table.sortLabel': 'Ordenar:',
  'table.sortAria': 'Ordenar participantes por',
  'table.ascAria': 'Ordem crescente',
  'table.descAria': 'Ordem decrescente',
  'table.perPage': 'Por página:',
  'table.perPageAria': 'Itens por página',
  'table.range': '{start}–{end} de {total}',
  'table.prevAria': 'Página anterior',
  'table.nextAria': 'Próxima página',
  'table.emptyTitle': 'Nenhum participante',
  'table.emptyDesc': 'Este evento não possui participantes cadastrados.',

  'checkin.blocked': 'Check-in bloqueado',
  'checkin.blockedTitle': 'Evento encerrado — check-ins desabilitados',
  'checkin.already': 'Já fez check-in',
  'checkin.do': 'Fazer Check-in',
  'checkin.exit': 'Registrar Saída',
  'toast.vipEntry': 'Entrada registrada para {name}',
  'toast.normalEntry': 'Check-in realizado para {name}',
  'toast.exit': 'Saída registrada para {name}',
  'toast.already': '{name} já realizou o check-in',
  'toast.closed': 'Evento encerrado — check-ins desabilitados',

  'lang.pt': 'Português',
  'lang.en': 'Inglês',
  'lang.aria': 'Selecionar idioma',
};

const en: Dict = {
  'common.retry': 'Try again',
  'common.participants': 'attendees',
  'common.backToEvents': 'Back to events',
  'common.errorGeneric': 'Something went wrong.',

  'footer.tagline': 'Event management panel',

  'events.title': 'Events',
  'events.subtitle': 'Manage events, metrics and attendee check-in.',
  'events.searchPlaceholder': 'Search by event name...',
  'events.searchAria': 'Search events',
  'events.loadingAria': 'Loading events',
  'events.emptyTitle': 'No events found',
  'events.emptyFiltered': 'Try adjusting the search filters.',
  'events.emptyNone': 'There are no events yet.',
  'events.errorLoad': 'Could not load events.',
  'events.seeDetails': 'See details',

  'filters.status': 'Status',
  'filters.statusAria': 'Filter by status',
  'filters.sort': 'Sort by date',
  'filters.sortAria': 'Sort by date',
  'sort.recent': 'Most recent',
  'sort.oldest': 'Oldest',

  'status.all': 'All',
  'status.active': 'Active',
  'status.closed': 'Closed',
  'status.cancelled': 'Cancelled',

  'type.vip': 'VIP',
  'type.normal': 'Normal',
  'pstatus.inside': 'Inside',
  'pstatus.outside': 'Outside',

  'dashboard.errorLoad': 'Could not load the event.',
  'dashboard.loadingAria': 'Loading event',
  'dashboard.participants': 'Attendees',
  'metrics.expected': 'Expected Attendees',
  'metrics.checkins': 'Check-ins',
  'metrics.errors': 'Failed Attempts',
  'metrics.entryRate': 'Entry Rate',
  'metrics.localTrend': '+{count} local',

  'chart.title': 'Check-in evolution',
  'chart.emptyTitle': 'No check-ins recorded',
  'chart.emptyDesc': 'There are no entries to show in the chart yet.',
  'chart.time': 'Time',
  'chart.cumulative': 'Cumulative check-ins',

  'table.name': 'Name',
  'table.type': 'Type',
  'table.status': 'Status',
  'table.action': 'Action',
  'table.sortLabel': 'Sort:',
  'table.sortAria': 'Sort attendees by',
  'table.ascAria': 'Ascending order',
  'table.descAria': 'Descending order',
  'table.perPage': 'Per page:',
  'table.perPageAria': 'Items per page',
  'table.range': '{start}–{end} of {total}',
  'table.prevAria': 'Previous page',
  'table.nextAria': 'Next page',
  'table.emptyTitle': 'No attendees',
  'table.emptyDesc': 'This event has no registered attendees.',

  'checkin.blocked': 'Check-in disabled',
  'checkin.blockedTitle': 'Event closed — check-ins disabled',
  'checkin.already': 'Already checked in',
  'checkin.do': 'Check in',
  'checkin.exit': 'Register Exit',
  'toast.vipEntry': 'Entry registered for {name}',
  'toast.normalEntry': 'Check-in completed for {name}',
  'toast.exit': 'Exit registered for {name}',
  'toast.already': '{name} has already checked in',
  'toast.closed': 'Event closed — check-ins disabled',

  'lang.pt': 'Portuguese',
  'lang.en': 'English',
  'lang.aria': 'Select language',
};

export const dictionaries: Record<Locale, Dict> = { pt, en };

export function translate(locale: Locale, key: string, params?: Params): string {
  let str = dictionaries[locale][key] ?? dictionaries.pt[key] ?? key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      str = str.replace(`{${k}}`, String(v));
    }
  }
  return str;
}
