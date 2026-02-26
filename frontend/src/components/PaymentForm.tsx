import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddTransaction } from '../hooks/useAddTransaction';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentFormProps {
  onSuccess: () => void;
  paymentMethod: string;
}

export default function PaymentForm({ onSuccess, paymentMethod }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const { mutate: addTransaction, isPending } = useAddTransaction();

  const categories = [
    'grocery',
    'hostel_expense',
    'food',
    'travel',
    'personal',
    'clothing',
    'mobile_recharge',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !category) {
      toast.error('Please fill in all required fields');
      return;
    }

    addTransaction(
      {
        amount: parseFloat(amount),
        type: 'debit',
        category,
        timestamp: BigInt(Date.now() * 1000000),
        description: description || `Payment to ${recipient || 'recipient'}`,
        paymentMethod,
      },
      {
        onSuccess: () => {
          toast.success('Payment successful!');
          onSuccess();
        },
        onError: () => {
          toast.error('Payment failed. Please try again.');
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      {paymentMethod === 'phone' && (
        <div className="space-y-2">
          <Label htmlFor="recipient">Phone Number</Label>
          <Input
            id="recipient"
            type="tel"
            placeholder="Enter phone number"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={isPending}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={isPending}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} disabled={isPending}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          placeholder="What's this for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPending}
        />
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-gradient-to-r from-[oklch(0.55_0.18_280)] to-[oklch(0.45_0.15_260)] hover:from-[oklch(0.60_0.20_280)] hover:to-[oklch(0.50_0.17_260)] text-white"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ₹${amount || '0.00'}`
        )}
      </Button>
    </form>
  );
}
