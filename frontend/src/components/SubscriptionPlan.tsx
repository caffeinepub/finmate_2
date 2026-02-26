import React from 'react';
import { Crown } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function SubscriptionPlan() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
              <Crown size={18} className="text-yellow-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">Subscription Plan</p>
                <Badge variant="secondary" className="text-xs">Free</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Basic features included</p>
            </div>
          </div>
          <Button
            size="sm"
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs"
            onClick={() => toast.info('Upgrade feature coming soon!')}
          >
            Upgrade
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
