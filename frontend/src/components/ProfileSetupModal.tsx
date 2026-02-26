import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { Loader2 } from 'lucide-react';

export default function ProfileSetupModal() {
  const [name, setName] = useState('');
  const { mutate: saveProfile, isPending } = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile({
        name: name.trim(),
        digiPoints: BigInt(0),
        balance: 0,
        spendingLimits: [],
        bankAccountNumber: undefined,
      });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl">Welcome to FinMate! 🎉</DialogTitle>
          <DialogDescription>
            Let's set up your profile to get started with smart budgeting.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isPending}
              className="h-12"
            />
          </div>
          <Button
            type="submit"
            disabled={!name.trim() || isPending}
            className="w-full h-12 bg-gradient-to-r from-[oklch(0.55_0.18_280)] to-[oklch(0.45_0.15_260)] hover:from-[oklch(0.60_0.20_280)] hover:to-[oklch(0.50_0.17_260)] text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              'Get Started'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
