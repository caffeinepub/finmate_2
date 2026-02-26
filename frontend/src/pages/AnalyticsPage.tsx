import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CategorySpendingChart from '../components/CategorySpendingChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import AnalyticsChatbot from '../components/AnalyticsChatbot';
import WeeklyComparisonChart from '../components/WeeklyComparisonChart';
import FinancialHealthScore from '../components/FinancialHealthScore';
import InsightCards from '../components/InsightCards';
import { useGetTransactions } from '../hooks/useTransactions';
import { useBalance } from '../hooks/useBalance';
import { useSpendingLimits } from '../hooks/useSpendingLimits';
import { useChallenges } from '../hooks/useChallenges';
import { filterByWeek, filterByMonth, filterByYear } from '../utils/dateFilters';
import { calculateCategoryTotals, calculateIncomeExpense } from '../utils/analyticsCalculations';

type Period = 'weekly' | 'monthly' | 'yearly';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<Period>('monthly');
  const { data: transactions = [] } = useGetTransactions();
  const { data: balance = 0 } = useBalance();
  const { data: spendingLimits = [] } = useSpendingLimits();
  const { data: challenges = [] } = useChallenges();

  const filteredTransactions = useMemo(() => {
    if (period === 'weekly') return filterByWeek(transactions);
    if (period === 'monthly') return filterByMonth(transactions);
    return filterByYear(transactions);
  }, [transactions, period]);

  const categoryData = useMemo(
    () => calculateCategoryTotals(filteredTransactions),
    [filteredTransactions]
  );

  const incomeExpenseData = useMemo(
    () => calculateIncomeExpense(filteredTransactions),
    [filteredTransactions]
  );

  const periods: { key: Period; label: string }[] = [
    { key: 'weekly', label: 'Week' },
    { key: 'monthly', label: 'Month' },
    { key: 'yearly', label: 'Year' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary px-4 pt-12 pb-6">
        <h1 className="text-white font-bold text-2xl">Analytics</h1>
        <p className="text-white/70 text-sm mt-1">Your financial overview</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Financial Health Score */}
        <FinancialHealthScore
          transactions={filteredTransactions}
          balance={balance}
          spendingLimits={spendingLimits}
          challenges={challenges}
        />

        {/* Period Filter */}
        <div className="flex gap-2">
          {periods.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                period === p.key
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Income vs Expense Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={incomeExpenseData} />
          </CardContent>
        </Card>

        {/* Category Spending Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategorySpendingChart data={categoryData} />
          </CardContent>
        </Card>

        {/* Weekly Comparison */}
        <WeeklyComparisonChart transactions={transactions} />

        {/* AI Insights */}
        <InsightCards
          transactions={filteredTransactions}
          spendingLimits={spendingLimits}
          period={period}
        />

        {/* AI Chatbot */}
        <div>
          <h3 className="text-sm font-semibold text-foreground/70 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary inline-block" />
            AI Analyst
          </h3>
          <AnalyticsChatbot
            transactions={filteredTransactions}
            spendingLimits={spendingLimits}
          />
        </div>
      </div>
    </div>
  );
}
