import { BusinessStatus, statusStyles } from '@/features/map/components/map-marker-color';
import { AreaChartData } from '@/types';
import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

interface StatusActivityChartProps {
  data: AreaChartData[];
}

export const StatusActivityChart: React.FC<StatusActivityChartProps> = ({ data }) => {
  // DEBUG: Check what is arriving at the chart
  console.log("Chart Data Received:", data);

  const statusKeys = Object.keys(statusStyles) as BusinessStatus[];

  return (
    <div className="h-[300] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 40, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#9ca3af', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend
            verticalAlign="top" height={36} align="left" iconType="circle" iconSize={10}
            wrapperStyle={{ top: '0' }}
          />

          {statusKeys.map((status) => (
            <Area
              key={status}
              type="monotone"
              dataKey={status}
              name={status}
              stroke={statusStyles[status].fill}
              fill={statusStyles[status].fill}
              fillOpacity={0.1}
              strokeWidth={3}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};