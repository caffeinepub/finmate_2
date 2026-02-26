import React, { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSaveNotificationPreferences, getStoredNotificationPreferences, NotificationPreferences } from '../hooks/useSaveNotificationPreferences';

const NOTIFICATION_ITEMS = [
  {
    key: 'spendingLimitAlerts' as keyof NotificationPreferences,
    label: 'Spending Limit Alerts',
    description: 'Get notified when you approach your budget limits',
  },
  {
    key: 'challengeReminders' as keyof NotificationPreferences,
    label: 'Challenge Reminders',
    description: 'Reminders to complete your active challenges',
  },
  {
    key: 'weeklySummary' as keyof NotificationPreferences,
    label: 'Weekly Summary',
    description: 'Receive a weekly spending summary report',
  },
  {
    key: 'offerNotifications' as keyof NotificationPreferences,
    label: 'Offer Notifications',
    description: 'Get notified about new deals and offers',
  },
];

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState<NotificationPreferences>(getStoredNotificationPreferences);
  const savePrefs = useSaveNotificationPreferences();

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    savePrefs.mutate(updated);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Bell size={16} className="text-primary" />
          Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {NOTIFICATION_ITEMS.map(item => (
          <div key={item.key} className="flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="text-sm font-medium text-foreground">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
            <Switch
              checked={prefs[item.key]}
              onCheckedChange={val => handleToggle(item.key, val)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
