import React, { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface Props {
  onPlaceSelect: (location: { lat: number; lng: number } | null) => void;
  onInputChange?: (value: string) => void;
}

interface PlaceSelectEvent extends Event {
  placePrediction?: {
    toPlace: () => google.maps.places.Place;
  };
}

export const PlaceAutocomplete = ({ onPlaceSelect, onInputChange }: Props) => {
  const autocompleteRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const places = useMapsLibrary('places');

  // STABILITY FIX: Store your callbacks in a ref to prevent unnecessary effect teardowns
  const callbacks = useRef({ onPlaceSelect, onInputChange });
  useEffect(() => {
    callbacks.current = { onPlaceSelect, onInputChange };
  }, [onPlaceSelect, onInputChange]);

  useEffect(() => {
    // Clean guard clause without the orphaned inputRef
    if (!places || !autocompleteRef.current) return;

    const el = autocompleteRef.current;
    el.includedRegionCodes = ['US'];
    el.placeholder = "Search address...";

    const handlePlaceSelect = async (e: Event) => {
      const placeEvent = e as PlaceSelectEvent;
      const prediction = placeEvent.placePrediction;

      if (!prediction) {
        callbacks.current.onPlaceSelect(null);
        if (callbacks.current.onInputChange) callbacks.current.onInputChange("");
        return;
      }

      const place = prediction.toPlace();

      try {
        await place.fetchFields({ fields: ['location'] });
        const location = place.location;
        if (!location) return;

        const lat = location.lat();
        const lng = location.lng();

        if (lat !== undefined && lng !== undefined) {
          callbacks.current.onPlaceSelect({ lat, lng });
        }
      } catch (error) {
        console.error("Error fetching place details:", error);
      }
    };

    // Listen to input events on the web component to catch when the user clears text or clicks the "X" icon
    const handleInputClear = () => {
      setTimeout(() => {
        // Check if the component's internal value is empty
        if (!el.value || el.value === "") {
          if (callbacks.current.onInputChange) callbacks.current.onInputChange("");
          callbacks.current.onPlaceSelect(null);
        }
      }, 10);
    };

    // Attach listeners directly to the web component
    el.addEventListener('gmp-select', handlePlaceSelect);
    el.addEventListener('input', handleInputClear);
    el.addEventListener('click', handleInputClear);
    el.addEventListener('keyup', handleInputClear);

    return () => {
      el.removeEventListener('gmp-select', handlePlaceSelect);
      el.removeEventListener('input', handleInputClear);
      el.addEventListener('click', handleInputClear);
      el.addEventListener('keyup', handleInputClear);
    };
  }, [places]);

  return (
    <div className="relative w-full max-w-md">
      <gmp-place-autocomplete
        ref={autocompleteRef}
        className="w-full bg-gray-50 border border-gray-200 rounded-xl outline-none text-md text-black font-semibold placeholder-slate-500 transition-all"
      />
    </div>
  );
};