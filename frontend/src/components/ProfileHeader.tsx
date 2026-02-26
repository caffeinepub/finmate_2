import React, { useState } from 'react';
import { Edit2, Check, X } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useGetCallerUserProfile';
import { useSaveCallerUserProfile } from '../hooks/useSaveCallerUserProfile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const AVATAR_COLORS = [
  'from-purple-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-pink-500 to-rose-500',
  'from-green-500 to-teal-500',
  'from-orange-500 to-amber-500',
];

function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ProfileHeader() {
  const { data: profile } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState('');

  const name = profile?.name || 'User';
  const initials = getInitials(name);
  const avatarColor = getAvatarColor(name);

  const handleSavePhone = () => {
    if (!profile) return;
    saveProfile.mutate(
      {
        ...profile,
        name: profile.name,
        digiPoints: profile.digiPoints,
        balance: profile.balance,
        spendingLimits: profile.spendingLimits,
        bankAccountNumber: profile.bankAccountNumber,
      },
      {
        onSuccess: () => {
          setEditingPhone(false);
          localStorage.setItem('finmate-phone', phone);
        },
      }
    );
  };

  const storedPhone = localStorage.getItem('finmate-phone') || '';

  return (
    <div className="flex flex-col items-center py-6 px-4">
      {/* Avatar */}
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-2xl font-bold shadow-lg mb-3`}>
        {initials}
      </div>

      {/* Name */}
      <h2 className="text-xl font-bold text-foreground">{name}</h2>

      {/* Email */}
      <p className="text-sm text-muted-foreground mt-1">Linked via Internet Identity</p>

      {/* Phone */}
      <div className="mt-3 flex items-center gap-2">
        {editingPhone ? (
          <>
            <Input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-40 h-8 text-sm"
            />
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={handleSavePhone}
              disabled={saveProfile.isPending}
            >
              <Check size={14} className="text-green-500" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8"
              onClick={() => setEditingPhone(false)}
            >
              <X size={14} className="text-red-500" />
            </Button>
          </>
        ) : (
          <>
            <span className="text-sm text-muted-foreground">
              {storedPhone || 'No phone added'}
            </span>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={() => {
                setPhone(storedPhone);
                setEditingPhone(true);
              }}
            >
              <Edit2 size={13} className="text-muted-foreground" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
