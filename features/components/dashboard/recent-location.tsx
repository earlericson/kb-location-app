"use client";

import { RecentLocationData } from "@/types";
import { ActionMenu } from "./action-menu";
import { useRecentLocations } from "@/hooks/use-recent-location";



export const RecentLocationTable = () => {
    const locations = useRecentLocations(5);

    return (
        <div className=" bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex p-6 border-b border-gray-100 justify-between">
                <h2 className="text-lg font-semibold text-gray-800">Latest Locations</h2>
                <ActionMenu
                    options={[
                        { label: 'View All', path: '/dashboard/locations' }
                    ]}
                />
            </div>
            <div className="overflow-x-auto ">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-sm">
                            <th className="px-6 py-4 font-semibold">Business Name</th>
                            <th className="px-6 py-4 font-semibold">Coordinates</th>
                            <th className="px-6 py-4 font-semibold text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-700">
                        {locations.map((loc) => (
                            <tr key={loc.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium"><label className="text-xs">{loc.businessName}</label></td>
                                <td className="flex flex-1 px-6 py-4 text-gray-500 gap-4">
                                    <label className="text-xs"><span className="text-[10px] font-mono">Lat:</span> {loc.latitude}</label>
                                    <label className="text-xs"><span className="text-[10px] font-mono">Lng:</span> {loc.longitude}</label>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${loc.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {loc.status.charAt(0).toUpperCase() + loc.status.slice(1)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
