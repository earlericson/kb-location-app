import { MapPin, Phone, Mail, Car } from "lucide-react";
import { BusinessLocation } from "@/types";
import { getDistance } from "@/lib/map/distance";

interface BusinessListProps {
    businesses: BusinessLocation[];
    selectedId?: string;
    onSelect: (loc: BusinessLocation) => void;
    searchLoc?: { lat: number; lng: number } | null;
}

export const BusinessList = ({ businesses, selectedId, onSelect, searchLoc }: BusinessListProps) => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">

            {businesses.length > 0 ? (
                businesses.map((loc) => {


                    // 1. Logic inside the callback (This is NOT a component return)
                    const distance = searchLoc
                        ? getDistance(
                            searchLoc.lat,
                            searchLoc.lng,
                            Number(loc.latitude),
                            Number(loc.longitude)
                        )
                        : null;

                    // 2. The return for the .map() callback
                    return (
                        <div
                            key={loc.id}
                            onClick={() => onSelect(loc)}
                            className={`px-4 py-6 border-b-3 border-b-white cursor-pointer transition-colors ${selectedId === loc.id ? "bg-indigo-50/50" : "bg-white hover:bg-indigo-50/50"
                                }`}
                        >
                            <h3 className={`mb-2 text-[14px] font-bold ${selectedId === loc.id ? "text-[#ea4335]" : "text-gray-900"}`}>
                                {loc.businessName}
                            </h3>
                            <div className="space-y-1">
                                <div className="flex items-start gap-2">
                                    <MapPin size={12} className="shrink-0 mt-0.5 text-gray-400" />
                                    <p className="text-[12px] text-black leading-snug">{loc.address}</p>
                                </div>

                                {loc.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail size={12} className="text-gray-400" />
                                        <a href={`mailto:${loc.email}`} className="text-[12px] text-black hover:text-[#ea4335]">{loc.email}</a>
                                    </div>
                                )}

                                {loc.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={12} className="shrink-0 font-bold text-gray-400" />
                                        <a
                                            href={`tel:${loc.phone}`}
                                            className="text-[12px] text-black hover:text-[#ea4335] transition-colors"
                                        >
                                            {loc.phone}
                                        </a>
                                    </div>
                                )}

                                {/* Distance Label */}
                                {distance !== null && (
                                    <div className="flex items-center gap-2">
                                        <Car size={12} className="shrink-0 font-bold text-gray-400" />
                                        <span className="text-xs font-bold text-[#ea4335] mt-1 block">
                                            {distance.toFixed(1)} miles away
                                        </span>
                                    </div>
                                )}

                            </div>
                        </div>
                    )
                })
            ) : (
                <div className="p-10 text-center text-gray-400 text-sm">
                    No locations match your search.
                </div>
            )}
        </div>
    )
};