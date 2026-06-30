import { BusinessLocation } from '@/types';
import { MapPin } from 'lucide-react';
import { statusStyles } from './map-marker-color';

interface MapMarkerProps {
    status: BusinessLocation['status'];
    isSelected: boolean;
    onClick: () => void;
}

export const MapMarker = ({ status, isSelected, onClick }: MapMarkerProps) => {
    const fillColor = statusStyles[status].fill || '#6b7280'; // Default Gray-500

    return (
        <div
            onClick={onClick}
            className={`cursor-pointer transition-all duration-300 ${isSelected ? 'scale-125' : 'scale-100 hover:scale-125'}`}
        >
            <MapPin
                size={35}
                fill={fillColor}
                stroke="#ffffff"
                strokeWidth={1}
                className="w-8 h-8" // You can move the color logic into the fill prop
            />
        </div>
    );
};