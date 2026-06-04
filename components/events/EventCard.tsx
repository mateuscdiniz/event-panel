'use client';

import Link from 'next/link';
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react';
import type { Event } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { useT } from '@/hooks/useT';
import { formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const { t, dateLocale } = useT();
  return (
    <Link
      href={`/events/${event.id}`}
      className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-blue-300 hover:shadow-lg active:scale-[0.99] dark:border-slate-800 dark:bg-slate-900 dark:hover:border-blue-500/50"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{event.name}</h3>
        <Badge variant={event.status}>{t(`status.${event.status}`)}</Badge>
      </div>

      <dl className="flex flex-col gap-1.5 text-sm text-slate-600 dark:text-slate-300">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          <span>{formatDate(event.date, dateLocale)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500" />
          <span className="tabular-nums">
            {event.checkin_count}
            <span className="text-slate-400 dark:text-slate-500"> / {event.expected_count} {t('common.participants')}</span>
          </span>
        </div>
      </dl>

      <div className="mt-auto flex items-center justify-end gap-1 border-t border-slate-100 pt-3 text-sm font-medium text-blue-600 dark:border-slate-800 dark:text-blue-400">
        {t('events.seeDetails')}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export default EventCard;
