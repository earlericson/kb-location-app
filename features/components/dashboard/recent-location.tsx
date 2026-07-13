"use client";

import { STATUS_DISPLAY_MAP, STATUS_DISPLAY_MAP2, statusStyles } from "@/features/map/components/map-marker-color";
import { ActionMenu } from "./action-menu";
import { useRecentLocations } from "@/hooks/use-recent-location";
import TableImage from "../table/table-image";
import { formatDate } from "@/lib/time/date-formatter";

export const RecentLocationTable = () => {
    const locations = useRecentLocations(5);

    return (
        <div className=" bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex px-6 py-3 border-b border-gray-100 justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Latest Locations</h2>
                <ActionMenu
                    options={[
                        { label: 'View All', path: '/locations' }
                    ]}
                />
            </div>
            <div className="overflow-x-auto ">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm">
                            {/* <th className="px-6 py-4 font-semibold text-xs">Image</th> */}
                            <th className="px-6 py-5 font-semibold text-xs">Business Name</th>
                            <th className="px-6 py-5 font-semibold text-xs text-center">Status</th>
                            <th className="px-6 py-5 font-semibold text-xs text-right">Created</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {locations.map((loc) => {
                            const config = statusStyles[loc.status as keyof typeof statusStyles] || {
                                textBadge: 'bg-gray-50 text-gray-600 border-gray-200',
                                dot: 'bg-gray-400'
                            };
                            return (
                                <tr key={loc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                    {/* <td className="pl-6">
                                        <div className="flex w-8 h-8 rounded-md bg-slate-100 border border-slate-200 overflow-hidden items-center justify-center shrink-0">
                                            <TableImage
                                                src={loc.imageUrl}
                                                alt={loc.businessName}
                                            />
                                        </div>

                                    </td> */}
                                    <td className="flex px-6 py-4 items-center gap-4 font-medium text-xs">
                                        <div className="flex w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden items-center justify-center shrink-0">
                                            <TableImage
                                                src={loc.imageUrl}
                                                alt={loc.businessName}
                                            />
                                        </div>
                                        {loc.businessName}

                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.textBadge}`}>
                                            {/* Dot indicator */}
                                            <span className={`w-1.5 h-1.5 mr-1.5 rounded-full ${config.dot}`}></span>
                                            {loc.status !== 'draft'
                                                ? (STATUS_DISPLAY_MAP[loc.status] || loc.status)
                                                : (STATUS_DISPLAY_MAP2[loc.status] || loc.status)
                                            }
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-end whitespace-nowrap font-medium text-xs">
                                        {formatDate(loc.createdAt)}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}