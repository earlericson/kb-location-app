import { useEffect, useRef } from 'react';
import { AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface DirectionsManagerProps {
    origin: google.maps.LatLngLiteral | null;
    destination: google.maps.LatLngLiteral | null;
}

export const DirectionsManager = ({ origin, destination }: DirectionsManagerProps) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');

    // We only need one ref to track whichever line (route or fallback) is active
    const activePolyline = useRef<google.maps.Polyline | null>(null);

    useEffect(() => {
        // Wait until the map and the routing library are fully loaded
        if (!routesLibrary || !map || !origin || !destination) return;

        // 1. Cleanup previous polyline before fetching a new one
        if (activePolyline.current) {
            activePolyline.current.setMap(null);
            activePolyline.current = null;
        }

        const fetchRoute = async () => {
            try {
                // Import the modern Routes library
                const { Route } = (await google.maps.importLibrary('routes')) as google.maps.RoutesLibrary;

                // Fully type-safe ComputeRoutesRequest request object
                const request: google.maps.routes.ComputeRoutesRequest = {
                    origin: {
                        location: origin, // Passed directly as LatLngLiteral
                    },
                    destination: {
                        location: destination, // Passed directly as LatLngLiteral
                    },
                    travelMode: 'DRIVING', // Correct enum string value
                    fields: ['path', 'viewport'], // Required field mask for the Routes API
                };

                const response = await Route.computeRoutes(request);

                if (response && response.routes && response.routes.length > 0) {
                    const route = response.routes[0];
                    
                    // Directly access the route's path coordinates requested via the field mask
                    const roadPath = route.path;

                    if (roadPath && roadPath.length > 0) {
                        activePolyline.current = new google.maps.Polyline({
                            path: roadPath, // Follows the exact road curves
                            strokeColor: '#ed1f24', // Tailwind red-500
                            strokeWeight: 4,
                            strokeOpacity: 0.8,
                            map: map,
                        });
                    } else {
                        triggerFallbackLine();
                        return;
                    }

                    // Automatically adjust camera viewport to fit the route geometry bounds
                    const viewport = route.viewport;
                    if (viewport) {
                        map.fitBounds(viewport, { top: 50, bottom: 50, left: 50, right: 50 });
                    }
                } else {
                    triggerFallbackLine();
                }
            } catch (error) {
                console.warn('Routes API failed, falling back to straight line:', error);
                triggerFallbackLine();
            }
        };

        const triggerFallbackLine = () => {
            activePolyline.current = new google.maps.Polyline({
                path: [origin, destination],
                geodesic: true,
                strokeColor: '#ed1f24',
                strokeWeight: 3,
                strokeOpacity: 0.8,
                map: map,
            });

            const bounds = new google.maps.LatLngBounds();
            bounds.extend(origin);
            bounds.extend(destination);
            map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
        };

        fetchRoute();

        // Cleanup on unmount or when origin/destination changes
        return () => {
            if (activePolyline.current) {
                activePolyline.current.setMap(null);
            }
        };
    }, [routesLibrary, map, origin, destination]);

    return (
        <>
            {/* User Marker: Only depends on origin */}
            {origin && (
                // <AdvancedMarker position={origin} zIndex={1000}>
                //     <Pin background="gray" glyphColor="white" borderColor="black" />
                // </AdvancedMarker>
                <AdvancedMarker
                    position={origin}
                >
                    <div className="relative flex flex-col items-center">
                        {/* The Video Container */}
                        <div className="relative flex items-center justify-center">
                            <video
                                src="https://firebasestorage.googleapis.com/v0/b/knockerball-map.firebasestorage.app/o/kblocations%2Fwalking-man.webm?alt=media&token=3ae7fba8-60a4-44ee-bd1a-9ec96fbaa7b7"
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-20 h-20 object-contain z-10"
                            />

                            {/* Radar Pulse Effect */}
                            <div className={`absolute -bottom-1 w-12 h-5 rounded-[50%] animate-ping pointer-events-none bg-gray-500`}></div>
                        </div>
                    </div>
                </AdvancedMarker>
            )}
        </>
    );
}