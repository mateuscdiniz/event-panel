'use client';

import { useEffect } from 'react';
import { getPersistedLocale, useLocaleStore } from '@/store/localeStore';

export function LocaleInitializer() {
  const setLocale = useLocaleStore((s) => s.setLocale);

  useEffect(() => {
    setLocale(getPersistedLocale());
  }, [setLocale]);

  return null;
}

export default LocaleInitializer;
