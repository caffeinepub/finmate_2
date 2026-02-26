import React, { useState } from 'react';
import { ArrowLeft, Target, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useSpendingLimits } from '../hooks/useSpendingLimits';
import { useSetSpendingLimit } from '../hooks/useSetSpendingLimit';
import { useGetTransactions } from '../hooks/useTransactions';
import { filterByMonth } from '../utils/dateFilters';
import { CATEGORIES } from '../data/categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';

export default function SpendingLimitsPage() {
  const navigate = useNavigate();
  const { data: limits = [] } = useSpendingLimits();
  const { data: transactions = [] } = useGetTransactions();
  const setLimit = useSetSpendingLimit();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [limitAmount, setLimitAmount] = useState('');

  const monthlyTransactions = filterByMonth(transactions);
  const categoryTotals: Record<string, number> = {};
  monthlyTransactions
    .filter((t) => t.type === 'debit')
    .forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

  const handleSetLimit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !limitAmount) return;
    await setLimit.mutateAsync({ category: selectedCategory, limit: parseFloat(limitAmount) });
    setSelectedCategory('');
    setLimitAmount('');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="bg-gradient-to-r from-primary to-secondary px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/challenges' })}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white font-bold text-xl">Spending Limits</h1>
            <p className="text-white/70 text-sm">Set monthly budgets per category</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Set Limit Form */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Target size={16} className="text-primary" />
              Set New Limit
            </h3>
            <form onSubmit={handleSetLimit} className="space-y-3">
              <div>
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Monthly Limit (₹)</Label>
                <Input
                  type="number"
                  placeholder="e.g. 5000"
                  value={limitAmount}
                  onChange={(e) => setLimitAmount(e.target.value)}
                  min="0"
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={setLimit.isPending || !selectedCategory || !limitAmount}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white"
              >
                {setLimit.isPending ? 'Saving...' : 'Set Limit'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Current Limits */}
        {limits.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">Current Limits</h3>
            {limits.map((limit) => {
              const spent = categoryTotals[limit.category] || 0;
              const percentage = Math.min((spent / limit.limit) * 100, 100);
              const isOver = spent > limit.limit;

              return (
                <Card key={limit.category}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isOver ? (
                          <AlertTriangle size={16} className="text-red-500" />
                        ) : (
                          <CheckCircle size={16} className="text-green-500" />
                        )}
                        <span className="font-medium text-sm text-foreground">
                          {limit.category}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-semibold ${
                          isOver ? 'text-red-500' : 'text-foreground'
                        }`}
                      >
                        ₹{spent.toFixed(0)} / ₹{limit.limit.toFixed(0)}
                      </span>
                    </div>
                    <Progress
                      value={percentage}
                      className={`h-2 ${isOver ? '[&>div]:bg-red-500' : '[&>div]:bg-primary'}`}
                    />
                    {isOver && (
                      <p className="text-xs text-red-500 mt-1">
                        Over by ₹{(spent - limit.limit).toFixed(0)}
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
