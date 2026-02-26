import { Transaction, SpendingLimit, Challenge } from '../backend';

interface HealthScore {
  score: number;
  label: 'Poor' | 'Fair' | 'Good' | 'Excellent';
  color: string;
}

export function calculateFinancialHealthScore(
  transactions: Transaction[],
  balance: number,
  spendingLimits: SpendingLimit[],
  challenges: Challenge[]
): HealthScore {
  const income = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  // Savings rate score (0-100)
  let savingsScore = 0;
  if (income > 0) {
    const savingsRate = Math.max(0, (income - expenses) / income);
    savingsScore = Math.min(100, savingsRate * 100);
  } else if (expenses === 0) {
    savingsScore = 50;
  }

  // Limit adherence score (0-100)
  let limitScore = 100;
  if (spendingLimits.length > 0) {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'debit')
      .forEach(t => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });

    let underLimit = 0;
    spendingLimits.forEach(sl => {
      const spent = categoryTotals[sl.category] || 0;
      if (spent <= sl.limit) underLimit++;
    });
    limitScore = (underLimit / spendingLimits.length) * 100;
  }

  // Challenge completion score (0-100)
  let challengeScore = 50;
  if (challenges.length > 0) {
    const completed = challenges.filter(c => c.completed).length;
    challengeScore = (completed / challenges.length) * 100;
  }

  const score = Math.round(savingsScore * 0.4 + limitScore * 0.4 + challengeScore * 0.2);

  let label: HealthScore['label'];
  let color: string;
  if (score >= 80) {
    label = 'Excellent';
    color = 'text-teal-500';
  } else if (score >= 60) {
    label = 'Good';
    color = 'text-green-500';
  } else if (score >= 40) {
    label = 'Fair';
    color = 'text-yellow-500';
  } else {
    label = 'Poor';
    color = 'text-red-500';
  }

  return { score, label, color };
}
