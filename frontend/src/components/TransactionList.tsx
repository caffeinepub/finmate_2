import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Transaction } from '../backend';

interface TransactionListProps {
  transactions: Transaction[];
}

const categoryIcons: Record<string, string> = {
  grocery: '/assets/generated/grocery-icon.dim_80x80.png',
  hostel_expense: '/assets/generated/hostel-icon.dim_80x80.png',
  food: '/assets/generated/food-icon.dim_80x80.png',
  travel: '/assets/generated/travel-icon.dim_80x80.png',
  personal: '/assets/generated/personal-icon.dim_80x80.png',
  clothing: '/assets/generated/clothing-icon.dim_80x80.png',
  mobile_recharge: '/assets/generated/recharge-icon.dim_80x80.png',
};

export default function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => {
        const date = new Date(Number(transaction.timestamp) / 1000000);
        const isCredit = transaction.type === 'credit';

        return (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-accent/50 rounded-xl hover:bg-accent transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={categoryIcons[transaction.category] || categoryIcons.personal}
                  alt={transaction.category}
                  className="w-12 h-12 rounded-full"
                />
                <div
                  className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    isCredit ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {isCredit ? (
                    <ArrowDownRight className="w-4 h-4 text-white" />
                  ) : (
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  )}
                </div>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {transaction.category.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                </p>
                <p className="text-xs text-muted-foreground">
                  {date.toLocaleDateString()} • {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
                {transaction.description && (
                  <p className="text-xs text-muted-foreground mt-1">{transaction.description}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className={`text-lg font-bold ${isCredit ? 'text-green-600' : 'text-red-600'}`}>
                {isCredit ? '+' : '-'}₹{transaction.amount.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground capitalize">{transaction.paymentMethod}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
