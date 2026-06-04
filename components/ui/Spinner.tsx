import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

const SIZE_STYLES: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
  label?: string; // texto acessível, default "Carregando"
}

export function Spinner({ size = 'md', className, label = 'Carregando' }: SpinnerProps) {
  return (
    <span role="status" aria-live="polite" className="inline-flex items-center">
      <Loader2 className={cn('animate-spin text-blue-600', SIZE_STYLES[size], className)} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

export default Spinner;
