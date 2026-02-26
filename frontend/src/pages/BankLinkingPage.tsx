import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetBankAccount } from '../hooks/useGetBankAccount';
import { useSetBankAccount } from '../hooks/useSetBankAccount';
import { toast } from 'sonner';
import { Wallet, CheckCircle2, Loader2 } from 'lucide-react';

export default function BankLinkingPage() {
  const { data: linkedAccount, isLoading: accountLoading } = useGetBankAccount();
  const { mutate: setBankAccount, isPending } = useSetBankAccount();
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!accountNumber.trim()) {
      toast.error('Please enter a bank account number');
      return;
    }

    setBankAccount(accountNumber, {
      onSuccess: () => {
        toast.success('Bank account linked successfully!');
        setAccountNumber('');
      },
      onError: (error: any) => {
        toast.error(error?.message || 'Failed to link bank account');
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Bank Account</h2>
        <p className="text-muted-foreground">Link your bank account for easy transactions</p>
      </div>

      {linkedAccount && (
        <Card className="bg-gradient-to-br from-[oklch(0.45_0.15_280)] to-[oklch(0.35_0.12_260)] text-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm opacity-75">Linked Account</p>
              <p className="text-lg font-bold">**** **** {linkedAccount.slice(-4)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[oklch(0.55_0.18_280)]" />
            {linkedAccount ? 'Update Bank Account' : 'Link Bank Account'}
          </CardTitle>
          <CardDescription>
            {linkedAccount 
              ? 'Enter a new account number to update your linked account'
              : 'Enter your bank account number to link it with FinMate'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Bank Account Number</Label>
              <Input
                id="accountNumber"
                type="text"
                placeholder="Enter your account number"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                disabled={isPending || accountLoading}
                className="text-base"
              />
            </div>
            <Button
              type="submit"
              disabled={isPending || accountLoading}
              className="w-full bg-gradient-to-r from-[oklch(0.55_0.18_280)] to-[oklch(0.45_0.15_260)] hover:opacity-90"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Linking...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4 mr-2" />
                  {linkedAccount ? 'Update Account' : 'Link Account'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardContent className="p-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Security Note</p>
          <p className="text-xs text-muted-foreground">
            Your bank account information is securely stored and used only for transaction purposes within FinMate.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
