import { useEffect, useRef, useState } from 'react';
import { useMap, useMapsLibrary, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { User } from 'lucide-react';

type LatLng = google.maps.LatLng | google.maps.LatLngLiteral;

interface DirectionsManagerProps {
    origin: LatLng | null;
    destination: LatLng | null;
}

export const DirectionsManager = ({ origin, destination }: DirectionsManagerProps) => {
    const map = useMap();
    const routesLibrary = useMapsLibrary('routes');
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);

    // Ref to track the manual polyline for clean-up
    const manualPolylineRef = useRef<google.maps.Polyline | null>(null);

    useEffect(() => {
        if (!routesLibrary || !map) return;

        const service = new routesLibrary.DirectionsService();
        const renderer = new routesLibrary.DirectionsRenderer({
            map,
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#ed1f24', // Tailwind red-500
                strokeWeight: 3,
                strokeOpacity: 0.8,
            }
        });

        setDirectionsService(service);
        setDirectionsRenderer(renderer);

        return () => {
            renderer.setMap(null);
            if (manualPolylineRef.current) manualPolylineRef.current.setMap(null);
        };
    }, [routesLibrary, map]);

    useEffect(() => {
        // 1. Always clean up previous visuals first
        if (directionsRenderer) directionsRenderer.setMap(null);
        if (manualPolylineRef.current) {
            manualPolylineRef.current.setMap(null);
            manualPolylineRef.current = null;
        }

        if (!directionsService || !directionsRenderer || !origin || !destination || !map) return;

        // 2. Attempt standard driving route
        directionsService.route(
            {
                origin,
                destination,
                travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === 'OK') {
                    directionsRenderer.setMap(map);
                    directionsRenderer.setDirections(result);
                } else if (status === google.maps.DirectionsStatus.ZERO_RESULTS) {
                    // 3. Fallback: Draw straight geodesic line
                    manualPolylineRef.current = new google.maps.Polyline({
                        path: [origin, destination],
                        geodesic: true,
                        strokeColor: '#ed1f24',
                        strokeWeight: 3,
                        strokeOpacity: 0.8,
                        map: map,
                    });

                    // 4. Adjust camera to fit both points
                    const bounds = new google.maps.LatLngBounds();
                    bounds.extend(origin);
                    bounds.extend(destination);
                    map.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
                } else {
                    console.error(`Directions request failed: ${status}`);
                }
            }
        );
    }, [directionsService, directionsRenderer, origin, destination, map]);

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