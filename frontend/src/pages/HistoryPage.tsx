import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetTransactions } from '../hooks/useTransactions';
import TransactionList from '../components/TransactionList';
import { filterTransactionsByPeriod } from '../utils/dateFilters';

export default function HistoryPage() {
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const { data: transactions = [], isLoading } = useGetTransactions();

  const filteredTransactions = filterTransactionsByPeriod(transactions, period);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Transaction History</h2>
        <p className="text-muted-foreground">Track all your expenses and income</p>
      </div>

      <Tabs value={period} onValueChange={(v) => setPeriod(v as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading transactions...</p>
          ) : filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No transactions in this period
            </p>
          ) : (
            <TransactionList transactions={filteredTransactions} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
