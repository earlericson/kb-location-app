"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { MapContainer } from "./map";
import { BusinessLocation } from "@/types";
import { AdvancedMarker, Map } from "@vis.gl/react-google-maps";
import { BusinessList } from "./components/map-list";
import { getDistance } from "@/lib/map/distance";
import { PlaceAutocomplete } from "./components/place-auto-complete";
import { DirectionsManager } from "./directions-manager";
import { StatusFilterDropdown } from "../components/global/status-filter-bar";
import { ChevronLeft, Menu } from "lucide-react";

type statusFilter = BusinessLocation["status"] | "All";


export default function MapMain({ initialData }: { initialData: BusinessLocation[] }) {
    // const [searchQuery, setSearchQuery] = useState("");
    const [selectedLocation, setSelectedLocation] = useState<BusinessLocation | null>(null);

    const [searchLoc, setSearchLoc] = useState<{ lat: number, lng: number } | null>(null);
    // const [isSearching, setIsSearching] = useState(false);
    const [directionDestination, setDirectionDestination] = useState<google.maps.LatLngLiteral | null>(null);
    const [activeDirectionId, setActiveDirectionId] = useState<BusinessLocation | null>(null);
    const [origin, setOrigin] = useState<{ lat: number; lng: number } | null>(null);

    const [selectedStatuses, setSelectedStatuses] = useState<statusFilter[]>(['All']);

    const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
    // Filter businesses based on the search box
    // const filteredBusinesses = useMemo(() => {
    //     return initialData.filter((b) =>
    //         b.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    //         b.address?.toLowerCase().includes(searchQuery.toLowerCase())
    //     );
    // }, [searchQuery, initialData]);


    // const filteredBusinesses = useMemo(() => {
    //     // 1. If no place selected, return all locations
    //     if (!isSearching || !searchLoc) return initialData;

    //     // 2. Sort all businesses by distance from the selected coordinates
    //     const sorted = [...initialData].sort((a, b) => {
    //         const distA = getDistance(searchLoc.lat, searchLoc.lng, Number(a.latitude), Number(a.longitude));
    //         const distB = getDistance(searchLoc.lat, searchLoc.lng, Number(b.latitude), Number(b.longitude));
    //         return distA - distB;
    //     });

    //     // 3. Limit to the top 5
    //     return sorted.slice(0, 5);
    // }, [isSearching, searchLoc, initialData]);
    // 1. Unified filtering and proximity sorting memo
    const filteredBusinesses = useMemo(() => {
        let results = initialData.filter(b =>
            selectedStatuses.includes('All') || selectedStatuses.includes(b.status)
        );

        // If searchLoc coordinates are active, sort by proximity and take top 5
        if (searchLoc) {
            results = results.sort((a, b) => {
                const distA = getDistance(searchLoc.lat, searchLoc.lng, Number(a.latitude), Number(a.longitude));
                const distB = getDistance(searchLoc.lat, searchLoc.lng, Number(b.latitude), Number(b.longitude));
                return distA - distB;
            }).slice(0, 5);
        }

        return results;
    }, [searchLoc, initialData, selectedStatuses]);



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
    const defaultZoom = 4.5;
    const minZoom = 4;
    const maxZoom = 20;
    const selectedZoom = 7;

    // Define the absolute bounds for North and South America
    // const AMERICAS_BOUNDS = {
    //     north: 85,
    //     south: -60,
    //     west: -170,
    //     east: -30,
    // };

    const USA_BOUNDS = {
        north: 72.0,  // Captures the northernmost point of Alaska
        south: 18.9,  // Captures the southernmost point of Hawaii
        west: -179.0, // Extends far west to include Hawaii
        east: -66.0,  // Stays tight to the eastern coast of the contiguous U.S.
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
            mapInstance.setOptions({ restriction: { latLngBounds: USA_BOUNDS, strictBounds: true } });
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

        // This allows the animation to reach targets near the boundary
        mapInstance.setOptions({ restriction: null });

        // 3. Cinematic Movement
        // Use panTo for smooth movement.
        // with Google's internal animation engine.
        mapInstance.panTo(target);
        mapInstance.setZoom(selectedLocation ? selectedZoom : 7);

    }, [mapInstance, searchLoc, selectedLocation, defaultCenter, defaultZoom, selectedZoom]);


    // This is the function that orchestrates the UI state
    const handleStatusChange = (newStatuses: statusFilter[]) => {
        setSelectedStatuses(newStatuses);

        // Close InfoWindow if user is NOT in "All" mode
        if (!newStatuses.includes('All')) {
            setSelectedLocation(null);
            setDirectionDestination(null);
            setActiveDirectionId(null);
        }
    };

    const handleReset = () => {
        // Reset the filter state to default (e.g., 'All')
        setSelectedStatuses(['All']);

        // The new requirement: explicitly close the InfoWindow
        setSelectedLocation(null);

        // Remove the map direction polyline
        setDirectionDestination(null);

        // Reset selected active direction
        setActiveDirectionId(null);
    };


    return (
        <div className="relative flex flex-col md:flex-row h-screen w-full overflow-hidden bg-white">

            {/* Mobile/Tablet Drawer Toggle Button (Visible only on smaller screens) */}
            {!isDrawerOpen && (
                <button
                    onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                    className="absolute top-4 left-4 z-50 md:hidden bg-white p-2.5 rounded-lg shadow-md text-slate-700 hover:bg-slate-50 transition-colors"
                    aria-label="Toggle Business Directory"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* LEFT COLUMN: Search & List */}
            <aside
                // className="w-70 flex-none flex flex-col bg-white z-10 shadow-xl"
                className={`absolute md:relative z-40 h-full bg-white shadow-xl md:shadow-none transition-transform duration-300 ease-in-out flex flex-col w-1/3 min-w-70 max-w-md md:max-w-none
                ${isDrawerOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
            >
                {/* Floating Close Button: Centered vertically on the right border, mobile only */}

                {isDrawerOpen && (
                    <button
                        onClick={() => setIsDrawerOpen(false)}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 z-50 md:hidden bg-white text-slate-700 p-2 rounded-full shadow-lg border border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-all"
                        aria-label="Close Drawer"
                    >
                        <ChevronLeft size={18} />
                    </button>
                )}
                {/* <SearchBar
                    query={searchQuery}
                    onChange={handleSearchChange}
                    count={filteredBusinesses.length}
                /> */}
                <div className="border-b border-gray-100 p-4 pb-2">
                    <div className="flex items-center gap-3 pb-2 w-full">
                        <div className="flex-1 min-w-0">
                            <PlaceAutocomplete
                                onPlaceSelect={(loc) => {
                                    setSearchLoc(loc);
                                    // setIsSearching(!!loc);

                                    // Reset the selected popup when searching a new location
                                    setSelectedLocation(null);
                                    // Reset the road map when searching a new location
                                    setDirectionDestination(null);
                                    // Reset selected active direction
                                    setActiveDirectionId(null);

                                    if (loc) {
                                        setOrigin({ lat: loc.lat, lng: loc.lng });
                                    } else {
                                        // Optional: reset origin if the user clears the input
                                        setOrigin(null);
                                        // setIsSearching(false);
                                    }
                                }}
                                onInputChange={(val) => {
                                    if (!val) {
                                        setSearchLoc(null);
                                    }
                                    // setIsSearching(false);
                                    // You might also want to close it here if the search is cleared
                                    setSelectedLocation(null);
                                    setDirectionDestination(null);
                                    setActiveDirectionId(null);
                                    setOrigin(null);
                                }}
                            // count={filteredBusinesses.length}
                            // isSearching={isSearching}
                            />
                        </div>
                        <div className="shrink-0">
                            <StatusFilterDropdown
                                selectedStatuses={selectedStatuses}
                                onStatusChange={handleStatusChange}
                                onReset={handleReset}
                            />
                        </div>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
                        {searchLoc
                            ? `${filteredBusinesses.length} nearest ${filteredBusinesses.length === 1 ? 'location' : 'locations'} found`
                            : `${filteredBusinesses.length} ${filteredBusinesses.length === 1 ? 'Location' : 'Locations'} Found`
                        }
                    </p>
                </div>

                <BusinessList
                    businesses={filteredBusinesses}
                    selectedId={selectedLocation?.id}
                    activeDirectionId={activeDirectionId?.id}
                    // onSelect={setSelectedLocation}
                    searchLoc={searchLoc} // Pass this down!
                    onSelect={(loc) => {
                        setSelectedLocation(loc);
                        setDirectionDestination(null); // Hide roadmap when selecting from list
                        setActiveDirectionId(null);
                        setIsDrawerOpen(false);
                    }}
                    onGetDirections={(loc) => {
                        setDirectionDestination({
                            lat: Number(loc.latitude),
                            lng: Number(loc.longitude)
                        });
                        setActiveDirectionId(loc);
                        // Close the InfoWindow
                        setSelectedLocation(null);
                        // Close the Sidebar Drawer
                        setIsDrawerOpen(false);
                    }}
                    onClearDirections={() => {
                        setDirectionDestination(null);
                        setActiveDirectionId(null);
                    }}
                />
            </aside>

            {/* Backdrop overlay for mobile when drawer is open */}
            {isDrawerOpen && (
                <div
                    onClick={() => setIsDrawerOpen(false)}
                    className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs md:hidden transition-opacity"

                />
            )}

            {/* RIGHT COLUMN: The Map */}
            {/* Main Map Section (Auto-fits remaining width & height) */}
            <div className="flex grow h-full w-full relative bg-gray-100">
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
                        latLngBounds: USA_BOUNDS,
                        strictBounds: true, // Prevents users from dragging even a little bit outside the box
                    }}
                >

                    {/* <MapCameraController center={searchLoc} map={mapInstance} /> */}

                    {/* Render the Route if a destination is selected */}
                    <DirectionsManager
                        origin={origin} // Origin is the autocomplete search result
                        destination={directionDestination}
                    />

                    {/* Render ONLY the filtered list to keep the map clean */}
                    {filteredBusinesses.map((b) => (
                        <MapContainer
                            key={b.id}
                            businessloc={b}
                            // isSelected={selectedLocation?.id === b.id}
                            // onMarkerClick={setSelectedLocation}

                            // Only show "selected" state if no direction is active
                            isSelected={!directionDestination && selectedLocation?.id === b.id}
                            onMarkerClick={(loc) => {
                                // If directions are active, clicking a marker clears them 
                                // and selects the new location
                                if (directionDestination) {
                                    setDirectionDestination(null);
                                    setActiveDirectionId(null);
                                }
                                setSelectedLocation(loc);
                            }}
                        />
                    ))}
                </Map>
            </div>
        </div>
    );
}