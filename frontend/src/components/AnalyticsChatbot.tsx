import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from './ChatInterface';
import { generateAnalyticsInsight } from '../utils/analyticsInsights';
import type { Transaction } from '../backend';

interface AnalyticsChatbotProps {
  transactions: Transaction[];
}

export default function AnalyticsChatbot({ transactions }: AnalyticsChatbotProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; content: string }>>([
    {
      role: 'bot',
      content: 'Hi! I can help you understand your spending patterns. Ask me anything about your finances!',
    },
  ]);

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    const response = generateAnalyticsInsight(message, transactions);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', content: response }]);
    }, 500);
  };

  return (
    <Card className="bg-gradient-to-br from-[oklch(0.45_0.15_280)]/10 to-[oklch(0.35_0.12_260)]/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>💡</span>
          Analytics AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
      </CardContent>
    </Card>
  );
}
