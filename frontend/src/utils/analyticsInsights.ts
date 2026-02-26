import { Transaction, SpendingLimit } from '../backend';

interface InsightCard {
  title: string;
  description: string;
  icon: string;
  severity: 'info' | 'warning' | 'success';
}

export function generateInsightCards(
  transactions: Transaction[],
  spendingLimits: SpendingLimit[],
  period: string
): InsightCard[] {
  const insights: InsightCard[] = [];
  const debits = transactions.filter(t => t.type === 'debit');

  // Category totals
  const categoryTotals: Record<string, number> = {};
  debits.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  // Top overspending category
  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  if (topCategory) {
    const limit = spendingLimits.find(sl => sl.category.toLowerCase() === topCategory[0].toLowerCase());
    if (limit && topCategory[1] > limit.limit) {
      insights.push({
        title: 'Overspending Alert',
        description: `You've exceeded your ${topCategory[0]} budget by ₹${(topCategory[1] - limit.limit).toFixed(0)}. Consider reducing spending in this category.`,
        icon: 'AlertTriangle',
        severity: 'warning',
      });
    } else {
      insights.push({
        title: 'Top Spending Category',
        description: `Your highest spending is on ${topCategory[0]} at ₹${topCategory[1].toFixed(0)} this period.`,
        icon: 'TrendingUp',
        severity: 'info',
      });
    }
  }

  // Subscription waste detection
  const subscriptionTotal = categoryTotals['Subscriptions'] || categoryTotals['subscriptions'] || 0;
  if (subscriptionTotal > 500) {
    insights.push({
      title: 'Subscription Review',
      description: `You're spending ₹${subscriptionTotal.toFixed(0)} on subscriptions. Review if all are actively used.`,
      icon: 'RefreshCw',
      severity: 'warning',
    });
  }

  // Savings tip
  const totalExpenses = debits.reduce((sum, t) => sum + t.amount, 0);
  const totalIncome = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0);
  if (totalIncome > 0) {
    const savingsRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
    if (savingsRate < 20) {
      insights.push({
        title: 'Savings Tip',
        description: `Your savings rate is ${savingsRate.toFixed(0)}%. Aim for at least 20% by reducing discretionary spending.`,
        icon: 'PiggyBank',
        severity: 'warning',
      });
    } else {
      insights.push({
        title: 'Great Savings!',
        description: `You're saving ${savingsRate.toFixed(0)}% of your income. Keep up the excellent financial discipline!`,
        icon: 'CheckCircle',
        severity: 'success',
      });
    }
  } else {
    insights.push({
      title: 'Track Your Income',
      description: 'Add income transactions to get personalized savings insights and financial health analysis.',
      icon: 'PlusCircle',
      severity: 'info',
    });
  }

  // Month comparison (simple heuristic)
  const now = Date.now();
  const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
  const twoMonthsAgo = now - 60 * 24 * 60 * 60 * 1000;

  const thisMonthExpenses = debits
    .filter(t => Number(t.timestamp) / 1_000_000 >= oneMonthAgo)
    .reduce((sum, t) => sum + t.amount, 0);
  const lastMonthExpenses = debits
    .filter(t => {
      const ts = Number(t.timestamp) / 1_000_000;
      return ts >= twoMonthsAgo && ts < oneMonthAgo;
    })
    .reduce((sum, t) => sum + t.amount, 0);

  if (lastMonthExpenses > 0) {
    const change = ((thisMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
    if (change > 10) {
      insights.push({
        title: 'Month-over-Month',
        description: `Spending increased by ${change.toFixed(0)}% compared to last month. Review your recent transactions.`,
        icon: 'BarChart2',
        severity: 'warning',
      });
    } else if (change < -10) {
      insights.push({
        title: 'Month-over-Month',
        description: `Great job! Spending decreased by ${Math.abs(change).toFixed(0)}% compared to last month.`,
        icon: 'BarChart2',
        severity: 'success',
      });
    } else {
      insights.push({
        title: 'Month-over-Month',
        description: `Spending is consistent with last month (${change > 0 ? '+' : ''}${change.toFixed(0)}% change).`,
        icon: 'BarChart2',
        severity: 'info',
      });
    }
  }

  return insights.slice(0, 4);
}

// Legacy function kept for backward compatibility
export function generateAnalyticsInsight(
  query: string,
  transactions: Transaction[],
  spendingLimits: SpendingLimit[]
): string {
  const lowerQuery = query.toLowerCase();
  const debits = transactions.filter(t => t.type === 'debit');
  const credits = transactions.filter(t => t.type === 'credit');

  const categoryTotals: Record<string, number> = {};
  debits.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  if (lowerQuery.includes('food') || lowerQuery.includes('eat')) {
    const foodTotal = categoryTotals['food'] || categoryTotals['Food'] || 0;
    return `You spent ₹${foodTotal.toFixed(2)} on food in the selected period.`;
  }

  if (lowerQuery.includes('travel') || lowerQuery.includes('transport')) {
    const travelTotal = categoryTotals['travel'] || categoryTotals['Travel'] || 0;
    return `Your travel expenses total ₹${travelTotal.toFixed(2)}.`;
  }

  if (lowerQuery.includes('overspend') || lowerQuery.includes('over budget')) {
    const overBudget = spendingLimits.filter(sl => {
      const spent = categoryTotals[sl.category] || 0;
      return spent > sl.limit;
    });
    if (overBudget.length === 0) return "You're within budget for all categories. Great job!";
    return `You're over budget in: ${overBudget.map(sl => sl.category).join(', ')}.`;
  }

  if (lowerQuery.includes('total') || lowerQuery.includes('spend')) {
    const total = debits.reduce((sum, t) => sum + t.amount, 0);
    return `Total spending in the selected period: ₹${total.toFixed(2)}.`;
  }

  if (lowerQuery.includes('income') || lowerQuery.includes('credit')) {
    const total = credits.reduce((sum, t) => sum + t.amount, 0);
    return `Total income in the selected period: ₹${total.toFixed(2)}.`;
  }

  const total = debits.reduce((sum, t) => sum + t.amount, 0);
  const topCat = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
  return `Total spending: ₹${total.toFixed(2)}. ${topCat ? `Highest category: ${topCat[0]} (₹${topCat[1].toFixed(2)}).` : ''}`;
}
