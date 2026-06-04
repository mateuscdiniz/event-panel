'use client';

import { CalendarCheck2 } from 'lucide-react';
import { useT } from '@/hooks/useT';

export function Footer() {
  const { t } = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:px-6">
        <span className="flex items-center gap-2">
          <CalendarCheck2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="font-medium text-slate-700 dark:text-slate-200">EventPanel</span>
          <span className="text-slate-400 dark:text-slate-500">© {year}</span>
        </span>
        <span className="text-center sm:text-right">
          {t('footer.tagline')}
        </span>
      </div>
    </footer>
  );
}

export default Footer;
