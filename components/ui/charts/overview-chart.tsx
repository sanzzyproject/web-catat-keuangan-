'use client';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface ChartData {
  name: string;
  amount: number;
}

export function OverviewChart({ data }: { data: ChartData[] }) {
  const { theme } = useTheme();
  
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} />
          <XAxis 
            dataKey="name" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
            dy={10}
          />
          <YAxis 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value / 1000}k`} 
            tick={{ fill: theme === 'dark' ? '#94a3b8' : '#64748b' }}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ 
              borderRadius: '12px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
              backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
            }}
            formatter={(value: number) => [formatCurrency(value), 'Jumlah']}
          />
          <Bar 
            dataKey="amount" 
            fill="currentColor" 
            radius={[6, 6, 0, 0]} 
            className="fill-primary" 
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
