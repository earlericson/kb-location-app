"use client";

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartData {
  name: string;
  published: number;
  draft: number;
}

interface DashboardChartProps {
  initialData: ChartData[];
  title: string;
}

export const DashboardChart = ({ initialData, title }: DashboardChartProps) => {
  // The state lives inside the component, making it self-contained
  const [dateRange, setDateRange] = useState('6months');

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="text-sm border-gray-200 border rounded-lg px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="6months">Last 6 Months</option>
          <option value="3months">Last 3 Months</option>
          <option value="1month">Last Month</option>
        </select>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={initialData}
            margin={{ top: 40, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend verticalAlign="top" height={36} align="left" iconType="circle" iconSize={10} wrapperStyle={{
              top: '0',
            }}
            />

            <Area type="monotone" dataKey="published" name="Published" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={3} />
            <Area type="monotone" dataKey="draft" name="Drafts" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};