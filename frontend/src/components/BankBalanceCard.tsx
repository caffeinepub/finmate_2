import { Card, CardContent } from '@/components/ui/card';
import { useBalance } from '../hooks/useBalance';
import { Eye, EyeOff, Wallet } from 'lucide-react';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function BankBalanceCard() {
  const { data: balance, isLoading } = useBalance();
  const [showBalance, setShowBalance] = useState(true);

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-[oklch(0.45_0.15_280)] to-[oklch(0.35_0.12_260)] text-white">
        <CardContent className="p-6">
          <Skeleton className="h-24 w-full bg-white/20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-[oklch(0.45_0.15_280)] to-[oklch(0.35_0.12_260)] text-white shadow-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Available Balance</span>
          </div>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            {showBalance ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
          </button>
        </div>

        <div className="space-y-1">
          <p className="text-4xl font-bold">
            {showBalance ? `₹${(balance || 0).toFixed(2)}` : '₹••••••'}
          </p>
          <p className="text-sm opacity-75">Your current balance</p>
        </div>
      </CardContent>
    </Card>
  );
}
