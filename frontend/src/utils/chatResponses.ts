export function getBudgetingResponse(query: string): string {
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
    return 'Hello! How can I help you with your finances today?';
  }

  if (lowerQuery.includes('save') || lowerQuery.includes('saving')) {
    return 'Here are some saving tips for students:\n\n1. Set a monthly savings goal\n2. Track every expense\n3. Use student discounts\n4. Cook meals instead of eating out\n5. Share expenses with roommates\n\nWould you like more specific advice?';
  }

  if (lowerQuery.includes('budget')) {
    return 'Creating a student budget:\n\n1. List all income sources\n2. Track fixed expenses (rent, utilities)\n3. Set limits for variable expenses (food, entertainment)\n4. Allocate 20% for savings\n5. Review and adjust monthly\n\nNeed help with a specific category?';
  }

  if (lowerQuery.includes('expense') || lowerQuery.includes('spend')) {
    return 'To manage expenses effectively:\n\n• Use the 50/30/20 rule (50% needs, 30% wants, 20% savings)\n• Set spending limits in the app\n• Review your transaction history regularly\n• Identify and reduce unnecessary expenses\n\nWhat specific expense concerns do you have?';
  }

  if (lowerQuery.includes('challenge') || lowerQuery.includes('reward')) {
    return 'Challenges help you build good financial habits! Complete saving challenges to earn digi points. These points show your progress and can be compared on the leaderboard. Stay consistent and watch your savings grow!';
  }

  if (lowerQuery.includes('limit')) {
    return 'Setting spending limits is crucial for budgeting. Go to the Spending Limits page to set monthly caps for each category. The app will alert you when you\'re approaching or exceeding your limits.';
  }

  return 'I\'m here to help with budgeting, saving, expense tracking, and financial planning. Feel free to ask me anything about managing your student finances!';
}
