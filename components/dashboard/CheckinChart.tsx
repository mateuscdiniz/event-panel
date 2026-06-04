'use client';

import { useMemo } from 'react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Checkin } from '@/types';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatTime } from '@/lib/utils';

interface CheckinChartProps {
  checkins: Checkin[];
}

// Agrupa check-ins de sucesso por minuto e acumula a contagem ao longo do tempo.
function buildSeries(checkins: Checkin[]) {
  const successful = checkins
    .filter((c) => c.success)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  let cumulative = 0;
  return successful.map((c) => {
    cumulative += 1;
    return { time: formatTime(c.timestamp), total: cumulative };
  });
}

export function CheckinChart({ checkins }: CheckinChartProps) {
  const data = useMemo(() => buildSeries(checkins), [checkins]);

  if (data.length === 0) {
    return (
      <EmptyState
        title="Sem check-ins registrados"
        description="Ainda não há entradas para exibir no gráfico."
      />
    );
  }

  return (
    <div className="h-72 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-slate-700">
        Evolução de check-ins
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <Tooltip
            labelFormatter={(label) => `Horário: ${label}`}
            formatter={(value) => [value, 'Check-ins acumulados']}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 3, fill: '#2563eb' }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CheckinChart;
