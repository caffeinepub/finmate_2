import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface IncomeExpenseChartProps {
  data: { income: number; expense: number };
}

export default function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  const chartData = [
    { name: 'Income', amount: data.income, fill: 'oklch(0.60 0.15 140)' },
    { name: 'Expenses', amount: data.expense, fill: 'oklch(0.55 0.20 20)' },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
        <Legend />
        <Bar dataKey="amount" fill="fill" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
