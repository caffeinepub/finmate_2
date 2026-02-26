import React from 'react';
import { Link } from '@tanstack/react-router';
import { AlertTriangle, ChevronRight, Target } from 'lucide-react';
import { useSpendingLimits } from '../hooks/useSpendingLimits';
import { useGetTransactions } from '../hooks/useTransactions';
import { filterByMonth } from '../utils/dateFilters';
import { Skeleton } from '@/components/ui/skeleton';

function formatCategory(cat: string): string {
  return cat
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function SpendingLimitsSummary() {
  const { data: limits = [], isLoading: limitsLoading } = useSpendingLimits();
  const { data: allTransactions = [], isLoading: txLoading } = useGetTransactions();

  const isLoading = limitsLoading || txLoading;

  const monthlyTransactions = filterByMonth(allTransactions);

  const limitRows = limits.slice(0, 4).map((sl) => {
    const spent = monthlyTransactions
      .filter((t) => t.type === 'debit' && t.category.toLowerCase() === sl.category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);

    const pct = sl.limit > 0 ? Math.min((spent / sl.limit) * 100, 100) : 0;
    const isOver = spent > sl.limit;
    const isWarning = !isOver && pct >= 80;

    return { ...sl, spent, pct, isOver, isWarning };
  });

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-3">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (limits.length === 0) {
    return (
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Spending Limits</h3>
          </div>
          <Link to="/spending-limits" className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
            Set Limits <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <p className="text-xs text-muted-foreground text-center py-3">
          No spending limits set. Tap "Set Limits" to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-4 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Spending Limits</h3>
        </div>
        <Link to="/spending-limits" className="text-xs text-primary font-medium flex items-center gap-0.5 hover:underline">
          View All <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-3">
        {limitRows.map((row) => (
          <div key={row.category}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                {(row.isOver || row.isWarning) && (
                  <AlertTriangle
                    className={`w-3.5 h-3.5 flex-shrink-0 ${row.isOver ? 'text-destructive' : 'text-warning'}`}
                  />
                )}
                <span className="text-xs font-medium text-foreground">{formatCategory(row.category)}</span>
              </div>
              <span className={`text-xs font-semibold ${row.isOver ? 'text-destructive' : row.isWarning ? 'text-warning' : 'text-muted-foreground'}`}>
                ₹{row.spent.toFixed(0)} / ₹{row.limit.toFixed(0)}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  row.isOver
                    ? 'bg-destructive'
                    : row.isWarning
                    ? 'bg-warning'
                    : 'bg-primary'
                }`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
