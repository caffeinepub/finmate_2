import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { offers } from '../data/offers';
import { Clock, Tag } from 'lucide-react';

export default function OffersPage() {
  const activeOffers = offers.filter((offer) => new Date(offer.expiryDate) > new Date());

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Student Offers</h2>
        <p className="text-muted-foreground">Exclusive deals just for you</p>
      </div>

      <div className="space-y-4">
        {activeOffers.map((offer) => (
          <Card key={offer.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="flex">
                <div className="w-24 bg-gradient-to-br from-[oklch(0.45_0.15_280)] to-[oklch(0.35_0.12_260)] flex items-center justify-center">
                  <div className="text-center text-white">
                    <p className="text-2xl font-bold">{offer.discount}</p>
                    <p className="text-xs">OFF</p>
                  </div>
                </div>
                <div className="flex-1 p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-foreground">{offer.title}</h3>
                    <Badge variant="secondary">{offer.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{offer.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Expires: {new Date(offer.expiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      <span className="font-mono">{offer.code}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
