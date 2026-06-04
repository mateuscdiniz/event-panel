import { create } from 'zustand';
import { DATE_LOCALES, LOCALES, type Locale } from '@/lib/i18n';

interface LocaleStore {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

function applyLocale(locale: Locale) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = DATE_LOCALES[locale];
  try {
    localStorage.setItem('locale', locale);
  } catch {}
}

export function getPersistedLocale(): Locale {
  if (typeof window === 'undefined') return 'pt';
  try {
    const saved = localStorage.getItem('locale');
    if (saved && (LOCALES as string[]).includes(saved)) return saved as Locale;
  } catch {}
  return navigator.language.startsWith('en') ? 'en' : 'pt';
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: 'pt',
  setLocale: (locale) => {
    applyLocale(locale);
    set({ locale });
  },
}));
