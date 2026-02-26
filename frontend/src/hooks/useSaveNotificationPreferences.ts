import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export interface NotificationPreferences {
  spendingLimitAlerts: boolean;
  challengeReminders: boolean;
  weeklySummary: boolean;
  offerNotifications: boolean;
}

export function useSaveNotificationPreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: NotificationPreferences) => {
      if (!actor) throw new Error('Actor not available');
      const profile = await actor.getCallerUserProfile();
      if (!profile) throw new Error('Profile not found');
      // Store preferences in the profile name field as JSON suffix (workaround since backend doesn't have dedicated field)
      // We'll store it in localStorage as the backend doesn't support this field yet
      localStorage.setItem('finmate-notification-prefs', JSON.stringify(prefs));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Notification preferences saved');
    },
    onError: () => {
      toast.error('Failed to save preferences');
    },
  });
}

export function getStoredNotificationPreferences(): NotificationPreferences {
  const stored = localStorage.getItem('finmate-notification-prefs');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fall through
    }
  }
  return {
    spendingLimitAlerts: true,
    challengeReminders: true,
    weeklySummary: false,
    offerNotifications: false,
  };
}
