import type { Transaction } from '../backend';

export function generateAnalyticsInsight(query: string, transactions: Transaction[]): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('spend') || lowerQuery.includes('expense')) {
    const totalExpense = transactions
      .filter((t) => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals = new Map<string, number>();
    transactions
      .filter((t) => t.type === 'debit')
      .forEach((t) => {
        categoryTotals.set(t.category, (categoryTotals.get(t.category) || 0) + t.amount);
      });

    const topCategory = Array.from(categoryTotals.entries()).sort((a, b) => b[1] - a[1])[0];

    if (topCategory) {
      return `You've spent ₹${totalExpense.toFixed(2)} in total. Your highest spending category is ${topCategory[0].replace('_', ' ')} with ₹${topCategory[1].toFixed(2)}.`;
    }

    return `You've spent ₹${totalExpense.toFixed(2)} in total.`;
  }

  if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
    return 'Great question! Try setting spending limits for each category and track your progress. Complete challenges to earn digi points and stay motivated!';
  }

  if (lowerQuery.includes('budget')) {
    return 'To create an effective budget, start by tracking all your expenses, set realistic spending limits for each category, and review your spending patterns weekly.';
  }

  if (lowerQuery.includes('category') || lowerQuery.includes('categories')) {
    const categories = Array.from(
      new Set(transactions.map((t) => t.category))
    );
    return `You have transactions in ${categories.length} categories: ${categories.map((c) => c.replace('_', ' ')).join(', ')}.`;
  }

  return 'I can help you understand your spending patterns, suggest savings strategies, and provide budgeting tips. Try asking about your expenses, savings, or budget!';
}
