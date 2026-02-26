import type { Transaction } from '../backend';

export function filterTransactionsByPeriod(
  transactions: Transaction[],
  period: 'weekly' | 'monthly' | 'yearly'
): Transaction[] {
  const now = Date.now();
  const msInDay = 24 * 60 * 60 * 1000;

  let cutoffTime: number;
  switch (period) {
    case 'weekly':
      cutoffTime = now - 7 * msInDay;
      break;
    case 'monthly':
      cutoffTime = now - 30 * msInDay;
      break;
    case 'yearly':
      cutoffTime = now - 365 * msInDay;
      break;
  }

  return transactions.filter((t) => {
    const transactionTime = Number(t.timestamp) / 1_000_000;
    return transactionTime >= cutoffTime;
  });
}

export function filterByWeek(transactions: Transaction[]): Transaction[] {
  return filterTransactionsByPeriod(transactions, 'weekly');
}

export function filterByMonth(transactions: Transaction[]): Transaction[] {
  return filterTransactionsByPeriod(transactions, 'monthly');
}

export function filterByYear(transactions: Transaction[]): Transaction[] {
  return filterTransactionsByPeriod(transactions, 'yearly');
}
