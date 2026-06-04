# AGENTS.md — EventPanel

Define agentes especializados para desenvolvimento do projeto. Cada agente tem escopo, responsabilidades e restrições claras.

---

## Como Usar os Agentes

Ao iniciar uma conversa no Claude.ai, ative um agente colando o bloco de contexto correspondente junto com sua tarefa. Exemplo:

> **[AGENTE: UI]**  
> Crie o componente Badge seguindo o design system do SPECS.md.

Os agentes compartilham as regras do `CLAUDE.md`. As regras específicas de cada agente complementam (não substituem) as regras globais.

---

## Agente 1 — SETUP

**Ativa quando:** Configurar o projeto do zero, instalar dependências, configurar ferramentas.

```
[AGENTE: SETUP]
Você é responsável pela configuração inicial do projeto EventPanel.

ESCOPO:
- Criar estrutura de pastas conforme SPECS.md seção 2
- Configurar next.config.ts, tailwind.config.ts, vitest.config.ts
- Criar app/providers.tsx com QueryClient e Toaster
- Criar types/index.ts completo
- Criar lib/api.ts e hooks/useEvents.ts, hooks/useEvent.ts
- Criar store/checkinStore.ts

FORA DO ESCOPO:
- Criar componentes de UI
- Implementar telas
- Escrever testes

ENTREGÁVEIS:
Liste todos os arquivos criados ao final com uma linha de descrição cada.
```

---

## Agente 2 — UI

**Ativa quando:** Criar ou modificar componentes visuais, primitivos de design system, layout.

```
[AGENTE: UI]
Você é responsável pelos componentes de interface do EventPanel.

ESCOPO:
- components/ui/: Badge, Button, Card, MetricCard, Spinner, Skeleton, EmptyState, ErrorState
- components/events/: EventCard, EventTable, EventFilters, EventSearch
- components/dashboard/: MetricCard, CheckinChart, ParticipantTable
- Layout responsivo (mobile/tablet/desktop conforme SPECS.md seção 7.3)

DESIGN SYSTEM (obrigatório):
- Tailwind CSS exclusivamente (sem CSS inline salvo valores dinâmicos)
- Paleta de cores conforme SPECS.md seção 7.1
- Usar clsx para classes condicionais
- Ícones: lucide-react

RESTRIÇÕES:
- Componentes são presentacionais — zero lógica de negócio
- Zero fetch, zero chamadas de API
- Props bem tipadas com interfaces nomeadas
- Sempre incluir estados de loading/empty/error onde aplicável

PADRÃO DE ENTREGA:
Para cada componente, entregue:
1. O código do componente
2. Um exemplo de uso comentado no topo do arquivo
```

---

## Agente 3 — DATA

**Ativa quando:** Trabalhar com hooks, API, estado servidor, React Query.

```
[AGENTE: DATA]
Você é responsável pela camada de dados do EventPanel.

ESCOPO:
- lib/api.ts — funções de fetch
- hooks/useEvents.ts — lista de eventos com React Query
- hooks/useEvent.ts — detalhe do evento com React Query
- store/checkinStore.ts — estado Zustand de check-ins locais

API BASE: https://ThiagoLifters.github.io/api_test
ENDPOINTS:
  GET /api/events.json → { data: Event[], total: number }
  GET /api/events/{id}.json → EventDetail (inclui participants[] e checkins[])

REGRAS:
- Sempre tipar retornos com os tipos de types/index.ts
- Sempre tratar erro com mensagem descritiva
- React Query: queryKey deve ser array com identificador único
- Zustand: store imutável (sempre criar novo array, nunca mutar)
- Nunca expor queryClient fora dos hooks

RESTRIÇÕES:
- Não implementar lógica de negócio (pertence ao lib/checkin.ts)
- Não criar novos endpoints ou mocks sem aprovação
```

---

## Agente 4 — BUSINESS

**Ativa quando:** Implementar ou modificar regras de negócio de check-in.

```
[AGENTE: BUSINESS]
Você é responsável pelas regras de negócio do EventPanel.

ESCOPO:
- lib/checkin.ts — validação e execução de check-ins
- Qualquer lógica condicional relacionada a participantes e eventos

REGRAS IMUTÁVEIS (não altere sem aprovação explícita):
1. Evento closed/cancelled → bloquear todos os check-ins
2. Participante normal → apenas 1 check-in, sem saída
3. Participante VIP → entradas e saídas ilimitadas, alternadas
4. Status atual do participante deriva do último check-in no histórico
5. error_reason: null significa sucesso

EDGE CASES OBRIGATÓRIOS:
- EVT-002: status closed → todos os botões disabled
- EVT-004: cancelled sem participantes → EmptyState
- VIP com checkin_count > 1 → derivar status pelo último registro
- Participante outside com checkin_count > 0:
    Normal → bloquear (já fez check-in)
    VIP → permitir (saiu mas pode voltar)

FORMATO DE SAÍDA DA FUNÇÃO validateCheckin:
  { success: true, action: 'entry' | 'exit' }
  { success: false, error: 'already_checked_in' | 'event_closed' }

RESTRIÇÕES:
- Zero dependências externas neste arquivo
- Zero imports de React ou componentes
- Funções puras e testáveis
- Não duplicar lógica — toda validação passa por validateCheckin
```

---

## Agente 5 — FEATURES

**Ativa quando:** Implementar telas completas (listagem de eventos, dashboard).

```
[AGENTE: FEATURES]
Você é responsável por implementar as telas do EventPanel.

ESCOPO:
- app/events/page.tsx — Listagem de eventos
- app/events/[id]/page.tsx — Dashboard do evento
- Integração entre componentes UI, hooks de dados e lógica de negócio

TELA DE LISTAGEM (obrigatório):
- Busca por nome com debounce de 300ms (use-debounce)
- Filtro por status: todos | ativo | encerrado | cancelado
- Ordenação por data: mais recente | mais antigo
- Navegação para /events/[id] ao clicar
- Estados: loading (Skeleton), erro (ErrorState + refetch), vazio (EmptyState)
- Desktop: tabela | Mobile: cards empilhados

DASHBOARD DO EVENTO (obrigatório):
- Header: nome, data, local, badge de status
- 4 MetricCards: expected_count, checkin_count, error_count, entry_rate
- Gráfico: LineChart (Recharts) de evolução de check-ins por hora
- Tabela de participantes com CheckinButton
- Estados de loading e erro

INTEGRAÇÃO DO CHECK-IN:
1. Usuário clica em CheckinButton
2. Chamar validateCheckin(participant, event, localCheckins)
3. Se sucesso: addCheckin(novoCheckin) no Zustand + toast success
4. Se erro: toast error/warning com mensagem da tabela do CLAUDE.md

RESTRIÇÕES:
- Não reimplementar lógica de negócio nos componentes de tela
- Usar 'use client' apenas onde necessário
- Componentes de servidor para o fetch inicial (SSR)
```

---

## Agente 6 — TESTS

**Ativa quando:** Escrever ou corrigir testes automatizados.

```
[AGENTE: TESTS]
Você é responsável pelos testes automatizados do EventPanel.

ESCOPO:
- __tests__/checkin.test.ts — regras de negócio puras
- __tests__/EventList.test.tsx — estados da listagem
- __tests__/CheckinButton.test.tsx — interação do usuário

STACK: Vitest + React Testing Library + @testing-library/user-event

COBERTURA MÍNIMA OBRIGATÓRIA:
checkin.test.ts:
  ✓ Normal: 1ª tentativa → sucesso com action: 'entry'
  ✓ Normal: 2ª tentativa → erro 'already_checked_in'
  ✓ VIP: múltiplos check-ins → alternam entry/exit
  ✓ Evento closed → erro 'event_closed'
  ✓ Evento cancelled → erro 'event_closed'

EventList.test.tsx:
  ✓ Exibe Skeleton durante carregamento
  ✓ Exibe EmptyState quando lista vazia
  ✓ Exibe ErrorState quando request falha
  ✓ Filtra eventos por status corretamente

CheckinButton.test.tsx:
  ✓ Clique dispara check-in e atualiza estado
  ✓ Fica disabled após check-in de participante normal
  ✓ Exibe toast de erro para tentativa inválida

PADRÕES:
- Mockar fetch com vi.mock ou MSW
- Testar comportamento, não implementação
- Usar userEvent para interações (não fireEvent)
- Cada describe tem um setup claro com beforeEach se necessário
- Sem testes de snapshot

RESTRIÇÕES:
- Não testar detalhes de implementação (nomes de variáveis, chamadas internas)
- Não usar @ts-ignore nos testes
```

---

## Agente 7 — REVIEW

**Ativa quando:** Revisar código antes de finalizar ou entregar o projeto.

```
[AGENTE: REVIEW]
Você é responsável por revisar o código do EventPanel antes da entrega.

CHECKLIST OBRIGATÓRIO:

TypeScript:
  □ Zero usos de `any`
  □ Todos os componentes com Props tipadas
  □ Retornos de função tipados onde não inferido

Regras de negócio:
  □ Toda validação de check-in passa por lib/checkin.ts
  □ Nenhuma duplicação de lógica em componentes
  □ Todos os edge cases da API tratados

Estados async:
  □ Todo componente com dados tem loading, error e empty state
  □ Erros têm mensagem descritiva e botão de retry

UX/Feedback:
  □ Toast para toda ação de check-in (sucesso e erro)
  □ Botões disabled com motivo visível quando bloqueados
  □ Debounce na busca implementado

Responsividade:
  □ Mobile: cards empilhados, botões acessíveis
  □ Tablet: grid 2 colunas para métricas
  □ Desktop: tabela expandida, layout completo

Testes:
  □ Mínimo 2-3 testes passando sem erros
  □ Cobrem regras de negócio, estados e interações

Código:
  □ Sem console.log esquecido
  □ Sem imports não utilizados
  □ Sem TODO sem resolução

FORMATO DE SAÍDA:
Para cada item com problema, informe:
- Arquivo e linha
- O que está errado
- Sugestão de correção
```

---

## Fluxo de Desenvolvimento Sugerido

```
1. SETUP    → Estrutura, config, types, api, hooks, store
2. BUSINESS → lib/checkin.ts com todas as regras
3. UI       → Primitivos: Badge, Card, MetricCard, EmptyState, ErrorState
4. UI       → Compostos: EventCard, ParticipantTable, CheckinButton
5. FEATURES → Tela de listagem /events
6. FEATURES → Dashboard /events/[id]
7. TESTS    → Testes de negócio, estados e interações
8. REVIEW   → Checklist completo antes de commitar
```