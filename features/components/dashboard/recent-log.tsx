"use client";

import { ActionMenu } from './action-menu';
import { UserCircle } from 'lucide-react';
import { useRecentLogs } from '@/hooks/use-recent-log';


export const RecentLog = () => {
    const logs = useRecentLogs(5);

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-full">
            <div className='flex border-b border-gray-100 pb-2 justify-between'>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Logs</h2>
                <ActionMenu
                    options={[
                        { label: 'View All', path: '/dashboard/recent-logs' }
                    ]}
                />
            </div>
            <div className="mt-4">
                {logs.map((log) => (
                    <div key={log.id} className="flex border-gray-50  pb-5 last:pb-0 relative justify-between group">
                        <div className='flex gap-2'>
                            <UserCircle className="text-gray-400" />
                            <div className='flex flex-col'>
                                <span className="text-xs font-medium italic text-gray-700">{log.action}</span>
                                <span className="text-sm font-medium text-gray-700">{log.businessName}</span>
                                {/* <span className="text-xs text-gray-400">Admin</span> */}
                            </div>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                            <span>{log.timestamp.toLocaleString()}</span>
                        </div>
                        <div className='absolute bottom-0.5 left-2.5 w-0 h-7 border-l border-gray-300 group-last:hidden' />
                    </div>
                ))}
            </div>
        </div>
    )
}
