import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format, startOfDay, subDays } from 'date-fns';
import useStore from '../store/useStore';

export default function StatsChart() {
  const studyHistory = useStore((s) => s.studyHistory);

  const data = useMemo(() => {
    const today = startOfDay(new Date());
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const date = subDays(today, i);
      const key = format(date, 'yyyy-MM-dd');
      days.push({ date: format(date, 'MMM d'), key, reviews: 0 });
    }

    for (const entry of studyHistory) {
      const entryDate = format(startOfDay(new Date(entry.date)), 'yyyy-MM-dd');
      const day = days.find((d) => d.key === entryDate);
      if (day) day.reviews++;
    }

    return days.map((d) => ({ date: d.date, reviews: d.reviews }));
  }, [studyHistory]);

  return (
    <div className="chart-container">
      <h3 className="chart-title">Study Activity (30 days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barCategoryGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--muted)' }}
            tickLine={false}
            axisLine={false}
            interval={Math.floor(data.length / 5)}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: 'var(--muted)' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              fontSize: 13,
            }}
          />
          <Bar dataKey="reviews" fill="var(--accent)" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
