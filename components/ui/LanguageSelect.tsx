'use client';

import { useLocaleStore } from '@/store/localeStore';
import { useT } from '@/hooks/useT';
import { Select } from '@/components/ui/Select';
import { Flag } from '@/components/ui/Flag';

export function LanguageSelect() {
  const locale = useLocaleStore((s) => s.locale);
  const setLocale = useLocaleStore((s) => s.setLocale);
  const { t } = useT();

  return (
    <Select
      aria-label={t('lang.aria')}
      value={locale}
      onChange={(v) => setLocale(v === 'en' ? 'en' : 'pt')}
      options={[
        { value: 'pt', label: t('lang.pt'), icon: <Flag country="br" /> },
        { value: 'en', label: t('lang.en'), icon: <Flag country="us" /> },
      ]}
      className="w-36"
    />
  );
}

export default LanguageSelect;
