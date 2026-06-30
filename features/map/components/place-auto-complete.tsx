import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
  onPlaceSelect: (location: { lat: number; lng: number } | null) => void;
  onInputChange?: (value: string) => void;
  count: number;
}

export const PlaceAutocomplete = ({ onPlaceSelect, onInputChange, count }: Props) => {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;
    const options = { fields: ['geometry', 'name', 'formatted_address'] };
    setAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!autocomplete) return;
    const listener = autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();
      if (lat !== undefined && lng !== undefined) {
        onPlaceSelect({ lat, lng });
      }
    });
    return () => google.maps.event.removeListener(listener);
  }, [autocomplete, onPlaceSelect]);

  useEffect(() => {
    if (!places || !inputRef.current) return;

    // Added componentRestrictions to filter for 'us'
    const options = {
      fields: ['geometry', 'name', 'formatted_address'],
      componentRestrictions: { country: 'us' }
    };

    setAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onInputChange) onInputChange(e.target.value);
    if (e.target.value === "") onPlaceSelect(null);
  };

  return (
    <div className="p-4 border-b border-gray-100">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input
          type="text"
          ref={inputRef}
          onChange={handleInputChange}
          placeholder="Search for a city or address..."
          className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#ea4335] outline-none text-sm transition-all"
        />
      </div>
      <p className="text-[11px] text-gray-400 mt-2 font-medium uppercase tracking-wider">
        {count} Locations Found
      </p>
    </div>
  );
};