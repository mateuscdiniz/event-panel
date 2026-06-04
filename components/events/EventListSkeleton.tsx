// Exemplo de uso:
//   {isLoading && <EventListSkeleton />}

import { Skeleton } from '@/components/ui/Skeleton';

const ROWS = 5;

export function EventListSkeleton() {
  return (
    <div role="status" aria-label="Carregando eventos">
      {/* Desktop / tablet: esqueleto em formato de tabela */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm md:block">
        {/* Cabeçalho */}
        <div className="flex items-center gap-4 border-b border-slate-200 bg-slate-50 px-4 py-3">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-40" />
          <Skeleton className="ml-auto h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
        {/* Linhas */}
        {Array.from({ length: ROWS }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-slate-100 px-4 py-4 last:border-0"
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-52" />
            <Skeleton className="ml-auto h-6 w-16 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        ))}
      </div>

      {/* Mobile: cards empilhados */}
      <div className="flex flex-col gap-3 md:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-28" />
          </div>
        ))}
      </div>

      <span className="sr-only">Carregando eventos…</span>
    </div>
  );
}

export default EventListSkeleton;
