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
import { useThemeStore } from '@/store/themeStore';
import { useT } from '@/hooks/useT';
import { formatTime } from '@/lib/utils';

interface CheckinChartProps {
  checkins: Checkin[];
}

// Agrupa check-ins de sucesso por minuto e acumula a contagem ao longo do tempo.
function buildSeries(checkins: Checkin[], dateLocale: string) {
  const successful = checkins
    .filter((c) => c.success)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  let cumulative = 0;
  return successful.map((c) => {
    cumulative += 1;
    return { time: formatTime(c.timestamp, dateLocale), total: cumulative };
  });
}

export function CheckinChart({ checkins }: CheckinChartProps) {
  const { t, dateLocale } = useT();
  const data = useMemo(() => buildSeries(checkins, dateLocale), [checkins, dateLocale]);
  const isDark = useThemeStore((s) => s.theme === 'dark');

  if (data.length === 0) {
    return (
      <EmptyState
        title={t('chart.emptyTitle')}
        description={t('chart.emptyDesc')}
      />
    );
  }

  // Cores do gráfico adaptadas ao tema (Recharts usa props inline, não CSS).
  const grid = isDark ? '#1e293b' : '#f1f5f9';
  const axisTick = isDark ? '#94a3b8' : '#6b7280';
  const axisLine = isDark ? '#334155' : '#e5e7eb';
  const line = isDark ? '#3b82f6' : '#2563eb';
  const tooltipStyle = isDark
    ? { fontSize: 12, borderRadius: 8, background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }
    : { fontSize: 12, borderRadius: 8 };

  return (
    <div className="h-72 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">
        {t('chart.title')}
      </h3>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart data={data} margin={{ top: 4, right: 12, bottom: 4, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={grid} />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 12, fill: axisTick }}
            tickLine={false}
            axisLine={{ stroke: axisLine }}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 12, fill: axisTick }}
            tickLine={false}
            axisLine={{ stroke: axisLine }}
          />
          <Tooltip
            labelFormatter={(label) => `${t('chart.time')}: ${label}`}
            formatter={(value) => [value, t('chart.cumulative')]}
            contentStyle={tooltipStyle}
            labelStyle={{ color: isDark ? '#e2e8f0' : undefined }}
          />
          <Line
            type="monotone"
            dataKey="total"
            stroke={line}
            strokeWidth={2}
            dot={{ r: 3, fill: line }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CheckinChart;
