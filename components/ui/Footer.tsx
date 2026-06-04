// Rodapé global da aplicação (renderizado no root layout).
// Exemplo de uso: <Footer />

import { CalendarCheck2 } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200/80 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:px-6">
        <span className="flex items-center gap-2">
          <CalendarCheck2 className="h-4 w-4 text-blue-600" />
          <span className="font-medium text-slate-700">EventPanel</span>
          <span className="text-slate-400">© {year}</span>
        </span>
        <span className="text-center sm:text-right">
          Painel de gestão de eventos
        </span>
      </div>
    </footer>
  );
}

export default Footer;
