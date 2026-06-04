'use client';

import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import type { Event } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { EVENT_STATUS_LABELS, formatDate } from '@/lib/utils';

interface EventTableProps {
  events: Event[];
}

export function EventTable({ events }: EventTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">Data</th>
            <th className="px-4 py-3">Local</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Participantes</th>
            <th className="px-4 py-3 text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {events.map((event) => (
            <tr
              key={event.id}
              onClick={() => router.push(`/events/${event.id}`)}
              className="cursor-pointer transition-colors hover:bg-blue-50/50"
            >
              <td className="px-4 py-3 font-medium text-gray-900">{event.name}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(event.date)}</td>
              <td className="px-4 py-3 text-gray-600">{event.location}</td>
              <td className="px-4 py-3">
                <Badge variant={event.status}>
                  {EVENT_STATUS_LABELS[event.status]}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-600">
                {event.checkin_count}
                <span className="text-gray-400"> / {event.expected_count}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="inline-flex items-center gap-1 font-medium text-blue-600">
                  Ver dashboard
                  <ChevronRight className="h-4 w-4" />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default EventTable;
