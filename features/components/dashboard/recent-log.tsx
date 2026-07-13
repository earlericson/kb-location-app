"use client";

import { ActionMenu } from './action-menu';
import { Clock, UserCircle } from 'lucide-react';
import { useRecentLogs } from '@/hooks/use-recent-log';
import { timeAgo } from '@/lib/time/time-ago';


export const RecentLog = () => {
    const logs = useRecentLogs(5);

    return (
        <div className="bg-white px-6 py-3 rounded-xl border border-gray-100 shadow-sm h-full">
            <div className='flex border-b border-gray-100 justify-between'>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Recent Logs</h2>
                <ActionMenu
                    options={[
                        { label: 'View All', path: '/logs' }
                    ]}
                />
            </div>
            <div className="mt-4">
                {logs.map((log) => (
                    // <div key={log.id} className="flex border-gray-50  pb-5 last:pb-0 relative justify-between group">
                    //     <div className='flex gap-2'>
                    //         <UserCircle className="text-gray-400" />
                    //         <div className='flex flex-col'>
                    //             <span className="text-xs font-semibold text-gray-700">{log.businessName}</span>
                    //             <span className="text-xs font-light text-gray-400 italic">{log.message}</span>
                    //             {/* <span className="text-xs text-gray-400">Admin</span> */}
                    //         </div>
                    //     </div>
                    //     <div className="text-[10px] text-gray-400 mt-1">
                    //         <span>{timeAgo(log.timestamp)}</span>
                    //     </div>
                    //     <div className='absolute bottom-0.5 left-2.5 w-0 h-7 border-l border-gray-300 group-last:hidden' />
                    // </div>

                    // <div key={log.id} className="flex border-gray-50 pb-5 last:pb-0 relative gap-4">
                    //     <div className='flex gap-2 min-w-0'> {/* min-w-0 prevents this from pushing content out */}
                    //         <UserCircle className="text-gray-400 shrink-0" /> {/* shrink-0 keeps the icon consistent */}
                    //         <div className='flex flex-col min-w-0'>
                    //             <span className="text-xs font-semibold text-gray-700 truncate">{log.businessName}</span>
                    //             <span className="text-xs font-light text-gray-400 italic wrap-break-word">{log.message}</span>
                    //             <div className="flex mt-2 text-[10px] text-gray-400 shrink-0 gap-1 px-1.5 py-0.5 border border-gray-100 rounded-2xl bg-gray-50"> {/* shrink-0 keeps the time stable */}
                    //                 <Clock size={10} className='mt-0.5' />
                    //                 <span>{timeAgo(log.timestamp)}</span>
                    //             </div>
                    //         </div>

                    //     </div>

                    //     <div className='absolute bottom-0.5 left-2.5 w-0 h-7 border-l border-gray-300 group-last:hidden' />
                    // </div>


                    <div key={log.id} className="flex border-gray-50 pb-3.5 last:pb-0 relative gap-4">
                        <div className='flex gap-2 min-w-0'>
                            <UserCircle size={30} className="text-gray-400 shrink-0 p-1 z-10 bg-white rounded-full" />
                            <div className='flex flex-col min-w-0'>
                                <span className="text-xs font-semibold text-gray-700 truncate">{log.businessName}</span>
                                <span className="text-xs font-light text-gray-400 italic wrap-break-word">{log.message}</span>

                                {/* ADDED self-start TO PREVENT STRETCHING */}
                                <div className="flex mt-1 text-[10px] text-gray-400 shrink-0 gap-1 px-1.5 border border-gray-100 rounded-2xl bg-gray-50 self-start">
                                    <Clock size={10} className='mt-0.5' />
                                    <span>{timeAgo(log.timestamp)}</span>
                                </div>
                            </div>
                        </div>
                        <div className='absolute top-1 bottom-0.5 left-3.5 w-0 h-full border-l border-gray-300 group-last:hidden' />
                    </div>




                ))}
            </div>
        </div>
    )
}
