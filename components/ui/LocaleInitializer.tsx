'use client';

import { useEffect } from 'react';
import { getPersistedLocale, useLocaleStore } from '@/store/localeStore';

// Aplica o idioma persistido (localStorage / navegador) após a montagem.
// SSR e a primeira renderização usam 'pt' (padrão), evitando mismatch de
// hidratação; o ajuste acontece depois que o cliente assume.
export function LocaleInitializer() {
  const setLocale = useLocaleStore((s) => s.setLocale);

  useEffect(() => {
    setLocale(getPersistedLocale());
  }, [setLocale]);

  return null;
}

export default LocaleInitializer;
