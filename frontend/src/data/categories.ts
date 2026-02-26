export const CATEGORIES = [
  'Food',
  'Clothes',
  'College Expenses',
  'Travel',
  'Subscriptions',
  'Bills',
  'EMI',
  'Investments',
  'Recharge',
  'Others',
] as const;

export type TransactionCategory = typeof CATEGORIES[number];
