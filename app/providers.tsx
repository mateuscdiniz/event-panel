'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useThemeStore } from '@/store/themeStore';

export function Providers({ children }: { children: React.ReactNode }) {
  // Instancia o QueryClient via useState para que cada cliente tenha sua
  // própria instância e o cache não seja compartilhado entre requests no SSR.
  const [queryClient] = useState(() => new QueryClient());
  const theme = useThemeStore((s) => s.theme);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster position="top-right" theme={theme} richColors />
    </QueryClientProvider>
  );
}
