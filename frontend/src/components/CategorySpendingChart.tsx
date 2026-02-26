import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategorySpendingChartProps {
  data: Array<{ category: string; amount: number }>;
}

const COLORS = [
  'oklch(0.55 0.18 280)',
  'oklch(0.60 0.15 260)',
  'oklch(0.50 0.20 300)',
  'oklch(0.65 0.12 240)',
  'oklch(0.45 0.22 320)',
  'oklch(0.70 0.10 220)',
  'oklch(0.40 0.25 340)',
];

export default function CategorySpendingChart({ data }: CategorySpendingChartProps) {
  if (data.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No spending data available</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ category, percent }) => `${category}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="amount"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `₹${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
