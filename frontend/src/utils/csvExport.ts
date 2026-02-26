import { Transaction } from '../backend';

export function exportTransactionsToCSV(transactions: Transaction[]): void {
  const headers = ['Date', 'Time', 'Name', 'Amount', 'Category', 'Type'];

  const rows = transactions.map(t => {
    const date = new Date(Number(t.timestamp) / 1_000_000);
    const dateStr = date.toLocaleDateString('en-IN');
    const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    return [
      dateStr,
      timeStr,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      t.category,
      t.type,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions_${Date.now()}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
