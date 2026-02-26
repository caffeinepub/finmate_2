import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScanLine } from 'lucide-react';
import QRScannerModal from './QRScannerModal';

interface QRScannerButtonProps {
  onClick?: () => void;
}

export default function QRScannerButton({ onClick }: QRScannerButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className="w-20 h-20 rounded-full bg-gradient-to-br from-[oklch(0.55_0.18_280)] to-[oklch(0.45_0.15_260)] hover:from-[oklch(0.60_0.20_280)] hover:to-[oklch(0.50_0.17_260)] text-white shadow-2xl"
      >
        <ScanLine className="w-10 h-10" />
      </Button>
      {!onClick && (
        <QRScannerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </>
  );
}
