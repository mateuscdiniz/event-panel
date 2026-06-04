import { useCallback } from 'react';
import { useLocaleStore } from '@/store/localeStore';
import { DATE_LOCALES, translate, type Locale } from '@/lib/i18n';

type Params = Record<string, string | number>;

interface UseTranslation {
  t: (key: string, params?: Params) => string;
  locale: Locale;
  dateLocale: string; // BCP47 para Intl
}

export function useT(): UseTranslation {
  const locale = useLocaleStore((s) => s.locale);
  const t = useCallback(
    (key: string, params?: Params) => translate(locale, key, params),
    [locale]
  );
  return { t, locale, dateLocale: DATE_LOCALES[locale] };
}
