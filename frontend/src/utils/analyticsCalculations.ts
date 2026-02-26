import type { Transaction } from '../backend';

export function calculateCategoryTotals(transactions: Transaction[]) {
  const categoryMap = new Map<string, number>();

  transactions
    .filter((t) => t.type === 'debit')
    .forEach((t) => {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    });

  return Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category: category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
    amount,
  }));
}

export function calculateIncomeExpense(transactions: Transaction[]) {
  const income = transactions
    .filter((t) => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return { income, expense };
}
