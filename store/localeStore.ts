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
  } catch {
    // localStorage indisponível — ignora.
  }
}

// Lê o idioma persistido (ou do navegador). Usado pelo LocaleInitializer
// após a montagem para evitar mismatch de hidratação (SSR sempre 'pt').
export function getPersistedLocale(): Locale {
  if (typeof window === 'undefined') return 'pt';
  try {
    const saved = localStorage.getItem('locale');
    if (saved && (LOCALES as string[]).includes(saved)) return saved as Locale;
  } catch {
    // ignora
  }
  return navigator.language.startsWith('en') ? 'en' : 'pt';
}

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: 'pt', // padrão estável no SSR; ajustado no cliente pelo LocaleInitializer
  setLocale: (locale) => {
    applyLocale(locale);
    set({ locale });
  },
}));
