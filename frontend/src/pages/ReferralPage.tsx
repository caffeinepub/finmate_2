import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useReferrals } from '../hooks/useReferrals';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Copy, Share2, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralPage() {
  const { data: referrals = [] } = useReferrals();
  const { identity } = useInternetIdentity();
  const referralCode = identity?.getPrincipal().toString().slice(0, 8).toUpperCase() || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Join FinMate',
        text: `Use my referral code ${referralCode} to join FinMate and start managing your finances smartly!`,
      });
    } else {
      handleCopy();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Refer & Earn</h2>
        <p className="text-muted-foreground">Invite friends and earn rewards</p>
      </div>

      <Card className="bg-gradient-to-br from-[oklch(0.45_0.15_280)] to-[oklch(0.35_0.12_260)] text-white">
        <CardContent className="p-6 space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm opacity-90">Your Referral Code</p>
            <p className="text-4xl font-bold tracking-wider">{referralCode}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              variant="secondary"
              className="flex-1"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
            <Button
              onClick={handleShare}
              variant="secondary"
              className="flex-1"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Your Referrals ({referrals.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No referrals yet. Start inviting friends!
            </p>
          ) : (
            <div className="space-y-2">
              {referrals.map((referral, index) => (
                <div
                  key={referral.toString()}
                  className="flex items-center justify-between p-3 bg-accent/50 rounded-xl"
                >
                  <span className="text-sm text-foreground">Referral #{index + 1}</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {referral.toString().slice(0, 8)}...
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground">How it works</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-[oklch(0.55_0.18_280)]">1.</span>
                Share your referral code with friends
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-[oklch(0.55_0.18_280)]">2.</span>
                They sign up using your code
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-[oklch(0.55_0.18_280)]">3.</span>
                You both earn 10 digi points!
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
