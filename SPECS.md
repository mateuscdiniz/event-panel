# SPECS — Painel de Gestão de Eventos

> Documento de referência técnica e design para desenvolvimento com React / Next.js.
> Use este arquivo como contexto principal ao conversar com Claude para implementar cada parte.

---

## 1. Visão Geral do Projeto

**Nome:** EventPanel  
**Stack:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, React Query, Recharts  
**API:** GitHub Pages (read-only) — `https://ThiagoLifters.github.io/api_test`  
**Testes:** Vitest + React Testing Library  
**Objetivo:** Painel de gestão de eventos com listagem, dashboard de métricas e controle de check-in de participantes.

---

## 2. Arquitetura de Pastas

```
/
├── app/
│   ├── layout.tsx              # Root layout com sidebar
│   ├── page.tsx                # Redirect → /events
│   ├── events/
│   │   ├── page.tsx            # Listagem de eventos
│   │   └── [id]/
│   │       └── page.tsx        # Dashboard do evento
├── components/
│   ├── ui/                     # Primitivos (Button, Badge, Card, Spinner, EmptyState, ErrorState)
│   ├── events/                 # EventCard, EventTable, EventFilters, EventSearch
│   └── dashboard/              # MetricCard, CheckinChart, ParticipantTable, CheckinButton
├── hooks/
│   ├── useEvents.ts            # React Query: lista de eventos
│   └── useEvent.ts             # React Query: detalhe do evento
├── lib/
│   ├── api.ts                  # Fetch functions
│   ├── checkin.ts              # Lógica de check-in (regras de negócio)
│   └── utils.ts                # Formatadores, helpers
├── store/
│   └── checkinStore.ts         # Zustand: estado local de check-ins simulados
├── types/
│   └── index.ts                # Interfaces TypeScript
└── __tests__/
    ├── checkin.test.ts
    ├── EventList.test.tsx
    └── CheckinButton.test.tsx
```

---

## 3. Tipos TypeScript

```typescript
// types/index.ts

export type EventStatus = 'active' | 'closed' | 'cancelled';
export type ParticipantType = 'vip' | 'normal';
export type ParticipantStatus = 'inside' | 'outside';
export type CheckinAction = 'entry' | 'exit';
export type CheckinErrorReason = 'already_checked_in' | 'event_closed' | null;

export interface Event {
  id: string;            // e.g. "EVT-001"
  name: string;
  date: string;          // ISO date string
  location: string;
  status: EventStatus;
  description: string;
  expected_count: number;
  checkin_count: number;
  error_count: number;
  entry_rate: number;    // percentual 0–100
}

export interface Participant {
  id: string;
  event_id: string;
  name: string;
  type: ParticipantType;
  status: ParticipantStatus;
  checkin_count: number;
}

export interface Checkin {
  id: string;
  event_id: string;
  participant_id: string;
  timestamp: string;     // ISO date string
  success: boolean;
  action: CheckinAction;
  error_reason: CheckinErrorReason;
}

export interface EventDetail extends Event {
  participants: Participant[];
  checkins: Checkin[];
}

// Estado local gerenciado pelo Zustand (simulação client-side)
export interface LocalCheckinState {
  // participant_id → lista de check-ins simulados
  [participantId: string]: Checkin[];
}
```

---

## 4. Camada de API

```typescript
// lib/api.ts

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
```

### Hooks React Query

```typescript
// hooks/useEvents.ts
export function useEvents() {
  return useQuery({ queryKey: ['events'], queryFn: fetchEvents });
}

// hooks/useEvent.ts
export function useEvent(id: string) {
  return useQuery({ queryKey: ['event', id], queryFn: () => fetchEvent(id) });
}
```

---

## 5. Regras de Negócio — Check-in

> **Arquivo:** `lib/checkin.ts`  
> Toda lógica de validação fica aqui, separada da UI.

```typescript
export type CheckinResult =
  | { success: true; action: CheckinAction }
  | { success: false; error: 'already_checked_in' | 'event_closed' };

export function validateCheckin(
  participant: Participant,
  event: EventDetail,
  localCheckins: Checkin[]   // check-ins simulados do Zustand
): CheckinResult {
  // Regra 1: Evento encerrado bloqueia tudo
  if (event.status === 'closed' || event.status === 'cancelled') {
    return { success: false, error: 'event_closed' };
  }

  const myCheckins = localCheckins.filter(c => c.participant_id === participant.id);
  const allCheckins = [...(event.checkins ?? []), ...myCheckins];
  const myAll = allCheckins.filter(c => c.participant_id === participant.id && c.success);

  const currentStatus = deriveStatus(participant, myCheckins);

  // Regra 2: Normal só pode fazer 1 check-in
  if (participant.type === 'normal' && myAll.length > 0 && currentStatus === 'outside') {
    return { success: false, error: 'already_checked_in' };
  }

  // Regra 3: VIP pode entrar/sair livremente
  const action: CheckinAction = currentStatus === 'outside' ? 'entry' : 'exit';
  return { success: true, action };
}

// Deriva status atual considerando histórico local
function deriveStatus(participant: Participant, localCheckins: Checkin[]): ParticipantStatus {
  if (localCheckins.length === 0) return participant.status;
  const last = [...localCheckins].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )[0];
  return last.action === 'entry' ? 'inside' : 'outside';
}
```

### Zustand Store

```typescript
// store/checkinStore.ts
import { create } from 'zustand';
import { Checkin } from '@/types';

interface CheckinStore {
  checkins: Checkin[];
  addCheckin: (checkin: Checkin) => void;
  getCheckins: (participantId: string) => Checkin[];
}

export const useCheckinStore = create<CheckinStore>((set, get) => ({
  checkins: [],
  addCheckin: (checkin) => set((s) => ({ checkins: [...s.checkins, checkin] })),
  getCheckins: (participantId) =>
    get().checkins.filter((c) => c.participant_id === participantId),
}));
```

---

## 6. Telas e Componentes

### 6.1 Tela de Listagem — `/events`

**Comportamento:**
- Busca por nome com **debounce de 300ms**
- Filtro por status (todos | ativo | encerrado | cancelado)
- Ordenação por data (mais recente | mais antigo)
- Click no card/linha → navega para `/events/[id]`

**Estados obrigatórios:**
- `isLoading` → Skeleton loader (3 linhas de placeholder)
- `isError` → Componente `<ErrorState>` com botão "Tentar novamente"
- `data.length === 0` → Componente `<EmptyState>` com mensagem contextual

**Layout Desktop:** Tabela com colunas: Nome | Data | Local | Status | Participantes | Ação  
**Layout Mobile:** Cards empilhados com as mesmas informações

### 6.2 Dashboard do Evento — `/events/[id]`

**Seções:**

#### A) Header do Evento
- Nome, data, local, descrição, badge de status

#### B) Métricas (4 cards)
| Card | Valor | Ícone sugerido |
|------|-------|----------------|
| Participantes Esperados | `expected_count` | users |
| Check-ins Realizados | `checkin_count` + locais | check-circle |
| Tentativas com Erro | `error_count` + locais | x-circle |
| Taxa de Entrada | `entry_rate`% | trending-up |

#### C) Gráficos (mínimo 1)
**Opção 1 — Evolução de entradas ao longo do tempo**
- Dados: agrupar `checkins[]` por hora/dia → LineChart (Recharts)
- X: timestamp formatado, Y: contagem acumulada de check-ins com sucesso

**Opção 2 — Proporção sucesso vs erro** (adicional)
- PieChart ou BarChart com 2 segmentos

#### D) Lista de Participantes
| Coluna | Descrição |
|--------|-----------|
| Nome | `participant.name` |
| Tipo | Badge VIP (dourado) / Normal (cinza) |
| Status | Badge Inside (verde) / Outside (cinza) |
| Ação | Botão Check-in / Saída (ver regras) |

**Botão de ação por estado:**

| Situação | Botão | Estado |
|----------|-------|--------|
| Evento closed/cancelled | "Check-in bloqueado" | Disabled + tooltip |
| Normal já fez check-in e está outside | "Já fez check-in" | Disabled |
| Normal outside (1ª vez) | "Fazer Check-in" | Enabled |
| Normal inside | "— " | Sem ação (normal não sai) |
| VIP outside | "Fazer Check-in" | Enabled |
| VIP inside | "Registrar Saída" | Enabled |

---

## 7. Design System

### 7.1 Paleta de Cores

```css
/* Usar via Tailwind ou CSS Variables */

/* Status de evento */
--status-active:    #16a34a;  /* green-600 */
--status-closed:    #dc2626;  /* red-600 */
--status-cancelled: #9ca3af;  /* gray-400 */

/* Tipo de participante */
--type-vip:    #d97706;  /* amber-600 */
--type-normal: #6b7280;  /* gray-500 */

/* Status do participante */
--inside:  #16a34a;  /* green-600 */
--outside: #6b7280;  /* gray-500 */

/* Primária */
--primary: #2563eb;  /* blue-600 */
```

### 7.2 Componentes UI Primitivos

#### Badge
```tsx
// variants: 'active' | 'closed' | 'cancelled' | 'vip' | 'normal' | 'inside' | 'outside'
<Badge variant="active">Ativo</Badge>
<Badge variant="vip">VIP</Badge>
```

#### MetricCard
```tsx
<MetricCard
  label="Check-ins Realizados"
  value={42}
  icon={<CheckCircleIcon />}
  trend="+3 nas últimas 2h"   // opcional
/>
```

#### EmptyState
```tsx
<EmptyState
  title="Nenhum evento encontrado"
  description="Tente ajustar os filtros de busca."
  icon={<CalendarIcon />}
/>
```

#### ErrorState
```tsx
<ErrorState
  message="Não foi possível carregar os eventos."
  onRetry={() => refetch()}
/>
```

### 7.3 Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| `< 768px` (mobile) | Cards empilhados, sem tabela, botões full-width |
| `768px–1024px` (tablet) | Grid 2 colunas para métricas, tabela com scroll |
| `> 1024px` (desktop) | Layout completo, sidebar, tabela expandida |

### 7.4 Feedback de Ações (Toast/Notificações)

| Ação | Tipo | Mensagem |
|------|------|---------|
| Check-in VIP — sucesso | ✅ success | "Entrada registrada para [Nome]" |
| Check-in Normal — sucesso | ✅ success | "Check-in realizado para [Nome]" |
| Saída VIP — sucesso | ✅ success | "Saída registrada para [Nome]" |
| Check-in Normal repetido | ❌ error | "[Nome] já realizou o check-in" |
| Evento encerrado | ⚠️ warning | "Evento encerrado — check-ins desabilitados" |

> Usar `sonner` ou `react-hot-toast` para toasts.

---

## 8. Testes Automatizados

### 8.1 `__tests__/checkin.test.ts`

```typescript
import { validateCheckin } from '@/lib/checkin';

describe('Regras de check-in', () => {
  test('Normal: primeiro check-in retorna sucesso', () => { ... });
  test('Normal: segundo check-in retorna already_checked_in', () => { ... });
  test('VIP: múltiplos check-ins alternam entry/exit com sucesso', () => { ... });
  test('Evento closed: bloqueia qualquer check-in', () => { ... });
  test('Evento cancelled: bloqueia qualquer check-in', () => { ... });
});
```

### 8.2 `__tests__/EventList.test.tsx`

```typescript
describe('Listagem de Eventos', () => {
  test('Exibe skeleton enquanto carrega', () => { ... });
  test('Exibe EmptyState quando lista está vazia', () => { ... });
  test('Exibe ErrorState quando request falha', () => { ... });
  test('Filtra eventos por status', () => { ... });
  test('Busca por nome com debounce', () => { ... });
});
```

### 8.3 `__tests__/CheckinButton.test.tsx`

```typescript
describe('Botão de Check-in', () => {
  test('Dispara check-in e atualiza status do participante', () => { ... });
  test('Fica disabled para normal após primeiro check-in', () => { ... });
  test('Exibe toast de erro quando regra é violada', () => { ... });
});
```

---

## 9. Edge Cases Tratados pela API

| Evento | Edge case | Como tratar |
|--------|-----------|-------------|
| EVT-002 (closed) | Bloquear check-ins | `event.status === 'closed'` → disable todos os botões |
| EVT-004 (cancelled) | Sem participantes ativos | Exibir EmptyState na lista de participantes |
| VIPs em geral | `checkin_count > 1`, registros entry/exit alternados | Derivar status atual pelo último checkin no histórico |
| `error_reason: null` | Check-in bem-sucedido | Tratar null como sucesso |
| `status: outside` com `checkin_count > 0` | Participante já fez check-in e saiu | Normal: bloquear reentrada; VIP: permitir |

---

## 10. Configuração Inicial do Projeto

```bash
npx create-next-app@latest event-panel \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir=false \
  --import-alias="@/*"

cd event-panel

npm install \
  @tanstack/react-query \
  zustand \
  recharts \
  sonner \
  use-debounce \
  lucide-react

npm install -D \
  vitest \
  @vitest/ui \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event \
  jsdom
```

### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

### `vitest.setup.ts`
```typescript
import '@testing-library/jest-dom';
```

### `app/providers.tsx`
```tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}
```

---

## 11. Comandos do README

```bash
# Instalar dependências
npm install

# Rodar localmente
npm run dev

# Rodar testes
npm test

# Build de produção
npm run build
```

---

## 12. Decisões Técnicas

| Decisão | Justificativa |
|---------|--------------|
| Next.js App Router | File-based routing, SSR/SSG nativo, melhor DX |
| React Query | Cache, loading/error states automáticos, refetch |
| Zustand | Estado leve para check-ins simulados client-side |
| Recharts | Componentes compostos, integração fácil com React |
| Sonner | Toast moderno, acessível, fácil de usar |
| use-debounce | Evitar re-renders excessivos na busca |
| Vitest + RTL | Rápido, compatível com Vite/Next, API idêntica ao Jest |

---

## 13. Melhorias para o Futuro

- Integração com json-server local (Opção B) para CRUD real
- Paginação na lista de participantes
- Filtros avançados no dashboard (por período, tipo)
- Export de relatório CSV
- Modo escuro
- PWA / offline support
- Autenticação (NextAuth)

---

## 14. Prompts Sugeridos para Desenvolvimento com Claude

Use os prompts abaixo em sequência, um por vez, sempre passando este SPECS.md como contexto:

1. **Setup inicial:**
   > "Com base no SPECS.md, crie a estrutura de pastas do projeto, o arquivo `types/index.ts`, `lib/api.ts`, `lib/checkin.ts`, `store/checkinStore.ts` e o `app/providers.tsx`."

2. **Componentes UI primitivos:**
   > "Crie os componentes em `components/ui/`: Badge, MetricCard, EmptyState, ErrorState e Spinner, seguindo o design system do SPECS.md com Tailwind CSS."

3. **Tela de listagem:**
   > "Crie a tela `/events/page.tsx` com filtros, busca com debounce, ordenação por data e os três estados (loading, vazio, erro), usando os hooks e componentes definidos no SPECS.md."

4. **Dashboard do evento:**
   > "Crie a tela `/events/[id]/page.tsx` com os 4 cards de métricas, o gráfico de evolução de check-ins (Recharts LineChart) e a tabela de participantes com botão de ação."

5. **Lógica de check-in:**
   > "Implemente o componente `CheckinButton` que usa `validateCheckin` do `lib/checkin.ts`, atualiza o Zustand store e exibe toasts via Sonner conforme a tabela de feedback do SPECS.md."

6. **Testes:**
   > "Crie os 3 arquivos de teste em `__tests__/` conforme os casos descritos na seção 8 do SPECS.md."

7. **Responsividade:**
   > "Revise todas as telas para garantir responsividade mobile/tablet/desktop conforme a seção 7.3 do SPECS.md."

8. **README:**
   > "Gere o README.md completo com instruções de instalação, decisões técnicas, melhorias futuras e documentação do uso de IA, baseando-se nas seções 10-13 do SPECS.md."
