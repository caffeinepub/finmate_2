import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChatInterface from '../components/ChatInterface';
import { getBudgetingResponse } from '../utils/chatResponses';

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'bot'; content: string }>>([
    {
      role: 'bot',
      content: 'Hello! I\'m your FinMate AI assistant. I can help you with budgeting tips, saving strategies, and financial advice. How can I help you today?',
    },
  ]);

  const handleSendMessage = (message: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    const response = getBudgetingResponse(message);
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'bot', content: response }]);
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">AI Chatbot</h2>
        <p className="text-muted-foreground">Get personalized financial advice</p>
      </div>

      <Card className="bg-gradient-to-br from-card to-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🤖</span>
            FinMate AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChatInterface messages={messages} onSendMessage={handleSendMessage} />
        </CardContent>
      </Card>
    </div>
  );
}
