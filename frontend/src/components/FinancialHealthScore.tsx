import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { calculateFinancialHealthScore } from '../utils/financialHealthScore';
import { Transaction, SpendingLimit, Challenge } from '../backend';
import { Shield } from 'lucide-react';

interface FinancialHealthScoreProps {
  transactions: Transaction[];
  balance: number;
  spendingLimits: SpendingLimit[];
  challenges: Challenge[];
}

export default function FinancialHealthScore({
  transactions,
  balance,
  spendingLimits,
  challenges,
}: FinancialHealthScoreProps) {
  const { score, label, color } = calculateFinancialHealthScore(
    transactions,
    balance,
    spendingLimits,
    challenges
  );

  const chartData = [{ name: 'score', value: score, fill: 'url(#scoreGradient)' }];

  const ringColor =
    label === 'Excellent' ? 'oklch(0.65 0.15 180)' :
    label === 'Good' ? 'oklch(0.65 0.18 145)' :
    label === 'Fair' ? 'oklch(0.75 0.18 85)' :
    'oklch(0.60 0.22 25)';

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 flex-shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="65%"
                outerRadius="100%"
                startAngle={90}
                endAngle={90 - (score / 100) * 360}
                data={[{ value: score }]}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={10}
                  fill={ringColor}
                  background={{ fill: 'var(--muted)' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">{score}</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={16} className="text-primary" />
              <span className="text-sm font-semibold text-foreground">Financial Health</span>
            </div>
            <p className={`text-2xl font-bold ${color}`}>{label}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Based on savings rate, budget adherence & challenge completion
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
