import React from 'react';
import { Wallet, X, TrendingUp } from 'lucide-react';
import { useBalance } from '../hooks/useBalance';
import { Skeleton } from '@/components/ui/skeleton';

interface BalanceRevealCardProps {
  onDismiss: () => void;
}

export default function BalanceRevealCard({ onDismiss }: BalanceRevealCardProps) {
  const { data: balance, isLoading } = useBalance();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-xl fade-in">
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/10 rounded-full" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white/10 rounded-full" />

      <div className="relative z-10 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium opacity-90">Available Balance</span>
          </div>
          <button
            onClick={onDismiss}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
            aria-label="Hide balance"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {isLoading ? (
          <Skeleton className="h-10 w-40 bg-white/20 rounded-lg" />
        ) : (
          <div>
            <p className="text-4xl font-bold tracking-tight">
              ₹{(balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className="flex items-center gap-1 mt-1 opacity-80">
              <TrendingUp className="w-3.5 h-3.5" />
              <p className="text-xs">Your current balance</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
