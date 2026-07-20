"use client";

import React, { useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow
} from "@vis.gl/react-google-maps";
import { BusinessLocation } from "@/types";
import { Globe, MapPin, Phone, Mail, ExternalLink, User, Image } from "lucide-react";
import { MapMarker } from "./components/map-marker";
import { STATUS_DISPLAY_MAP, STATUS_DISPLAY_MAP2, statusStyles } from "./components/map-marker-color";

interface MapProps {
  businessloc: BusinessLocation;
  // selectedLocation: BusinessLocation | null;
  onMarkerClick: (b: BusinessLocation | null) => void;
  isSelected: boolean;
}

export const MapContainer = ({ businessloc, onMarkerClick, isSelected }: MapProps) => {
  const [isHovered, setIsHovered] = useState(false);
  // const isSelected = selectedLocation?.id === businessloc[0].id;

  // Use your env variable for the API Key
  // const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Move infoWindow
  const infoWindowOffset: [number, number] = [0, -45];

  // Read More button
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
      {/* <APIProvider apiKey={API_KEY} libraries={['marker']}> */}

      return (
      <React.Fragment key={businessloc.id}>
        <AdvancedMarker
          position={{ lat: businessloc.latitude, lng: businessloc.longitude }}
          // collisionBehavior="REQUIRED"
          onClick={() => onMarkerClick(businessloc)} // Ensure this is fired
          // onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          // Higher z-index on hover ensures the text is never hidden
          zIndex={isHovered ? 9999 : 1}
          onMouseEnter={() => {
            setIsHovered(true);
            // console.log("Hovered Business:", businessloc.businessName);
          }}
        >

          {/* Custom Styled for Map Zoom Transition Effect */}
          {/* <div className={`transition-all duration-500 transform ${selectedLocation?.id === businessloc.id ? 'scale-125' : 'scale-100'
                    }`}></div> */}

          <div className="relative flex flex-col items-center justify-end h-10 min-w-max overflow-visible no-close">

            {/* The Individual Text Popup */}

            {isHovered && !isSelected && (
              <>
                <InfoWindow
                  position={{ lat: businessloc.latitude, lng: businessloc.longitude }}
                  pixelOffset={infoWindowOffset}
                  headerDisabled={true}
                >

                  {/* <h4 className="font-bold text-base text-[#ed1f24] leading-tight mb-3">
                    {businessloc.businessName}
                  </h4> */}
                  <h4 className={`font-bold text-base leading-tight mb-3 ${statusStyles[businessloc.status].text}`}>
                    {businessloc.businessName}
                  </h4>
                </InfoWindow>

                {/* <div className="absolute -bottom-3 w-12 h-5 bg-[#ed1f24]/40 rounded-[50%] animate-ping pointer-events-none"></div> */}
                <div className={`absolute -bottom-3 w-12 h-5 rounded-[50%] animate-ping pointer-events-none z-50 ${statusStyles[businessloc.status].ping}`}></div>
              </>

            )}

            {/* Custom Styled Pin matching your dashboard theme */}
            {/* <Pin
              background={isSelected || isHovered ? "#ed1f24" : "#ed1f24"}
              // scale={selectedLocation?.id === loc.id ? 1.3 : 1}
              borderColor={"#b31412"}
              glyphColor={"#b31412"}
            // scale={1.1}
            /> */}

            {/* <div className="z-10 transition-transform duration-200"
              style={{ transform: (isSelected || isHovered) ? 'scale(1.3)' : 'scale(1)' }}> */}

            {/* <MapPin
                size={35}
                // fill="#ed1f24"
                stroke="#ffff"
                strokeWidth={1}
                className={`w-8 h-8 ${colorClass}`}
              /> */}

            <MapMarker
              status={businessloc.status}
              isSelected={isSelected}
              onClick={() => onMarkerClick(businessloc)}
            />
            {/* </div> */}

          </div>
        </AdvancedMarker>

        {/* Show details when the marker is clicked */}
        {
          isSelected && (
            <InfoWindow
              position={{ lat: businessloc.latitude, lng: businessloc.longitude }}
              onCloseClick={() => onMarkerClick(null)}
              pixelOffset={infoWindowOffset}
            >
              <div className="pl-2 pr-1 pb-2 w-70">
                <div className="relative w-full h-40 rounded-lg overflow-hidden mb-5">
                  {/* Location Image */}
                  {businessloc.imageUrl ? (
                    <div className="w-full h-40 overflow-hidden bg-gray-100 mb-5">
                      <img
                        src={businessloc.imageUrl}
                        alt={businessloc.businessName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    // Fallback if no image exists
                    <div className="flex flex-col items-center justify-center gap-1 w-full h-40 bg-slate-50 mb-5 text-gray-400">
                      <Image size={42} />
                      <span className="text-[14px]">No image available</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <span className={`absolute top-2 right-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-mono leading-relaxed border shadow-sm text-white ${statusStyles[businessloc.status].dot}`}>
                    <span className={`w-1.5 h-1.5 mr-1.5 rounded-full bg-white`}></span>
                    {businessloc.status !== 'Draft'
                      ? (STATUS_DISPLAY_MAP[businessloc.status] || businessloc.status)
                      : (STATUS_DISPLAY_MAP2[businessloc.status] || businessloc.status)
                    }
                  </span>
                </div>

                {/* Location Name */}
                <h4 className={`font-bold text-base leading-tight mb-1 ${statusStyles[businessloc.status].text}`}>
                  {businessloc.businessName}
                </h4>

                <div className="space-y-2.5">

                  {/* Business Owner */}
                  {businessloc.businessOwner && (
                    <div className="flex items-center gap-2">
                      <User size={10} className="shrink-0 font-bold text-gray-400" />
                      <p className="font-mono text-[11px] text-black leading-snug">
                        {businessloc.businessOwner}
                      </p>
                    </div>
                  )}

                  {/* Address */}
                  {businessloc.address && (
                    <div className="flex items-start gap-2 mt-4">
                      <MapPin size={12} className="shrink-0 mt-0.5 font-bold text-gray-400" />
                      <p className="text-[14px] text-black font-normal leading-snug">
                        {businessloc.address}
                      </p>
                    </div>
                  )}

                  {/* Email */}
                  {businessloc.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="shrink-0 font-bold text-gray-400" />
                      <a
                        href={`mailto:${businessloc.email}`}
                        className="text-[14px] text-black font-normal hover:text-[#ed1f24] break-all transition-colors focus-visible:outline-none"
                      >
                        {businessloc.email}
                      </a>
                    </div>
                  )}

                  {/* Phone */}
                  {businessloc.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="shrink-0 font-bold text-gray-400" />
                      <a
                        href={`tel:${businessloc.phone}`}
                        className="text-[14px] text-black font-normal hover:text-[#ed1f24] transition-colors"
                      >
                        {businessloc.phone}
                      </a>
                    </div>
                  )}

                  {/* Website */}
                  {businessloc.websiteUrl && (
                    <div className="flex items-center gap-2">
                      <Globe size={12} className="shrink-0 font-bold text-gray-400" />
                      <a
                        href={businessloc.websiteUrl.startsWith('http') ? businessloc.websiteUrl : `https://${businessloc.websiteUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[14px] text-black font-normal hover:text-[#ed1f24] transition-colors"
                      >
                        {/* This regex removes http://, https://, and www. */}
                        {businessloc.websiteUrl.replace(/(^\w+:|^)\/\/(www\.)?/, '')}
                      </a>
                    </div>
                  )}

                  {/* Read More button */}

                  {businessloc.contentUrl && (
                    <div className="pt-2 border-t border-gray-100">
                      <button
                        onClick={(e) => handleContentUrl(e, businessloc.contentUrl ?? "")}
                        className="w-full bg-black rounded-lg text-white uppercase text-[12px] font-bold py-3 px-4 hover:bg-[#ed1f24] transition-all shadow-md shadow-gray-300 active:scale-95 flex items-center justify-center gap-2"
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
      {/* </APIProvider> */}
    </div >
  );
};