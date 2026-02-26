import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useGetBankAccount } from '../hooks/useGetBankAccount';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { LogOut, User, Wallet, Award, Settings, CreditCard, CheckCircle2 } from 'lucide-react';

export default function ProfilePage() {
  const { clear } = useInternetIdentity();
  const { data: profile } = useGetCallerUserProfile();
  const { data: linkedAccount } = useGetBankAccount();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/' });
  };

  const menuItems = [
    { icon: Settings, label: 'Spending Limits', path: '/limits' },
    { icon: Award, label: 'Referral Program', path: '/referral' },
    { 
      icon: CreditCard, 
      label: linkedAccount ? 'Manage Bank Account' : 'Link Bank Account', 
      path: '/bank-linking',
      badge: linkedAccount ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : null
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Profile</h2>
        <p className="text-muted-foreground">Manage your account</p>
      </div>

      <Card className="bg-gradient-to-br from-[oklch(0.45_0.15_280)] to-[oklch(0.35_0.12_260)] text-white">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">{profile?.name || 'Student'}</h3>
            <p className="text-sm opacity-75 mt-1">FinMate Member</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <Wallet className="w-8 h-8 mx-auto text-[oklch(0.55_0.18_280)]" />
            <p className="text-2xl font-bold text-foreground">₹{(profile?.balance || 0).toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">Balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center space-y-2">
            <Award className="w-8 h-8 mx-auto text-[oklch(0.55_0.18_280)]" />
            <p className="text-2xl font-bold text-foreground">{Number(profile?.digiPoints || 0)}</p>
            <p className="text-xs text-muted-foreground">Digi Points</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate({ to: item.path })}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-accent transition-colors text-left"
              >
                <Icon className="w-5 h-5 text-[oklch(0.55_0.18_280)]" />
                <span className="font-medium text-foreground flex-1">{item.label}</span>
                {item.badge}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Button
        onClick={handleLogout}
        variant="destructive"
        className="w-full"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Logout
      </Button>
    </div>
  );
}
