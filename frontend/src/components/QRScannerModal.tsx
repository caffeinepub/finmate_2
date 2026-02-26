import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PaymentForm from './PaymentForm';
import { ScanLine } from 'lucide-react';

interface QRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QRScannerModal({ isOpen, onClose }: QRScannerModalProps) {
  const [activeTab, setActiveTab] = useState('scan');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make Payment</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scan">Scan QR</TabsTrigger>
            <TabsTrigger value="phone">Phone Number</TabsTrigger>
          </TabsList>

          <TabsContent value="scan" className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-[oklch(0.45_0.15_280)]/10 to-[oklch(0.35_0.12_260)]/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-[oklch(0.45_0.15_280)]">
              <div className="text-center space-y-3">
                <ScanLine className="w-16 h-16 mx-auto text-[oklch(0.45_0.15_280)]" />
                <p className="text-sm text-muted-foreground">
                  QR Scanner UI
                  <br />
                  (Camera access not available)
                </p>
              </div>
            </div>
            <PaymentForm onSuccess={onClose} paymentMethod="qr" />
          </TabsContent>

          <TabsContent value="phone">
            <PaymentForm onSuccess={onClose} paymentMethod="phone" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
