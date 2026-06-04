'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';

const BUTTON_CLASS =
  'inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800';

// Detecta "montado no cliente" sem useState/useEffect (evita mismatch de hidratação,
// já que o tema vem do localStorage e não é conhecido no SSR).
function useMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggle = useThemeStore((s) => s.toggle);
  const mounted = useMounted();

  // Placeholder do mesmo tamanho até saber o tema real no cliente.
  if (!mounted) {
    return <div className={BUTTON_CLASS} aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className={BUTTON_CLASS}
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </button>
  );
}

export default ThemeToggle;
