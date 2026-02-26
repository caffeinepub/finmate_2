# Specification

## Summary
**Goal:** Revamp the FinMate Home page by replacing the bank balance card with a promotional ads carousel, adding PIN-verified balance check, and surfacing spending limits and challenges/leaderboard sections.

**Planned changes:**
- Remove `BankBalanceCard` from the Home page and replace it with a horizontally scrollable promotional ads carousel (Budgeting Tips, Personal Loans, Mutual Fund Investments, Credit Score Improvement, Student Savings Plans) with auto-scroll every 4 seconds, dot indicators, and purple-blue gradient styling
- Add a "Check Balance" button on the Home page that opens a 6-digit PIN verification modal; correct PIN reveals the balance, 3 wrong attempts lock the modal for 30 seconds
- Add a Spending Limits summary section below the ads carousel showing up to 4 categories with progress bars, amber (≥80%) and red (>100%) indicators, and a "View All" link to SpendingLimitsPage
- Add a Challenges & Leaderboard preview section below Spending Limits showing up to 2 active challenges with progress and a Complete button, plus a top-3 mini leaderboard, with "View All" links to ChallengesPage
- Store and verify PIN using localStorage (hashed) as a fallback; reuse existing hooks (useSpendingLimits, useTransactions, useChallenges, useLeaderboard, useCompleteChallenge, useBalance)

**User-visible outcome:** The Home page now shows a rich ads carousel, allows PIN-protected balance reveal, and gives quick visibility into spending limits and active challenges/leaderboard without navigating away.
