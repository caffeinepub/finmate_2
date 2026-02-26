import { useState, useEffect, useCallback } from 'react';
import { useActor } from './useActor';

const MAX_ATTEMPTS = 3;
const LOCKOUT_SECONDS = 30;

async function hashPin(pin: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + 'finmate-salt-v1');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function usePinVerification() {
  const { actor } = useActor();
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSetting, setIsSetting] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (!lockedUntil) return;
    const interval = setInterval(() => {
      const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
      if (remaining <= 0) {
        setLockedUntil(null);
        setAttempts(0);
        setSecondsLeft(0);
      } else {
        setSecondsLeft(remaining);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const verifyPin = useCallback(
    async (pin: string): Promise<boolean> => {
      if (!actor || isLocked) return false;
      setIsVerifying(true);
      try {
        const hash = await hashPin(pin);
        const result = await actor.verifyPinHash(hash);
        if (result) {
          setAttempts(0);
          setLockedUntil(null);
          return true;
        } else {
          const newAttempts = attempts + 1;
          setAttempts(newAttempts);
          if (newAttempts >= MAX_ATTEMPTS) {
            const until = Date.now() + LOCKOUT_SECONDS * 1000;
            setLockedUntil(until);
            setSecondsLeft(LOCKOUT_SECONDS);
          }
          return false;
        }
      } finally {
        setIsVerifying(false);
      }
    },
    [actor, attempts, isLocked]
  );

  const setPin = useCallback(
    async (pin: string): Promise<void> => {
      if (!actor) return;
      setIsSetting(true);
      try {
        const hash = await hashPin(pin);
        await actor.storePinHash(hash);
      } finally {
        setIsSetting(false);
      }
    },
    [actor]
  );

  const checkHasPin = useCallback(async (): Promise<boolean> => {
    if (!actor) return false;
    return actor.hasPinSet();
  }, [actor]);

  const resetAttempts = useCallback(() => {
    setAttempts(0);
    setLockedUntil(null);
    setSecondsLeft(0);
  }, []);

  return {
    verifyPin,
    setPin,
    checkHasPin,
    resetAttempts,
    isLocked,
    secondsLeft,
    attempts,
    attemptsLeft: MAX_ATTEMPTS - attempts,
    isVerifying,
    isSetting,
  };
}
