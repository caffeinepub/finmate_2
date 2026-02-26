import React, { useState } from 'react';
import { ArrowLeft, Smartphone, CheckCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const OPERATORS = ['Jio', 'Airtel', 'Vi (Vodafone Idea)', 'BSNL', 'MTNL'];
const PLANS = [
  { amount: 149, validity: '28 days', data: '1GB/day' },
  { amount: 239, validity: '28 days', data: '1.5GB/day' },
  { amount: 299, validity: '28 days', data: '2GB/day' },
  { amount: 479, validity: '56 days', data: '1.5GB/day' },
  { amount: 599, validity: '84 days', data: '1.5GB/day' },
];

export default function RechargePage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [operator, setOperator] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    if (!phone || phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!operator) {
      toast.error('Please select an operator');
      return;
    }
    if (selectedPlan === null) {
      toast.error('Please select a recharge plan');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    toast.success(`Recharge of ₹${PLANS[selectedPlan].amount} successful for ${phone}!`);
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary px-4 pt-12 pb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate({ to: '/' })}
            className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-white font-bold text-xl">Mobile Recharge</h1>
            <p className="text-white/70 text-sm">Recharge your mobile instantly</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-4">
        {/* Phone Number */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone size={18} className="text-primary" />
              Mobile Number
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Operator</Label>
              <Select value={operator} onValueChange={setOperator}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select operator" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATORS.map(op => (
                    <SelectItem key={op} value={op}>{op}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Plans */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Select Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {PLANS.map((plan, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPlan(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border-2 transition-all ${
                    selectedPlan === idx
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="text-left">
                    <p className="font-semibold text-foreground">₹{plan.amount}</p>
                    <p className="text-xs text-muted-foreground">{plan.data} • {plan.validity}</p>
                  </div>
                  {selectedPlan === idx && (
                    <CheckCircle size={20} className="text-primary" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button
          onClick={handleRecharge}
          disabled={loading}
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-secondary text-white"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            `Recharge${selectedPlan !== null ? ` ₹${PLANS[selectedPlan].amount}` : ''}`
          )}
        </Button>
      </div>
    </div>
  );
}
