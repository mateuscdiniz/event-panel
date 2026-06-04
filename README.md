# EventPanel — Painel de Gestão de Eventos

Painel para gestão de eventos com **listagem**, **dashboard de métricas** e **controle de check-in** de participantes. Consome uma API somente-leitura e simula check-ins no cliente com regras de negócio próprias (entrada/saída de VIPs, check-in único para participantes normais, bloqueio de eventos encerrados).

> A API de dados é servida via GitHub Pages (read-only): `https://ThiagoLifters.github.io/api_test`

---

## ✨ Funcionalidades

- **Listagem de eventos** (`/events`)
  - Busca por nome com **debounce de 300ms**
  - Filtro por status (todos / ativo / encerrado / cancelado)
  - Ordenação por data (mais recente / mais antigo)
  - Estados de **loading** (skeleton), **erro** (com _retry_) e **vazio**
  - Layout responsivo: tabela no desktop, cards no mobile
- **Dashboard do evento** (`/events/[id]`)
  - Header com nome, data, local, descrição e badge de status
  - **4 cards de métricas**: esperados, check-ins, erros e taxa de entrada
  - **Gráfico** (Recharts `LineChart`) com a evolução acumulada de check-ins
  - **Tabela de participantes** com botão de check-in/saída
- **Check-in simulado** (client-side) com toasts de feedback e regras de negócio isoladas

---

## 🧱 Stack

| Camada | Tecnologia |
|--------|------------|
| Framework | **Next.js 16** (App Router) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS v4 |
| Estado de servidor | TanStack React Query v5 |
| Estado de cliente | Zustand v5 |
| Gráficos | Recharts v3 |
| Toasts | Sonner |
| Busca | use-debounce |
| Ícones | lucide-react |
| Testes | Vitest + React Testing Library |


---

## 🗂️ Estrutura de Pastas

```
app/
├─ layout.tsx              # Root layout + Providers (React Query, Toaster)
├─ page.tsx                # Redirect → /events
├─ providers.tsx           # QueryClientProvider + Sonner Toaster
└─ events/
   ├─ page.tsx             # Listagem de eventos
   └─ [id]/page.tsx        # Dashboard do evento
components/
├─ ui/                     # Badge, MetricCard, EmptyState, ErrorState, Spinner
├─ events/                 # EventCard, EventTable, EventFilters, EventSearch
└─ dashboard/              # CheckinChart, ParticipantTable, CheckinButton
hooks/                     # useEvents, useEvent (React Query)
lib/
├─ api.ts                  # Funções de fetch
├─ checkin.ts              # Regras de negócio (validateCheckin, deriveStatus)
└─ utils.ts                # Formatadores e helper de classes (cn)
store/checkinStore.ts      # Zustand: check-ins simulados
types/index.ts             # Interfaces TypeScript
__tests__/                 # Testes (Vitest + RTL)
```

---

## 🚀 Começando

**Pré-requisitos:** Node.js 18+ (desenvolvido com Node 22).

```bash
# 1. Instalar dependências
npm install

# 2. Rodar em desenvolvimento (http://localhost:3000)
npm run dev

# 3. Rodar os testes
npm test

# 4. Build de produção
npm run build
```

### Scripts disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento em `http://localhost:3000` |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção |
| `npm run lint` | ESLint |
| `npm test` | Roda toda a suíte de testes (Vitest) |
| `npm run test:ui` | Vitest com interface visual |

---

## 🧠 Regras de Negócio (Check-in)

Toda a validação vive em [`lib/checkin.ts`](lib/checkin.ts) (função pura, sem dependências de React) e nunca é duplicada na UI.

| Situação | Resultado |
|----------|-----------|
| Evento `closed` / `cancelled` | Bloqueia qualquer check-in (`event_closed`) |
| Participante **normal**, 1ª vez | Check-in liberado (`entry`) |
| Participante **normal** já registrado | Erro `already_checked_in` |
| Participante **VIP** | Entrada e saída livres, alternadas pelo histórico |

O status atual de cada participante é derivado do **último check-in** do histórico (API + simulações locais do Zustand).

---

## 📊 Estados Assíncronos

Toda lista/tabela trata explicitamente os 4 estados:

1. `isLoading` → Skeleton / spinner
2. `isError` → `ErrorState` com botão **Tentar novamente** (refetch)
3. `data.length === 0` → `EmptyState` contextual
4. `data` → conteúdo

---

## 📱 Responsividade

Breakpoints conforme a seção 7.3 do `SPECS.md`:

| Faixa | Comportamento |
|-------|---------------|
| `< 768px` (mobile) | Cards empilhados (sem tabela), botões full-width, métricas em 1 coluna |
| `768px – 1024px` (tablet) | Métricas em 2 colunas, tabelas com scroll horizontal |
| `> 1024px` (desktop) | Layout completo, tabela expandida, métricas em 4 colunas |

---

## 🧪 Testes

Stack: **Vitest + React Testing Library + @testing-library/user-event** (ambiente `jsdom`).

- `__tests__/checkin.test.ts` — regras de negócio puras (normal, VIP, eventos closed/cancelled)
- `__tests__/EventList.test.tsx` — estados da listagem (loading, vazio, erro, filtro, busca)
- `__tests__/CheckinButton.test.tsx` — interação (check-in, bloqueio, feedback)

```bash
npm test          # roda tudo uma vez
npm run test:ui   # modo interativo
```

---

## 🏗️ Decisões Técnicas

| Decisão | Justificativa |
|---------|--------------|
| Next.js App Router | Roteamento por arquivos, RSC e melhor DX |
| React Query | Cache, estados de loading/error automáticos e refetch |
| Zustand | Estado leve para os check-ins simulados no cliente |
| Recharts | Componentes compostos, integração natural com React |
| Sonner | Toasts modernos e acessíveis |
| use-debounce | Evita re-renders excessivos na busca |
| Vitest + RTL | Rápido, compatível com o ecossistema Vite, API similar ao Jest |
| `QueryClient` via `useState` | Instância por cliente, evitando cache compartilhado entre requests (App Router) |
| Regras isoladas em `lib/checkin.ts` | Funções puras e testáveis, sem acoplamento com a UI |

### Ajustes em relação ao SPECS

- **Next.js 16 (não 14):** o projeto instalado usa Next 16.2.7 + React 19. As páginas que dependem de React Query/Zustand são Client Components; o restante segue os padrões atuais do App Router.
- **`@vitejs/plugin-react`:** necessário pelo `vitest.config.ts`, mas ausente da lista de instalação do SPECS — adicionado como `devDependency`.
- **Scripts `test` / `test:ui`:** adicionados ao `package.json` (estavam documentados no `CLAUDE.md`, mas não existiam).
- **`entry_rate`:** a API entrega fração (`0.92`); o helper `formatPercent` normaliza para exibição em `%`.

---

## 🔭 Melhorias Futuras

- Integração com `json-server` local para CRUD real
- Paginação na lista de participantes
- Filtros avançados no dashboard (por período, tipo)
- Exportação de relatório em CSV
- Modo escuro
- PWA / suporte offline
- Autenticação (NextAuth)
- Sidebar de navegação no desktop (prevista no SPECS, ainda não implementada)
- SSR com prefetch + hydration do React Query (hoje o fetch é client-side)

---

## 🤖 Uso de IA no Desenvolvimento

Este projeto foi desenvolvido com auxílio do **Claude (Claude Code)**, seguindo um fluxo de _prompts_ encadeados definidos no `SPECS.md` (seção 14) e governados por dois documentos de contexto:

- **`CLAUDE.md`** — regras de comportamento, convenções de código, decisões de arquitetura fixas, tabela de toasts e edge cases.
- **`AGENTS.md`** — agentes especializados (SETUP, UI, DATA, BUSINESS, FEATURES, TESTS, REVIEW), cada um com escopo e restrições próprias.

### Como a IA foi utilizada

| Etapa | O que a IA fez |
|-------|----------------|
| Setup | Estrutura de pastas, `types`, `lib/api`, `lib/checkin`, store Zustand e `providers` |
| UI | Primitivos de design system (Badge, MetricCard, EmptyState, ErrorState, Spinner) |
| Features | Telas de listagem e dashboard, integrando hooks, componentes e regras |
| Check-in | `CheckinButton` ligando `validateCheckin` → Zustand → toasts |
| Testes | Suíte Vitest cobrindo regras, estados e interações |
| Responsividade & Docs | Ajustes de breakpoints e este README |

### Princípios aplicados

- **Regras de negócio nunca duplicadas** — toda validação passa por `lib/checkin.ts`.
- **Documentação local da framework consultada** antes de escrever código (Next.js 16).
- **Verificação contínua** — cada etapa validada com `build`, `lint` e `test`.
- **Discrepâncias entre specs e realidade foram sinalizadas** (versão do Next, dependências ausentes, conflitos de mensagens de toast), não silenciadas.

> Todo o código gerado por IA foi revisado para garantir tipagem estrita (sem `any`), aderência às convenções do `CLAUDE.md` e ausência de erros de lint/TypeScript.
