import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSpendingLimits } from '../hooks/useSpendingLimits';
import { useSetSpendingLimit } from '../hooks/useSetSpendingLimit';
import { Progress } from '@/components/ui/progress';
import { useGetTransactions } from '../hooks/useTransactions';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SpendingLimitsPage() {
  const { data: limits = [] } = useSpendingLimits();
  const { data: transactions = [] } = useGetTransactions();
  const { mutate: setLimit, isPending } = useSetSpendingLimit();
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const categories = [
    'grocery',
    'hostel_expense',
    'food',
    'travel',
    'personal',
    'clothing',
    'mobile_recharge',
  ];

  const calculateSpending = (cat: string) => {
    return transactions
      .filter((t) => t.category === cat && t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleSetLimit = (e: React.FormEvent) => {
    e.preventDefault();
    if (category && amount) {
      setLimit(
        { category, limit: parseFloat(amount) },
        {
          onSuccess: () => {
            toast.success('Spending limit updated!');
            setCategory('');
            setAmount('');
          },
        }
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Spending Limits</h2>
        <p className="text-muted-foreground">Set budgets to control your expenses</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Set New Limit</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSetLimit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                disabled={isPending}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Monthly Limit (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isPending}
                placeholder="0.00"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending || !category || !amount}
              className="w-full bg-gradient-to-r from-[oklch(0.55_0.18_280)] to-[oklch(0.45_0.15_260)] hover:from-[oklch(0.60_0.20_280)] hover:to-[oklch(0.50_0.17_260)] text-white"
            >
              Set Limit
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Current Limits</h3>
        {limits.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              No spending limits set yet
            </CardContent>
          </Card>
        ) : (
          limits.map((limit) => {
            const spent = calculateSpending(limit.category);
            const percentage = (spent / limit.limit) * 100;
            const isOverLimit = percentage > 100;
            const isNearLimit = percentage > 80 && percentage <= 100;

            return (
              <Card key={limit.category}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-foreground">
                        {limit.category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        ₹{spent.toFixed(2)} / ₹{limit.limit.toFixed(2)}
                      </span>
                    </div>
                    <Progress
                      value={Math.min(percentage, 100)}
                      className={`h-2 ${
                        isOverLimit
                          ? '[&>div]:bg-red-500'
                          : isNearLimit
                          ? '[&>div]:bg-yellow-500'
                          : '[&>div]:bg-green-500'
                      }`}
                    />
                    {(isOverLimit || isNearLimit) && (
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isOverLimit ? 'text-red-600' : 'text-yellow-600'
                        }`}
                      >
                        <AlertCircle className="w-4 h-4" />
                        <span>
                          {isOverLimit
                            ? 'Limit exceeded!'
                            : 'Approaching limit'}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
