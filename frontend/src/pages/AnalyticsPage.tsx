import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetTransactions } from '../hooks/useTransactions';
import CategorySpendingChart from '../components/CategorySpendingChart';
import IncomeExpenseChart from '../components/IncomeExpenseChart';
import AnalyticsChatbot from '../components/AnalyticsChatbot';
import { filterTransactionsByPeriod } from '../utils/dateFilters';
import { calculateCategoryTotals, calculateIncomeExpense } from '../utils/analyticsCalculations';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const { data: transactions = [] } = useGetTransactions();

  const filteredTransactions = filterTransactionsByPeriod(transactions, period);
  const categoryData = calculateCategoryTotals(filteredTransactions);
  const incomeExpenseData = calculateIncomeExpense(filteredTransactions);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Analytics Dashboard</h2>
        <p className="text-muted-foreground">Understand your spending patterns</p>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomeExpenseChart data={incomeExpenseData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <CategorySpendingChart data={categoryData} />
          </CardContent>
        </Card>
      </div>

      <AnalyticsChatbot transactions={filteredTransactions} />
    </div>
  );
}
