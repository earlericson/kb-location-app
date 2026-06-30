import React, { useState } from 'react';
import { StatusActivityChart } from './chart';
import { useAreaChartData } from '@/hooks/use-area-chart';

export const StatusActivityContainer: React.FC = () => {
    const [days, setDays] = useState(0);

    // The hook now returns the correctly typed AreaChartData[]
    const chartData = useAreaChartData('locations', days);

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                <h2 className="text-lg font-semibold text-gray-800">Content Performance</h2>

                {/* Date Filter */}
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="text-sm border-gray-200 border rounded-lg px-3 py-2 text-gray-500 hover:text-gray-700 focus:outline-none bg-white"
                >
                    <option value={0}>All Time</option>
                    <option value={7}>Last 7 Days</option>
                    <option value={30}>Last 30 Days</option>
                    <option value={90}>Last 90 Days</option>
                </select>
            </div>

            {/* The Chart Component:
         It now receives 'chartData' which is already typed as AreaChartData[].
         We don't need any complex logic here because the hook handles aggregation.
      */}
            <StatusActivityChart data={chartData} />
        </div>
    );
};