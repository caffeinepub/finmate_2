import React, { useState } from 'react';
import { useAddTransaction } from '../hooks/useAddTransaction';
import { useBalance } from '../hooks/useBalance';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CATEGORIES } from '../data/categories';

interface PaymentFormProps {
  paymentMethod: string;
  recipient?: string;
  onSuccess?: () => void;
}

export default function PaymentForm({ paymentMethod, recipient, onSuccess }: PaymentFormProps) {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState(recipient || '');
  const [type, setType] = useState<'debit' | 'credit'>('debit');

  const addTransaction = useAddTransaction();
  const { data: balance = 0 } = useBalance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!numAmount || numAmount <= 0) return;
    if (!category) return;

    await addTransaction.mutateAsync({
      amount: numAmount,
      type,
      category,
      description: description || `${type === 'debit' ? 'Payment' : 'Receipt'} via ${paymentMethod}`,
      paymentMethod,
      timestamp: BigInt(Date.now()) * BigInt(1_000_000),
    });

    setAmount('');
    setCategory('');
    setDescription('');
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType('debit')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            type === 'debit'
              ? 'bg-red-500 text-white'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          💸 Debit
        </button>
        <button
          type="button"
          onClick={() => setType('credit')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
            type === 'credit'
              ? 'bg-green-500 text-white'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          💰 Credit
        </button>
      </div>

      <div>
        <Label htmlFor="amount">Amount (₹)</Label>
        <Input
          id="amount"
          type="number"
          placeholder="0.00"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          min="0"
          step="0.01"
          required
          className="mt-1"
        />
        {type === 'debit' && balance > 0 && (
          <p className="text-xs text-muted-foreground mt-1">Available: ₹{balance.toFixed(2)}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category" className="mt-1">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="What's this for?"
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="mt-1"
        />
      </div>

      <Button
        type="submit"
        disabled={addTransaction.isPending || !amount || !category}
        className="w-full bg-gradient-to-r from-primary to-secondary text-white"
      >
        {addTransaction.isPending ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Processing...
          </span>
        ) : (
          `${type === 'debit' ? 'Pay' : 'Add'} ₹${amount || '0'}`
        )}
      </Button>
    </form>
  );
}
