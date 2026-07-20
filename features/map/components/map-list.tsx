import { MapPin, Phone, Mail, Car, ArrowUpRight, CornerUpRight } from "lucide-react";
import { BusinessLocation } from "@/types";
import { getDistance } from "@/lib/map/distance";

interface BusinessListProps {
    businesses: BusinessLocation[];
    selectedId?: string;
    onSelect: (loc: BusinessLocation) => void;
    searchLoc?: { lat: number; lng: number } | null;
    onGetDirections: (loc: BusinessLocation) => void;
    onClearDirections: () => void;
    activeDirectionId?: string;
}

export const BusinessList = ({ businesses, selectedId, onSelect, searchLoc, onGetDirections, onClearDirections, activeDirectionId }: BusinessListProps) => {
    return (
        <div className="flex-1 overflow-y-auto custom-scrollbar">

            {businesses.length > 0 ? (
                businesses.map((loc, index) => {


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
                            // onClick={() => onSelect(loc)}
                            onClick={() => {
                                onSelect(loc);              // Shows the InfoWindow
                                onClearDirections();        // Hides the roadmap
                            }}
                            className={`px-4 py-6 border-b-3 border-b-white cursor-pointer transition-colors ${(selectedId === loc.id || activeDirectionId === loc.id) ? "bg-indigo-50/50" : "bg-white hover:bg-indigo-50/50"
                                }`}
                        >
                            <h3 className={`mb-2 text-[14px] font-bold text-gray-900`}>
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
                                        <a href={`mailto:${loc.email}`} className="text-[12px] text-black hover:text-[#ed1f24]">{loc.email}</a>
                                    </div>
                                )}

                                {loc.phone && (
                                    <div className="flex items-center gap-2">
                                        <Phone size={12} className="shrink-0 font-bold text-gray-400" />
                                        <a
                                            href={`tel:${loc.phone}`}
                                            className="text-[12px] text-black hover:text-[#ed1f24] transition-colors"
                                        >
                                            {loc.phone}
                                        </a>
                                    </div>
                                )}

                                {/* Distance Label */}
                                {distance !== null && (
                                    <div className="flex items-center gap-2">
                                        <Car size={12} className="shrink-0 font-bold text-gray-400" />
                                        <span className="text-xs font-bold text-[#ed1f24] mt-1 block">
                                            {distance.toFixed(1)} miles away
                                        </span>
                                    </div>
                                )}

                                {/* Only show "Get Directions" for the first 5 results (index 0-4) */}
                                {distance !== null && index < 5 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevents triggering the card's onClick
                                            onGetDirections(loc); // Call your direction handler
                                        }}
                                        className={`flex items-center gap-1 px-3 py-1.5 mt-3 text-[11px] font-semibold text-white hover:bg-[#ed1f24] rounded-lg shadow-md shadow-gray-300 ${(activeDirectionId === loc.id) ? "bg-[#ed1f24]" : "bg-black"
                                            }`}
                                    >
                                        <CornerUpRight size={12} />
                                        Direction
                                    </button>
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