import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft, Edit2 } from 'lucide-react';
import { Transaction } from '../backend';
import { CATEGORIES } from '../data/categories';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUpdateTransactionCategory } from '../hooks/useUpdateTransactionCategory';

const CATEGORY_ICONS: Record<string, string> = {
  food: '🍔',
  Food: '🍔',
  travel: '✈️',
  Travel: '✈️',
  grocery: '🛒',
  Grocery: '🛒',
  clothing: '👕',
  Clothes: '👕',
  hostel_expense: '🏠',
  'College Expenses': '🎓',
  mobile_recharge: '📱',
  Recharge: '📱',
  personal: '👤',
  Subscriptions: '📺',
  Bills: '💡',
  EMI: '🏦',
  Investments: '📈',
  Others: '📦',
  default: '💳',
};

function getCategoryIcon(category: string): string {
  return CATEGORY_ICONS[category] || CATEGORY_ICONS.default;
}

function formatTime(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp: bigint): string {
  const date = new Date(Number(timestamp) / 1_000_000);
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

interface TransactionListProps {
  transactions: Transaction[];
  showCategoryEdit?: boolean;
}

interface TransactionRowProps {
  transaction: Transaction;
  index: number;
  showCategoryEdit: boolean;
}

function TransactionRow({ transaction: t, index, showCategoryEdit }: TransactionRowProps) {
  const updateCategory = useUpdateTransactionCategory();
  const isDebit = t.type === 'debit';

  return (
    <div className="flex items-center gap-3 py-3 border-b border-border/50 last:border-0">
      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">
        {getCategoryIcon(t.category)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{t.description}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{formatDate(t.timestamp)}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{formatTime(t.timestamp)}</span>
          {showCategoryEdit ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-xs text-primary/70 hover:text-primary transition-colors">
                  <span>{t.category}</span>
                  <Edit2 size={10} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="max-h-60 overflow-y-auto">
                {CATEGORIES.map(cat => (
                  <DropdownMenuItem
                    key={cat}
                    onClick={() => updateCategory.mutate({ transactionIndex: index, newCategory: cat })}
                    className={t.category === cat ? 'bg-primary/10 text-primary' : ''}
                  >
                    {getCategoryIcon(cat)} {cat}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground">
              {t.category}
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 flex-shrink-0">
        <span className={`text-sm font-semibold ${isDebit ? 'text-red-500' : 'text-green-500'}`}>
          {isDebit ? '-' : '+'}₹{t.amount.toFixed(2)}
        </span>
        {isDebit ? (
          <ArrowUpRight size={14} className="text-red-400" />
        ) : (
          <ArrowDownLeft size={14} className="text-green-400" />
        )}
      </div>
    </div>
  );
}

export default function TransactionList({ transactions, showCategoryEdit = false }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No transactions to display
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl border border-border px-4">
      {transactions.map((t, idx) => (
        <TransactionRow
          key={`${t.timestamp}-${idx}`}
          transaction={t}
          index={idx}
          showCategoryEdit={showCategoryEdit}
        />
      ))}
    </div>
  );
}
