"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { MapContainer } from "./map";
import { Search, MapPin, Phone, Mail } from "lucide-react";
import { BusinessLocation } from "@/types";
import { Map } from "@vis.gl/react-google-maps";

interface MapMainProps {
    initialData: BusinessLocation[]
}

export default function MapMain({ initialData }: MapMainProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<BusinessLocation | null>(null);

    // Filter businesses based on the search box
    const filteredBusinesses = useMemo(() => {
        return initialData.filter((b) =>
            b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.address?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, initialData]);


    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        // 1. Clear selection so the map doesn't "lock" to a pin
        setSelectedLocation(null);
        // 2. Update query
        setSearchQuery(e.target.value);
    }, []);


    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

    // Note: Advanced Markers require a Map ID from Google Cloud Console
    const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "DEMO_MAP_ID";

    // Default center (Kansas City, Missouri, USA)
    const defaultCenter = { lat: 39.100105, lng: -94.5781416 };
    const defaultZoom = 5;
    const minZoom = 4;
    const maxZoom = 20;
    const selectedZoom = 7;


    useEffect(() => {
        if (!mapInstance) return;

        // Case: Reset to default view when no location is selected
        if (!selectedLocation) {
            mapInstance.panTo(defaultCenter);
            mapInstance.setZoom(defaultZoom);
            return;
        }

        const { latitude: lat, longitude: lng } = selectedLocation;

        if (!isNaN(lat) && !isNaN(lng)) {
            // 1. Smoothly pan to the center
            mapInstance.panTo({ lat, lng });

            // 2. Animate the zoom level iteratively
            const targetZoom = selectedZoom;
            const targetPos = { lat, lng };

            // 1. Initial Pan to get the marker moving toward center
            mapInstance.panTo(targetPos);

            const animateZoom = () => {
                const currentZoom = mapInstance.getZoom();
                if (currentZoom !== undefined && currentZoom < targetZoom) {
                    // Increment zoom by a small amount for smoothness
                    mapInstance.setZoom(currentZoom + 1);

                    // Re-center during the zoom to prevent the marker from "drifting"
                    mapInstance.panTo(targetPos);

                    // Schedule next step if not at target
                    setTimeout(animateZoom, 60);
                }
            };

            // Start the zoom animation after the pan begins
            const timeoutId = setTimeout(animateZoom, 100);

            return () => clearTimeout(timeoutId);
        }
    }, [selectedLocation, mapInstance, defaultCenter, defaultZoom, selectedZoom]);




    return (
        // <div className="flex flex-col lg:flex-row h-[calc(100vh-80px)] w-full overflow-hidden bg-gray-50">

        <div className="flex h-screen w-full overflow-hidden bg-white">

            {/* LEFT COLUMN: Search & List */}
            <aside className="w-70 min-w-70 flex-none flex flex-col border-r border-gray-200 bg-white z-10 shadow-xl">

                {/* Search Header */}
                <div className="p-4 border-b border-gray-100">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search business or address..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ea4335] focus:border-transparent transition-all outline-none text-sm"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                        {filteredBusinesses.length} Locations Found
                    </p>
                </div>

                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {filteredBusinesses.length > 0 ? (
                        filteredBusinesses.map((loc) => {

                            // 1. Determine if this specific item is selected
                            const isActive = selectedLocation?.id === loc.id;

                            return (


                                <div
                                    key={loc.id}
                                    onClick={() => setSelectedLocation(loc)}
                                    className={`px-4 py-6 border-b-3 border-b-white hover:bg-indigo-50/50 cursor-pointer transition-colors group
                                        
                                        ${isActive
                                            ? "bg-indigo-50/50" // Active state
                                            : "bg-white hover:bg-indigo-50/50" // Normal state
                                        }
                                    `}
                                >
                                    <h3 className={`mb-2 text-[14px] font-bold group-hover:text-[#ea4335] transition-colors ${isActive ? "text-[#ea4335]" : "text-gray-900 "}`}>
                                        {loc.businessName}
                                    </h3>

                                    <div className="space-y-1">
                                        {/* Address */}
                                        <div className="flex items-start gap-2">
                                            <MapPin size={12} className="shrink-0 mt-0.5 font-bold text-gray-400" />
                                            <p className="text-[12px] text-gray-600 leading-snug">
                                                {loc.address}
                                            </p>
                                        </div>


                                        {/* Email */}
                                        {loc.email && (
                                            <div className="flex items-center gap-2">
                                                <Mail size={12} className="shrink-0 font-bold text-gray-400" />
                                                <a
                                                    href={`mailto:${loc.email}`}
                                                    className="text-[12px] text-gray-700 hover:text-[#ea4335] break-all transition-colors"
                                                >
                                                    {loc.email}
                                                </a>
                                            </div>
                                        )}

                                        {/* Phone */}
                                        {loc.phone && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={12} className="shrink-0 font-bold text-gray-400" />
                                                <a
                                                    href={`tel:${loc.phone}`}
                                                    className="text-[12px] text-gray-700 hover:text-[#ea4335] transition-colors"
                                                >
                                                    {loc.phone}
                                                </a>
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
            </aside>

            {/* RIGHT COLUMN: The Map */}
            <div className="flex-1 relative bg-gray-100">
                <Map
                    defaultCenter={defaultCenter}
                    defaultZoom={defaultZoom}
                    minZoom={minZoom}
                    maxZoom={maxZoom}
                    mapId={MAP_ID}
                    gestureHandling={"greedy"}
                    disableDefaultUI={true}
                    clickableIcons={false}
                    onIdle={(ev) => setMapInstance(ev.map)}
                    renderingType="VECTOR" // Forces the smoother engine
                    reuseMaps={true}
                >
                    {initialData.map((loc) => (
                        <MapContainer
                            key={loc.id}
                            businessloc={loc}
                            isSelected={selectedLocation?.id === loc.id}
                            onMarkerClick={setSelectedLocation}
                        />
                    ))}

                </Map>
            </div>
        </div>
    );
}