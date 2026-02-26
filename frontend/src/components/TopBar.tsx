import React from 'react';
import { Bell } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

interface TopBarProps {
  notificationCount?: number;
}

export default function TopBar({ notificationCount = 3 }: TopBarProps) {
  const { data: profile } = useGetCallerUserProfile();
  const greeting = getGreeting();
  const name = profile?.name || 'User';
  const initials = getInitials(name);

  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center text-white font-bold text-sm border-2 border-white/50">
          {initials}
        </div>
        <div>
          <p className="text-white/80 text-xs">{greeting},</p>
          <p className="text-white font-semibold text-sm">{name}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <button className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all text-white">
            <Bell size={18} />
          </button>
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </div>
        <ThemeToggle />
      </div>
    </div>
  );
}
