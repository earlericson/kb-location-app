import { useEffect, useRef, useState } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { BusinessLocation } from '@/types';
import { STATUS_DISPLAY_MAP, STATUS_DISPLAY_MAP2, statusStyles } from '@/features/map/components/map-marker-color';

type statusFilter = BusinessLocation["status"] | "All";

interface StatusFilterDropdownProps {
    selectedStatuses: statusFilter[];
    onStatusChange: (statuses: statusFilter[]) => void;
    onReset: () => void;
}

// Ensure these strings match your BusinessLocation status values exactly
const STATUS_OPTIONS: statusFilter[] = ['All', 'active', 'forsale', 'available'];

export const StatusFilterDropdown = ({ selectedStatuses, onStatusChange, onReset }: StatusFilterDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const toggleStatus = (status: statusFilter) => {
        if (status === 'All') {
            onStatusChange(['All']);
        } else {
            const current = selectedStatuses.includes('All') ? [] : selectedStatuses;
            const next = current.includes(status)
                ? current.filter(s => s !== status)
                : [...current, status];
            onStatusChange(next.length === 0 ? ['All'] : next);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                // className="flex items-center p-2 border rounded-md bg-black hover:bg-[#ed1f24] transition-all border-none shadow-md"
                className={`flex items-center p-2 border rounded-md  hover:bg-[#ed1f24] transition-all border-none shadow-md ${isOpen ? "bg-[#ed1f24]": "bg-black"}`}
            >
                <SlidersHorizontal size={20} className="text-white" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-md shadow-gray-300 p-2 z-50">
                    {STATUS_OPTIONS.map((status) => {

                        const config = status === 'All'
                            ? 'text-black'
                            : statusStyles[status as keyof typeof statusStyles]?.text || 'text-blue-500';

                        return (
                            <label key={status} className={`flex items-center gap-2 p-1 text-sm cursor-pointer ${config}`}>
                                <input
                                    type="checkbox"
                                    checked={selectedStatuses.includes(status)}
                                    onChange={() => toggleStatus(status)}
                                    className="w-4 h-4 accent-[#ed1f24] cursor-pointer rounded transition-colors"
                                />
                                {status !== 'Draft'
                                    ? (STATUS_DISPLAY_MAP[status] || status)
                                    : (STATUS_DISPLAY_MAP2[status] || status)
                                }
                            </label>
                        )
                    })}
                    <button
                        onClick={() => { onReset(); setIsOpen(false); }}
                        className="w-full mt-2 py-1.5 bg-black hover:bg-[#ed1f24] text-xs text-white rounded-md shadow-md"
                    >
                        Reset All
                    </button>
                </div>
            )}
        </div>
    );
};