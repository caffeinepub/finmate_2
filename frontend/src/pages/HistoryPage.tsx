import React, { useState, useMemo } from 'react';
import { Search, Download } from 'lucide-react';
import TransactionList from '../components/TransactionList';
import { useGetTransactions } from '../hooks/useTransactions';
import { filterByWeek, filterByMonth, filterByYear } from '../utils/dateFilters';
import { exportTransactionsToCSV } from '../utils/csvExport';
import { CATEGORIES } from '../data/categories';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

type Period = 'weekly' | 'monthly' | 'yearly';

export default function HistoryPage() {
  const { data: transactions = [] } = useGetTransactions();
  const [period, setPeriod] = useState<Period>('monthly');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const periodFiltered = useMemo(() => {
    if (period === 'weekly') return filterByWeek(transactions);
    if (period === 'monthly') return filterByMonth(transactions);
    return filterByYear(transactions);
  }, [transactions, period]);

  const categoryFiltered = useMemo(() => {
    if (selectedCategory === 'All') return periodFiltered;
    return periodFiltered.filter(
      (t) => t.category.toLowerCase() === selectedCategory.toLowerCase()
    );
  }, [periodFiltered, selectedCategory]);

  const searchFiltered = useMemo(() => {
    if (!searchQuery.trim()) return categoryFiltered;
    const q = searchQuery.toLowerCase();
    return categoryFiltered.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [categoryFiltered, searchQuery]);

  const periods: { key: Period; label: string }[] = [
    { key: 'weekly', label: 'Week' },
    { key: 'monthly', label: 'Month' },
    { key: 'yearly', label: 'Year' },
  ];

  const allCategories = ['All', ...CATEGORIES];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary px-4 pt-12 pb-6">
        <h1 className="text-white font-bold text-2xl">Transaction History</h1>
        <p className="text-white/70 text-sm mt-1">Track all your transactions</p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {/* Search + Export */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 text-xs"
            onClick={() => exportTransactionsToCSV(searchFiltered)}
          >
            <Download size={14} />
            Export
          </Button>
        </div>

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

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                selectedCategory === cat
                  ? 'bg-secondary text-white shadow-sm'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Transaction List */}
        {searchFiltered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Search size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No transactions found</p>
            <p className="text-sm mt-1">
              {searchQuery ? 'Try a different search term' : 'No transactions for this period'}
            </p>
          </div>
        ) : (
          <TransactionList transactions={searchFiltered} showCategoryEdit />
        )}
      </div>
    </div>
  );
}
