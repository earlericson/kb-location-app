"use client"

import { RecentLocationTable } from '@/features/components/dashboard/recent-location';
import { RadialStatBox } from '@/features/components/dashboard/radial-bar';
import { RecentLog } from '@/features/components/dashboard/recent-log';
import { ArrowRight, CheckCircle2, FileEdit } from 'lucide-react';
import { StatusActivityContainer } from '@/features/components/dashboard/chart-main';

export default function DashboardMain() {
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
                    {/* end */}
                    <StatusActivityContainer />
                </div>

                {/* Status */}
                <div className="grid grid-cols-1 md:grid-cols-1 bg-gray-100 p-4 rounded-xl">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                        <h3 className="font-bold text-[1.2rem]">Status</h3>
                        <a href="#" className="flex gap-2 items-center text-gray-400 hover:text-gray-700">View All<ArrowRight size={15} /></a>
                    </div>
                    {/* end */}
                    <div className="grid grid-cols-1 h-[420px] mt-5 gap-4">
                        <div className="flex flex-col ">
                            <RadialStatBox
                                label="Published"
                                status="published"
                                color="#10b981"
                                textColor="text-emerald-600"
                                icon={< CheckCircle2 size={30} />}
                            />
                        </div>
                        <div className="flex flex-col">
                            <RadialStatBox
                                label="Draft"
                                status="draft"
                                color="#f59e0b"
                                textColor="text-amber-600"
                                icon={<FileEdit size={30} />}
                            />
                        </div>
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