@AGENTS.md

# CLAUDE.md — EventPanel

Leia este arquivo inteiro antes de qualquer ação. Ele define como você deve se comportar neste projeto.

---

## Identidade do Projeto

**Projeto:** EventPanel — Painel de Gestão de Eventos  
**Stack:** Next.js 14 (App Router), TypeScript, Tailwind CSS, React Query, Zustand, Recharts  
**API:** Somente leitura via GitHub Pages (`https://ThiagoLifters.github.io/api_test`)  
**Testes:** Vitest + React Testing Library  
**Referência principal:** `SPECS.md` na raiz do projeto

---

## Comandos Essenciais

```bash
npm run dev          # Servidor local em http://localhost:3000
npm run build        # Build de produção
npm run lint         # ESLint
npm test             # Vitest (todos os testes)
npm test -- --ui     # Vitest com interface visual
```

---

## Regras de Comportamento

### O que você pode fazer sem pedir aprovação
- Criar ou editar arquivos dentro de `components/`, `hooks/`, `lib/`, `store/`, `types/`
- Criar arquivos de teste em `__tests__/`
- Adicionar ou ajustar estilos Tailwind
- Corrigir erros de TypeScript ou ESLint
- Refatorar um componente sem mudar seu comportamento externo
- Instalar dependências que já estão listadas no `SPECS.md`

### O que você DEVE aprovar antes de fazer
- Mudar a estrutura de pastas do projeto
- Adicionar dependências que não estão no `SPECS.md`
- Alterar os tipos em `types/index.ts`
- Mudar a lógica de negócio em `lib/checkin.ts`
- Alterar qualquer arquivo de configuração (`next.config`, `tailwind.config`, `vitest.config`)
- Fazer qualquer alteração que quebre a compatibilidade com a API

**Formato para pedir aprovação:**
> "Preciso fazer X porque Y. Posso prosseguir?"

---

## Arquitetura — Decisões Fixas

Não questione nem sugira alternativas para estas decisões:

| Decisão | Valor fixo |
|---------|-----------|
| Roteamento | App Router (nunca Pages Router) |
| Estilização | Tailwind CSS (sem styled-components, sem CSS modules) |
| Estado servidor | React Query (sem SWR, sem fetch manual) |
| Estado cliente | Zustand (sem Redux, sem Context para estado global) |
| Gráficos | Recharts (sem Chart.js, sem D3) |
| Toasts | Sonner (sem react-hot-toast, sem react-toastify) |
| Testes | Vitest + RTL (sem Jest) |
| Ícones | lucide-react (sem heroicons, sem react-icons) |

---

## Convenções de Código

### Componentes
- Um componente por arquivo
- Nome do arquivo = nome do componente (PascalCase)
- Sempre exportar como `export default` + named export para facilitar testes
- Props sempre tipadas com interface nomeada (`interface Props`)

```tsx
// ✅ Correto
interface Props {
  event: Event;
  onClick: () => void;
}

export function EventCard({ event, onClick }: Props) { ... }
export default EventCard;
```

### Hooks
- Sempre prefixar com `use`
- Encapsular toda lógica de loading/error dentro do hook
- Nunca expor `queryClient` fora dos hooks

### Lógica de negócio
- Zero lógica de negócio dentro de componentes
- Toda validação de check-in passa por `lib/checkin.ts`
- Efeitos colaterais (toast, store update) ficam no handler do componente, não no hook

### Tailwind
- Usar variantes semânticas (`text-green-600` para sucesso, `text-red-600` para erro)
- Classes condicionais via `clsx` ou `cn` (não concatenação de string)
- Nunca usar `style={{}}` inline salvo para valores dinâmicos impossíveis de fazer com Tailwind

---

## Regras de Negócio — Resumo Rápido

Consulte `lib/checkin.ts` para a implementação completa. Nunca reimplemente estas regras em outro lugar.

| Situação | Resultado |
|----------|-----------|
| Evento `closed` ou `cancelled` | Bloquear check-in, mostrar motivo |
| Participante `normal` — 1ª vez | Check-in liberado |
| Participante `normal` — 2ª tentativa | Erro: `already_checked_in` |
| Participante `vip` | Entrada e saída livres, histórico completo |

---

## Feedback ao Usuário (Toasts)

| Ação | Toast | Mensagem |
|------|-------|---------|
| Check-in sucesso (qualquer) | ✅ success | `"Entrada registrada para [Nome]"` |
| Saída VIP sucesso | ✅ success | `"Saída registrada para [Nome]"` |
| Normal repetido | ❌ error | `"[Nome] já realizou o check-in"` |
| Evento encerrado | ⚠️ warning | `"Evento encerrado — check-ins desabilitados"` |

---

## Estados Obrigatórios em Toda Lista/Tabela

Todo componente que exibe dados assíncronos deve tratar explicitamente:
1. `isLoading` → `<Skeleton />` ou spinner
2. `isError` → `<ErrorState onRetry={refetch} />`
3. `data.length === 0` → `<EmptyState />`
4. `data` → conteúdo normal

---

## Edge Cases da API

| ID | Situação | Tratamento |
|----|----------|-----------|
| EVT-002 | `status: closed` | Desabilitar todos os botões de ação |
| EVT-004 | `status: cancelled`, sem participantes | EmptyState na lista de participantes |
| Qualquer VIP | `checkin_count > 1`, entry/exit alternados | Derivar status pelo último checkin no histórico |
| `error_reason: null` | Check-in bem-sucedido | Tratar `null` como ausência de erro |
| `status: outside` com `checkin_count > 0` | Participante saiu | Normal: bloquear; VIP: permitir reentrada |

---

## O que NÃO fazer

- Nunca usar `any` no TypeScript
- Nunca fazer fetch direto em componentes (sempre via hook)
- Nunca duplicar a lógica de `validateCheckin` fora de `lib/checkin.ts`
- Nunca usar `useEffect` para busca de dados (React Query cuida disso)
- Nunca commitar código com erros de lint ou TypeScript
- Nunca criar novos arquivos de configuração sem aprovação

---

## Quando Encontrar Ambiguidade

Se uma tarefa puder ser feita de mais de uma forma e as opções tiverem trade-offs relevantes, apresente as opções antes de implementar:

```
Posso implementar isso de duas formas:
A) [descrição] — vantagem: X, desvantagem: Y
B) [descrição] — vantagem: X, desvantagem: Y

Qual prefere?
```

Se a ambiguidade for pequena (estilo, nome de variável), tome a decisão e informe ao final.