"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { MapContainer } from "./map";
import { BusinessLocation } from "@/types";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { BusinessList } from "./components/map-list";
import { getDistance } from "@/lib/map/distance";
import { PlaceAutocomplete } from "./components/place-auto-complete";

export default function MapMain({ initialData }: { initialData: BusinessLocation[] }) {
    // const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<BusinessLocation | null>(null);

    const [searchLoc, setSearchLoc] = useState<{ lat: number, lng: number } | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Filter businesses based on the search box
    // const filteredBusinesses = useMemo(() => {
    //     return initialData.filter((b) =>
    //         b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         b.address?.toLowerCase().includes(searchQuery.toLowerCase())
    //     );
    // }, [searchQuery, initialData]);


    const filteredBusinesses = useMemo(() => {
        // 1. If no place selected, return all locations
        if (!isSearching || !searchLoc) return initialData;

        // 2. Sort all businesses by distance from the selected coordinates
        const sorted = [...initialData].sort((a, b) => {
            const distA = getDistance(searchLoc.lat, searchLoc.lng, Number(a.latitude), Number(a.longitude));
            const distB = getDistance(searchLoc.lat, searchLoc.lng, Number(b.latitude), Number(b.longitude));
            return distA - distB;
        });

        // 3. Limit to the top 5
        return sorted.slice(0, 5);
    }, [isSearching, searchLoc, initialData]);



    // const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    //     // 1. Clear selection so the map doesn't "lock" to a pin
    //     setSelectedLocation(null);
    //     // 2. Update query
    //     setSearchQuery(e.target.value);
    // }, []);


    const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

    // Note: Advanced Markers require a Map ID from Google Cloud Console
    const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "DEMO_MAP_ID";

    // Default center (Kansas City, Missouri, USA)
    const defaultCenter = { lat: 39.100105, lng: -94.5781416 };
    const defaultZoom = 5;
    const minZoom = 4;
    const maxZoom = 20;
    const selectedZoom = 7;

    // Define the absolute bounds for North and South America
    const AMERICAS_BOUNDS = {
        north: 85,
        south: -60,
        west: -170,
        east: -30,
    };

    // Pull the data request in browser local storage on new window mount
    useEffect(() => {
        const storedItem = localStorage.getItem("selectedMapLocation");
        if (storedItem) {
            try {
                const parsedLocation = JSON.parse(storedItem) as BusinessLocation;
                setSelectedLocation(parsedLocation);
            } catch (error) {
                console.error("Failed to parse stored map coordinate:", error);
            } finally {
                // Clean up the storage key so refreshing the map tab later returns to normal
                localStorage.removeItem("selectedMapLocation");
            }
        }
    }, []);

    // useEffect(() => {
    //     if (!mapInstance) return;

    //     // Case: Reset to default view when no location is selected
    //     if (!selectedLocation) {
    //         mapInstance.panTo(defaultCenter);
    //         mapInstance.setZoom(defaultZoom);
    //         return;
    //     }

    //     const { latitude: lat, longitude: lng } = selectedLocation;

    //     if (isNaN(lat) || isNaN(lng)) return;

    //     const targetPos = { lat, lng };
    //     const targetZoom = selectedZoom; // Fallback safely to a clean zoom level

    //     // Function that executes the zoom steps securely
    //     const runZoomAnimation = () => {
    //         // 1. Instantly drop anchor directly over the coordinates
    //         mapInstance.panTo(targetPos);

    //         const animateStep = () => {
    //             const currentZoom = mapInstance.getZoom();
    //             if (currentZoom !== undefined && currentZoom < targetZoom) {
    //                 // Increment cleanly
    //                 mapInstance.setZoom(currentZoom + 1);
    //                 // Keep locked to center so boundaries don't deflect the pin
    //                 mapInstance.panTo(targetPos);

    //                 setTimeout(animateStep, 40); // 40ms gives restriction engine time to breathe
    //             }
    //         };

    //         // Fire the incremental zoom sequence after primary panning completes
    //         setTimeout(animateStep, 100);
    //     };

    //     // Wait for Google Maps to finish initializing bounds before moving
    //     if (mapInstance.getBounds()) {
    //         runZoomAnimation();
    //     } else {
    //         // If map is still loading, wait for the 'idle' status listener to signal safety
    //         const listener = mapInstance.addListener("idle", () => {
    //             runZoomAnimation();
    //             google.maps.event.removeListener(listener); // Clean up immediately
    //         });
    //         return () => google.maps.event.removeListener(listener);
    //     }

    // }, [selectedLocation, mapInstance, defaultCenter, defaultZoom, selectedZoom]);


    // /**
    //  * MAP CAMERA COORDINATOR
    //  * Purpose: Ensures the map camera centers and zooms on the user's selected 
    //  * autocomplete location. Automatically triggers whenever searchLoc changes.
    //  */
    // useEffect(() => {
    //     // Check if we have the map and a new location
    //     if (mapInstance && searchLoc) {
    //         // Smoothly pan to the selected autocomplete location
    //         mapInstance.panTo(searchLoc);

    //         // Set a zoom level appropriate for looking at nearby businesses
    //         mapInstance.setZoom(7);
    //     }
    // }, [mapInstance, searchLoc]);



    useEffect(() => {
        if (!mapInstance) return;

        // 1. CLEAR STATE: If both search and selection are empty, reset to default
        if (!searchLoc && !selectedLocation) {
            mapInstance.panTo(defaultCenter);
            mapInstance.setZoom(defaultZoom);
            return;
        }

        // 2. Determine target coordinates
        // Prioritize selectedLocation (InfoWindow) over searchLoc (Autocomplete)
        const target = selectedLocation
            ? { lat: Number(selectedLocation.latitude), lng: Number(selectedLocation.longitude) }
            : searchLoc;

        if (!target || isNaN(target.lat) || isNaN(target.lng)) return;

        // 3. Cinematic Movement
        // Use panTo for smooth movement.
        // with Google's internal animation engine.
        mapInstance.panTo(target);
        mapInstance.setZoom(selectedLocation ? selectedZoom : 7);

    }, [mapInstance, searchLoc, selectedLocation, defaultCenter, defaultZoom, selectedZoom]);

    return (
        <div className="flex h-screen w-full overflow-hidden bg-white">

            {/* LEFT COLUMN: Search & List */}
            <aside className="w-70 flex-none flex flex-col bg-white z-10 shadow-xl">
                {/* <SearchBar
                    query={searchQuery}
                    onChange={handleSearchChange}
                    count={filteredBusinesses.length}
                /> */}

                <PlaceAutocomplete
                    onPlaceSelect={(loc) => {
                        setSearchLoc(loc);
                        setIsSearching(!!loc);

                        // Reset the selected popup when searching a new location
                        setSelectedLocation(null);
                    }}
                    onInputChange={(val) => {
                        if (!val)
                            setIsSearching(false);
                        // You might also want to close it here if the search is cleared
                        setSelectedLocation(null);
                    }}
                    count={filteredBusinesses.length}
                />

                <BusinessList
                    businesses={filteredBusinesses}
                    selectedId={selectedLocation?.id}
                    onSelect={setSelectedLocation}
                    searchLoc={searchLoc} // Pass this down!
                />
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

                    // 2. Apply the restriction boundaries
                    restriction={{
                        latLngBounds: AMERICAS_BOUNDS,
                        strictBounds: true, // Prevents users from dragging even a little bit outside the box
                    }}
                >

                    {/* <MapCameraController center={searchLoc} map={mapInstance} /> */}

                    {/* Render ONLY the filtered list to keep the map clean */}
                    {filteredBusinesses.map((b) => (
                        <MapContainer
                            key={b.id}
                            businessloc={b}
                            isSelected={selectedLocation?.id === b.id}
                            onMarkerClick={setSelectedLocation}
                        />
                    ))}
                </Map>
            </div>
        </div>
    );
}