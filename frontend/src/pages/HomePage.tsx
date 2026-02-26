import React, { useState } from 'react';
import QRScannerButton from '../components/QRScannerButton';
import QRScannerModal from '../components/QRScannerModal';
import TransactionList from '../components/TransactionList';
import TopBar from '../components/TopBar';
import QuickActions from '../components/QuickActions';
import PromotionalAdsCarousel from '../components/PromotionalAdsCarousel';
import PinVerificationModal from '../components/PinVerificationModal';
import BalanceRevealCard from '../components/BalanceRevealCard';
import SpendingLimitsSummary from '../components/SpendingLimitsSummary';
import ChallengesLeaderboardPreview from '../components/ChallengesLeaderboardPreview';
import { useGetTransactions } from '../hooks/useTransactions';
import { Eye } from 'lucide-react';

export default function HomePage() {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(false);

  const { data: transactions = [] } = useGetTransactions();
  const recentTransactions = transactions.slice(0, 5);

  const handlePinSuccess = () => {
    setShowBalance(true);
  };

  const handleHideBalance = () => {
    setShowBalance(false);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Gradient Header */}
      <div className="bg-gradient-to-br from-primary via-primary/90 to-secondary">
        <TopBar notificationCount={3} />
        <div className="px-4 pb-6 pt-2">
          <PromotionalAdsCarousel />
        </div>
      </div>

      {/* Check Balance / Balance Reveal */}
      <div className="px-4 mt-4">
        {showBalance ? (
          <BalanceRevealCard onDismiss={handleHideBalance} />
        ) : (
          <button
            onClick={() => setIsPinModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 bg-card border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground font-semibold text-sm py-3 px-4 rounded-2xl shadow-sm transition-all duration-200 group"
          >
            <div className="p-1.5 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            Check Balance (PIN Required)
          </button>
        )}
      </div>

      {/* Scan & Pay CTA */}
      <div className="px-4 mt-4 relative z-10 flex justify-center">
        <QRScannerButton onClick={() => setIsQRModalOpen(true)} />
      </div>

      {/* Quick Actions */}
      <QuickActions onSendMoney={() => setIsQRModalOpen(true)} />

      {/* Spending Limits Summary */}
      <div className="px-4 py-2">
        <SpendingLimitsSummary />
      </div>

      {/* Challenges & Leaderboard Preview */}
      <div className="px-4 py-2">
        <ChallengesLeaderboardPreview />
      </div>

      {/* Recent Transactions */}
      <div className="px-4 py-2">
        <h3 className="text-sm font-semibold text-foreground/70 mb-3">Recent Transactions</h3>
        {recentTransactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No transactions yet. Start by scanning a QR code!
          </div>
        ) : (
          <TransactionList transactions={recentTransactions} />
        )}
      </div>

      <QRScannerModal isOpen={isQRModalOpen} onClose={() => setIsQRModalOpen(false)} />
      <PinVerificationModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handlePinSuccess}
      />
    </div>
  );
}
