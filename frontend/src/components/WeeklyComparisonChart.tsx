import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeeklyComparisonChartProps {
  transactions: Transaction[];
}

function getWeekBounds(weeksAgo: number) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - dayOfWeek);
  startOfThisWeek.setHours(0, 0, 0, 0);

  const start = new Date(startOfThisWeek);
  start.setDate(start.getDate() - weeksAgo * 7);
  const end = new Date(start);
  end.setDate(end.getDate() + 7);
  return { start: start.getTime(), end: end.getTime() };
}

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Recharge', 'Others'];

export default function WeeklyComparisonChart({ transactions }: WeeklyComparisonChartProps) {
  const thisWeek = getWeekBounds(0);
  const lastWeek = getWeekBounds(1);

  const debits = transactions.filter(t => t.type === 'debit');

  const data = CATEGORIES.map(cat => {
    const catLower = cat.toLowerCase();
    const thisWeekTotal = debits
      .filter(t => {
        const ts = Number(t.timestamp) / 1_000_000;
        return ts >= thisWeek.start && ts < thisWeek.end &&
          t.category.toLowerCase() === catLower;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    const lastWeekTotal = debits
      .filter(t => {
        const ts = Number(t.timestamp) / 1_000_000;
        return ts >= lastWeek.start && ts < lastWeek.end &&
          t.category.toLowerCase() === catLower;
      })
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      category: cat,
      'This Week': Math.round(thisWeekTotal),
      'Last Week': Math.round(lastWeekTotal),
    };
  });

  const hasData = data.some(d => d['This Week'] > 0 || d['Last Week'] > 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Weekly Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="h-40 flex items-center justify-center text-muted-foreground text-sm">
            No data for weekly comparison
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="category" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(value: number) => [`₹${value}`, '']}
                contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
              />
              <Legend />
              <Bar dataKey="This Week" fill="oklch(0.55 0.22 280)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Last Week" fill="oklch(0.65 0.15 220)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
