import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Lock, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { usePinVerification } from '../hooks/usePinVerification';

interface PinVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PinVerificationModal({ isOpen, onClose, onSuccess }: PinVerificationModalProps) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [confirmPin, setConfirmPin] = useState('');
  const [hasPin, setHasPin] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { verifyPin, setPin: savePin, checkHasPin, resetAttempts, isLocked, secondsLeft, attemptsLeft, isVerifying, isSetting } = usePinVerification();

  useEffect(() => {
    if (isOpen) {
      setPin('');
      setConfirmPin('');
      setError('');
      setIsSettingUp(false);
      checkHasPin().then((has) => {
        setHasPin(has);
        if (!has) setIsSettingUp(true);
      });
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      resetAttempts();
    }
  }, [isOpen]);

  const handleVerify = async () => {
    if (pin.length !== 6) {
      setError('Please enter a 6-digit PIN');
      return;
    }
    setError('');
    const success = await verifyPin(pin);
    if (success) {
      onSuccess();
      onClose();
    } else {
      setPin('');
      if (isLocked) {
        setError(`Too many attempts. Locked for ${secondsLeft}s`);
      } else {
        setError(`Incorrect PIN. ${attemptsLeft} attempt${attemptsLeft !== 1 ? 's' : ''} remaining`);
      }
    }
  };

  const handleSetPin = async () => {
    if (pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }
    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }
    setError('');
    await savePin(pin);
    setHasPin(true);
    setIsSettingUp(false);
    setPin('');
    setConfirmPin('');
  };

  const handlePinInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setPin(digits);
    setError('');
  };

  const handleConfirmInput = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setConfirmPin(digits);
    setError('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (isSettingUp) handleSetPin();
      else handleVerify();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-sm mx-auto">
        <DialogHeader>
          <div className="flex justify-center mb-2">
            <div className="p-3 bg-primary/10 rounded-full">
              <Lock className="w-7 h-7 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-lg">
            {isSettingUp ? 'Set Your PIN' : 'Enter PIN to View Balance'}
          </DialogTitle>
          <DialogDescription className="text-center text-sm">
            {isSettingUp
              ? 'Create a 6-digit PIN to secure your balance'
              : 'Enter your 6-digit security PIN'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* PIN dots display */}
          <div className="flex justify-center gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                  i < pin.length
                    ? 'bg-primary border-primary scale-110'
                    : 'border-border bg-muted'
                }`}
              />
            ))}
          </div>

          {/* Hidden input */}
          <div className="relative">
            <input
              ref={inputRef}
              type={showPin ? 'text' : 'password'}
              inputMode="numeric"
              pattern="[0-9]*"
              value={pin}
              onChange={(e) => handlePinInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={6}
              className="w-full text-center text-2xl tracking-[0.5em] font-mono border border-input rounded-xl px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="••••••"
              disabled={isLocked}
            />
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Confirm PIN for setup */}
          {isSettingUp && (
            <div>
              <p className="text-xs text-muted-foreground mb-1 text-center">Confirm PIN</p>
              <div className="flex justify-center gap-3 mb-2">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                      i < confirmPin.length
                        ? 'bg-secondary border-secondary scale-110'
                        : 'border-border bg-muted'
                    }`}
                  />
                ))}
              </div>
              <input
                type={showPin ? 'text' : 'password'}
                inputMode="numeric"
                pattern="[0-9]*"
                value={confirmPin}
                onChange={(e) => handleConfirmInput(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={6}
                className="w-full text-center text-2xl tracking-[0.5em] font-mono border border-input rounded-xl px-4 py-3 bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••"
              />
            </div>
          )}

          {/* Error message */}
          {(error || isLocked) && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{isLocked ? `Locked for ${secondsLeft} seconds` : error}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              onClick={isSettingUp ? handleSetPin : handleVerify}
              disabled={isLocked || isVerifying || isSetting || pin.length !== 6 || (isSettingUp && confirmPin.length !== 6)}
            >
              {isVerifying || isSetting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isSettingUp ? 'Setting...' : 'Verifying...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {isSettingUp ? 'Set PIN' : 'Verify'}
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
