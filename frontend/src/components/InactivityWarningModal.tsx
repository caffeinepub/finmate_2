import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface InactivityWarningModalProps {
  open: boolean;
  remainingSeconds: number;
  onStayLoggedIn: () => void;
}

export default function InactivityWarningModal({
  open,
  remainingSeconds,
  onStayLoggedIn,
}: InactivityWarningModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm" onInteractOutside={e => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="text-yellow-500" size={20} />
            </div>
            <DialogTitle>Session Expiring Soon</DialogTitle>
          </div>
          <DialogDescription>
            You will be logged out due to inactivity in{' '}
            <span className="font-bold text-foreground text-lg">{remainingSeconds}</span>{' '}
            seconds.
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={onStayLoggedIn}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white"
        >
          Stay Logged In
        </Button>
      </DialogContent>
    </Dialog>
  );
}
