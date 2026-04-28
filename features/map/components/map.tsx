"use client";

import React, { useEffect, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow
} from "@vis.gl/react-google-maps";
import { BusinessLocation } from "@/types";
import { Globe, MapPin, Phone, Mail, ExternalLink, User } from "lucide-react";

interface MapProps {
  businessloc: BusinessLocation[];
  selectedLocation: BusinessLocation | null;
  onMarkerClick: (b: BusinessLocation | null) => void;
}

export const MapContainer = ({ businessloc, selectedLocation, onMarkerClick }: MapProps) => {

  // Use your env variable for the API Key
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  // Note: Advanced Markers require a Map ID from Google Cloud Console
  const MAP_ID = process.env.NEXT_PUBLIC_GOOGLE_MAPS_ID || "DEMO_MAP_ID";


  // Default center (Kansas City, Missouri, USA)
  const defaultCenter = { lat: 39.100105, lng: -94.5781416 };
  const defaultZoom = 5;
  const minZoom = 4;
  const maxZoom = 20;
  const selectedZoom = 15;


  // Move infoWindow
  const infoWindowOffset: [number, number] = [0, -53];


  // Create a local state to hold the map instance
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  // This effect runs whenever the selectedLocation OR the mapInstance changes
  useEffect(() => {
    if (!mapInstance || !selectedLocation) {
      // Optional: Reset to default view when nothing is selected
      if (mapInstance) {
        mapInstance.panTo(defaultCenter);
        mapInstance.setZoom(defaultZoom);
      }
      return;
    }

    const lat = selectedLocation.latitude;
    const lng = selectedLocation.longitude;

    if (!isNaN(lat) && !isNaN(lng)) {
      console.log("Map is ready! Panning to:", lat, lng);
      mapInstance.panTo({ lat, lng });
      mapInstance.setZoom(selectedZoom);
    }
  }, [selectedLocation, mapInstance]);



  const handleContentUrl = (e: React.MouseEvent, url: string) => {
    // 1. Prevent the map from reacting to the click
    e.stopPropagation();

    // 2. Validation: If no URL, stop here
    if (!url) return;

    // 3. Formatting: Ensure it has a protocol
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;

    // 4. Execution: Open in new tab
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };


  return (
    <div className="w-full h-full overflow-hidden shadow-md border border-gray-200">
      <APIProvider apiKey={API_KEY} libraries={['marker']}>
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
        >
          {businessloc.map((loc) => {
            // Ensure we have coordinates before trying to render a marker
            if (!loc.latitude || !loc.longitude) return null;

            return (
              <React.Fragment key={loc.id}>
                <AdvancedMarker
                  position={{ lat: loc.latitude, lng: loc.longitude }}
                  onClick={() => onMarkerClick(loc)} // Ensure this is fired
                >
                  {/* Custom Styled Pin matching your dashboard theme */}
                  <Pin
                    background={selectedLocation?.id === loc.id ? "#ea4335" : "#ea4335"}
                    scale={selectedLocation?.id === loc.id ? 1.3 : 1}
                    borderColor={"#b31412"}
                    glyphColor={"#b31412"}
                  // scale={1.1}
                  />
                </AdvancedMarker>

                {/* Show details when the marker is clicked */}
                {selectedLocation?.id === loc.id && (
                  <InfoWindow
                    position={{ lat: loc.latitude, lng: loc.longitude }}
                    onCloseClick={() => onMarkerClick(null)}
                    pixelOffset={infoWindowOffset}
                  >
                    <div className="p-2 w-70">

                      {/* Location Image */}
                      {loc.imageUrl ? (
                        <div className="w-full h-35 overflow-hidden bg-gray-100 mb-5">
                          <img
                            src={loc.imageUrl}
                            alt={loc.businessName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        // Fallback if no image exists
                        <div className="w-full h-12 bg-[#ea4335]/5 mb-2" />
                      )}


                      {/* Location Name */}
                      <h4 className="font-bold text-base text-[#ea4335] leading-tight mb-3">
                        {loc.businessName}
                      </h4>

                      <div className="space-y-2">

                        {/* Business Owner */}
                        {loc.businessOwner && (
                          <div className="flex items-center gap-2">
                            <User size={12} className="shrink-0 font-bold text-gray-400" />
                            <p className="text-[14px] text-gray-600 leading-snug">
                              {loc.businessOwner}
                            </p>
                          </div>
                        )}

                        {/* Address */}
                        {loc.address && (
                          <div className="flex items-start gap-2">
                            <MapPin size={12} className="shrink-0 mt-0.5 font-bold text-gray-400" />
                            <p className="text-[14px] text-gray-600 leading-snug">
                              {loc.address}
                            </p>
                          </div>
                        )}

                        {/* Email */}
                        {loc.email && (
                          <div className="flex items-center gap-2">
                            <Mail size={12} className="shrink-0 font-bold text-gray-400" />
                            <a
                              href={`mailto:${loc.email}`}
                              className="text-[14px] text-gray-700 hover:text-[#ea4335] break-all transition-colors"
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
                              className="text-[14px] text-gray-700 hover:text-[#ea4335] transition-colors"
                            >
                              {loc.phone}
                            </a>
                          </div>
                        )}

                        {/* Website */}
                        {loc.websiteUrl && (
                          <div className="flex items-center gap-2">
                            <Globe size={12} className="shrink-0 font-bold text-gray-400" />
                            <a
                              href={loc.websiteUrl.startsWith('http') ? loc.websiteUrl : `https://${loc.websiteUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[14px] text-gray-700 hover:text-[#ea4335] transition-colors"
                            >
                              {/* This regex removes http://, https://, and www. */}
                              {loc.websiteUrl.replace(/(^\w+:|^)\/\/(www\.)?/, '')}
                            </a>
                          </div>
                        )}

                        {/* Read More button */}

                        {loc.contentUrl && (
                          <div className="pt-2 border-t border-gray-100">
                            <button
                              onClick={(e) => handleContentUrl(e, loc.contentUrl)}
                              className="w-full bg-black text-white uppercase text-[12px] font-bold py-2.5 px-4 hover:bg-[#2f2f2f] transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2"
                            >
                              <span>Read More</span>
                              {/* Optional: Add a small arrow icon if you're using Lucide */}
                              <ExternalLink size={12} />
                            </button>
                          </div>
                        )}


                      </div>
                    </div>
                  </InfoWindow>
                )
                }
              </React.Fragment>
            );
          })}
        </Map>
      </APIProvider>
    </div >
  );
};