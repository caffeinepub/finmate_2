import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import {
  Gift,
  Tag,
  LogOut,
  ChevronRight,
  Shield,
} from 'lucide-react';
import ProfileHeader from '../components/ProfileHeader';
import LinkedBankAccount from '../components/LinkedBankAccount';
import SubscriptionPlan from '../components/SubscriptionPlan';
import NotificationSettings from '../components/NotificationSettings';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/login' });
  };

  const menuItems = [
    {
      icon: <Gift size={18} className="text-primary" />,
      label: 'Refer & Earn',
      description: 'Earn DigiPoints for referrals',
      onClick: () => navigate({ to: '/referral' }),
    },
    {
      icon: <Tag size={18} className="text-primary" />,
      label: 'Offers & Deals',
      description: 'Exclusive student discounts',
      onClick: () => navigate({ to: '/offers' }),
    },
    {
      icon: <Shield size={18} className="text-primary" />,
      label: 'Security',
      description: 'Manage your account security',
      onClick: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary px-4 pt-12 pb-6">
        <h1 className="text-white font-bold text-2xl">Profile</h1>
        <p className="text-white/70 text-sm mt-1">Manage your account</p>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Profile Header */}
        <ProfileHeader />

        <Separator />

        {/* Linked Bank Account */}
        <LinkedBankAccount />

        {/* Subscription Plan */}
        <SubscriptionPlan />

        {/* Notification Settings */}
        <NotificationSettings />

        <Separator />

        {/* Menu Items */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {menuItems.map((item, idx) => (
            <button
              key={item.label}
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors text-left ${
                idx < menuItems.length - 1 ? 'border-b border-border/50' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <ChevronRight size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border-2 border-red-500/30 text-red-500 hover:bg-red-500/10 transition-all font-medium text-sm"
        >
          <LogOut size={18} />
          Log Out
        </button>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-xs text-muted-foreground">
            Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="text-xs text-muted-foreground mt-1">© {new Date().getFullYear()} FinMate</p>
        </div>
      </div>
    </div>
  );
}
