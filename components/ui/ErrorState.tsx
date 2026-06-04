import { AlertCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  message = 'Algo deu errado.',
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border border-red-200 bg-red-50/60 px-6 py-12 text-center dark:border-red-500/30 dark:bg-red-500/10',
        className
      )}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400">
        <AlertCircle className="h-6 w-6" />
      </span>
      <p className="max-w-sm text-sm font-medium text-red-700 dark:text-red-300">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
        >
          <RefreshCw className="h-4 w-4" />
          Tentar novamente
        </button>
      )}
    </div>
  );
}

export default ErrorState;
