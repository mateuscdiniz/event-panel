// Select customizado (substitui o <select> nativo para estilizar as options).
// Exemplo de uso:
//   <Select
//     aria-label="Filtrar por status"
//     value={status}
//     onChange={(v) => setStatus(v as StatusFilter)}
//     options={[{ value: 'all', label: 'Todos' }, { value: 'active', label: 'Ativo' }]}
//   />

'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  'aria-label'?: string;
  placeholder?: string;
  className?: string; // controla a largura do trigger
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Selecione',
  className,
  'aria-label': ariaLabel,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  // Fecha ao clicar fora.
  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [open]);

  // Abre o menu destacando a opção atualmente selecionada.
  function openMenu() {
    const idx = options.findIndex((o) => o.value === value);
    setHighlight(idx >= 0 ? idx : 0);
    setOpen(true);
  }

  function commit(index: number) {
    const opt = options[index];
    if (opt) onChange(opt.value);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openMenu();
      }
      return;
    }
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlight((h) => Math.min(options.length - 1, h + 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
        break;
      case 'Home':
        e.preventDefault();
        setHighlight(0);
        break;
      case 'End':
        e.preventDefault();
        setHighlight(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        commit(highlight);
        break;
    }
  }

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-300 bg-white py-2 pl-3 pr-2.5 text-sm text-slate-700 transition-colors hover:border-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
      >
        <span className={cn('truncate', !selected && 'text-slate-400')}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-slate-400 transition-transform',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 z-30 mt-1 max-h-60 min-w-full overflow-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5"
        >
          {options.map((opt, index) => {
            const isSelected = opt.value === value;
            const isActive = index === highlight;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => commit(index)}
                onMouseEnter={() => setHighlight(index)}
                className={cn(
                  'flex w-full items-center justify-between gap-4 whitespace-nowrap rounded-md px-2.5 py-1.5 text-left text-sm transition-colors',
                  isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-700',
                  isSelected && 'font-medium'
                )}
              >
                {opt.label}
                {isSelected && <Check className="h-4 w-4 shrink-0 text-blue-600" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Select;
