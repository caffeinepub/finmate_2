import { useNavigate } from '@tanstack/react-router';
import BankBalanceCard from '../components/BankBalanceCard';
import QRScannerButton from '../components/QRScannerButton';
import { Card, CardContent } from '@/components/ui/card';
import { useGetTransactions } from '../hooks/useTransactions';
import { ArrowUpRight, ArrowDownRight, Smartphone, Gift, MessageSquare, TrendingUp } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';

export default function HomePage() {
  const navigate = useNavigate();
  const { data: transactions = [] } = useGetTransactions();
  const { data: profile } = useGetCallerUserProfile();
  const recentTransactions = transactions.slice(0, 5);

  const quickActions = [
    { icon: Smartphone, label: 'Recharge', color: 'from-blue-500 to-blue-600', path: '/history' },
    { icon: Gift, label: 'Offers', color: 'from-pink-500 to-pink-600', path: '/offers' },
    { icon: MessageSquare, label: 'AI Chat', color: 'from-purple-500 to-purple-600', path: '/chatbot' },
    { icon: TrendingUp, label: 'Limits', color: 'from-green-500 to-green-600', path: '/limits' },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Welcome back, {profile?.name || 'Student'}! 👋
        </h2>
        <p className="text-muted-foreground">Manage your finances smartly</p>
      </div>

      <BankBalanceCard />

      <div className="flex justify-center">
        <QRScannerButton />
      </div>

      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.label}
              onClick={() => navigate({ to: action.path })}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card hover:bg-accent transition-colors"
            >
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-medium text-foreground">{action.label}</span>
            </button>
          );
        })}
      </div>

      <Card className="bg-gradient-to-br from-card to-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground">Recent Transactions</h3>
            <button
              onClick={() => navigate({ to: '/history' })}
              className="text-sm text-[oklch(0.55_0.18_280)] hover:underline"
            >
              View All
            </button>
          </div>

          {recentTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions yet</p>
          ) : (
            <div className="space-y-3">
              {recentTransactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-background rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'credit'
                          ? 'bg-green-500/20 text-green-600'
                          : 'bg-red-500/20 text-red-600'
                      }`}
                    >
                      {transaction.type === 'credit' ? (
                        <ArrowDownRight className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{transaction.category}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(Number(transaction.timestamp) / 1000000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <footer className="text-center text-xs text-muted-foreground py-4">
        <p>
          © {new Date().getFullYear()} FinMate • Built with ❤️ using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              window.location.hostname
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[oklch(0.55_0.18_280)] hover:underline"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </div>
  );
}
