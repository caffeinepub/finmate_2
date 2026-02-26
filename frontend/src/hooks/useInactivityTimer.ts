import { useState, useEffect, useCallback, useRef } from 'react';
import { useInternetIdentity } from './useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';

const TIMEOUT_SECONDS = 300; // 5 minutes
const WARNING_SECONDS = 60;

export function useInactivityTimer(enabled: boolean) {
  const [remainingSeconds, setRemainingSeconds] = useState(TIMEOUT_SECONDS);
  const [warningActive, setWarningActive] = useState(false);
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const secondsRef = useRef(TIMEOUT_SECONDS);

  const resetTimer = useCallback(() => {
    secondsRef.current = TIMEOUT_SECONDS;
    setRemainingSeconds(TIMEOUT_SECONDS);
    setWarningActive(false);
  }, []);

  const handleLogout = useCallback(async () => {
    await clear();
    queryClient.clear();
    navigate({ to: '/login' });
  }, [clear, queryClient, navigate]);

  useEffect(() => {
    if (!enabled) return;

    const handleActivity = () => resetTimer();

    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('keypress', handleActivity);

    timerRef.current = setInterval(() => {
      secondsRef.current -= 1;
      setRemainingSeconds(secondsRef.current);

      if (secondsRef.current <= WARNING_SECONDS) {
        setWarningActive(true);
      }

      if (secondsRef.current <= 0) {
        handleLogout();
      }
    }, 1000);

    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('keypress', handleActivity);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [enabled, resetTimer, handleLogout]);

  return { remainingSeconds, warningActive, resetTimer };
}
