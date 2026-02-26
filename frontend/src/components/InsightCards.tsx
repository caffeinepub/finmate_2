import React from 'react';
import { AlertTriangle, TrendingUp, RefreshCw, PiggyBank, CheckCircle, PlusCircle, BarChart2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { generateInsightCards } from '../utils/analyticsInsights';
import { Transaction, SpendingLimit } from '../backend';

const ICON_MAP: Record<string, React.ReactNode> = {
  AlertTriangle: <AlertTriangle size={18} />,
  TrendingUp: <TrendingUp size={18} />,
  RefreshCw: <RefreshCw size={18} />,
  PiggyBank: <PiggyBank size={18} />,
  CheckCircle: <CheckCircle size={18} />,
  PlusCircle: <PlusCircle size={18} />,
  BarChart2: <BarChart2 size={18} />,
};

const SEVERITY_STYLES = {
  warning: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20',
  success: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  info: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
};

interface InsightCardsProps {
  transactions: Transaction[];
  spendingLimits: SpendingLimit[];
  period: string;
}

export default function InsightCards({ transactions, spendingLimits, period }: InsightCardsProps) {
  const insights = generateInsightCards(transactions, spendingLimits, period);

  if (insights.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground/70 mb-3 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary inline-block" />
        AI Insights
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {insights.map((insight, idx) => (
          <Card key={idx} className={`border ${SEVERITY_STYLES[insight.severity]}`}>
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 flex-shrink-0">
                  {ICON_MAP[insight.icon] || <TrendingUp size={18} />}
                </div>
                <div>
                  <p className="font-semibold text-sm">{insight.title}</p>
                  <p className="text-xs mt-0.5 opacity-80">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
