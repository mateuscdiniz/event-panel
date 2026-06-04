'use client';

import Link from 'next/link';
import { Calendar, MapPin, Users } from 'lucide-react';
import type { Event } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { EVENT_STATUS_LABELS, formatDate } from '@/lib/utils';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.id}`}
      className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:border-blue-300 hover:shadow-md active:scale-[0.99]"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-slate-900">{event.name}</h3>
        <Badge variant={event.status}>{EVENT_STATUS_LABELS[event.status]}</Badge>
      </div>

      <dl className="flex flex-col gap-1.5 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{formatDate(event.date)}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="tabular-nums">
            {event.checkin_count}
            <span className="text-slate-400"> / {event.expected_count} participantes</span>
          </span>
        </div>
      </dl>
    </Link>
  );
}

export default EventCard;
