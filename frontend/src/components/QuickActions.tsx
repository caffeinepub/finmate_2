import React from 'react';
import { Smartphone, Train, Send } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';

interface QuickActionsProps {
  onSendMoney: () => void;
}

export default function QuickActions({ onSendMoney }: QuickActionsProps) {
  const navigate = useNavigate();

  const actions = [
    {
      icon: <Smartphone size={22} />,
      label: 'Recharge',
      onClick: () => navigate({ to: '/recharge' }),
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: <Train size={22} />,
      label: 'Train Tickets',
      onClick: () => toast.info('Coming Soon! Train ticket booking will be available shortly.'),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Send size={22} />,
      label: 'Send Money',
      onClick: onSendMoney,
      color: 'from-indigo-500 to-indigo-600',
    },
  ];

  return (
    <div className="px-4 py-3">
      <h3 className="text-sm font-semibold text-foreground/70 mb-3">Quick Actions</h3>
      <div className="grid grid-cols-3 gap-3">
        {actions.map(action => (
          <button
            key={action.label}
            onClick={action.onClick}
            className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-card border border-border hover:shadow-md transition-all duration-200 active:scale-95"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-sm`}>
              {action.icon}
            </div>
            <span className="text-xs font-medium text-foreground/80">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
