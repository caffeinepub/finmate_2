import React from 'react';
import { Building2, ChevronRight, Link } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useGetBankAccount } from '../hooks/useGetBankAccount';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function maskAccountNumber(account: string): string {
  if (account.length <= 4) return account;
  return '****' + account.slice(-4);
}

export default function LinkedBankAccount() {
  const navigate = useNavigate();
  const { data: bankAccount, isLoading } = useGetBankAccount();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Building2 size={18} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Bank Account</p>
              {isLoading ? (
                <p className="text-xs text-muted-foreground">Loading...</p>
              ) : bankAccount ? (
                <p className="text-xs text-muted-foreground">{maskAccountNumber(bankAccount)}</p>
              ) : (
                <p className="text-xs text-muted-foreground">No account linked</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/bank-linking' })}
            className="text-primary text-xs gap-1"
          >
            {bankAccount ? (
              <>Manage <ChevronRight size={14} /></>
            ) : (
              <>Link <Link size={14} /></>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
