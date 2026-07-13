"use client"

import { RecentLocationTable } from '@/features/components/dashboard/recent-location';
import { RecentLog } from '@/features/components/dashboard/recent-log';
import { RadialSummaryGrid } from '@/features/components/dashboard/radial-bar-main';
import { useState } from 'react';
import { useAreaChartData } from '@/hooks/use-area-chart';
import { StatusActivityChart } from '@/features/components/dashboard/chart';

export default function DashboardMain() {
    const [days, setDays] = useState(0);
    const chartData = useAreaChartData('locations', days);

    return (
        <div className="p-6 space-y-6 text-slate-800">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart */}
                <div className="lg:col-span-2 bg-gray-100 p-4 rounded-xl min-h-300px flex flex-col">
                    {/* Header */}
                    <div className="mb-5">
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="text-sm text-gray-500">Welcome back! Here is what's happening with your map data today.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                            <h2 className="text-lg font-semibold text-gray-800">Map Performance</h2>

                            {/* Date Filter */}
                            <select
                                value={days}
                                onChange={(e) => setDays(Number(e.target.value))}
                                className="text-sm border-gray-200 border rounded-lg px-3 py-2 text-gray-500 hover:text-gray-700 focus:outline-none bg-white cursor-pointer"
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
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-1 bg-gray-100 p-4 rounded-xl">
                    <div className="grid grid-cols-1 gap-4">
                        <RadialSummaryGrid days={days} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Latest Locations */}
                <div className='bg-gray-100 p-4 lg:col-span-2 rounded-xl'>
                    <RecentLocationTable />
                </div>

                {/* Recent Logs */}
                <div className='bg-gray-100 p-4 rounded-xl'>
                    <RecentLog />
                </div>
            </div>
        </div>
    );
}