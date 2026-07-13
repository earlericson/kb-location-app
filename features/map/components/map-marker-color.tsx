import { BusinessLocation } from "@/types";

export type BusinessStatus = BusinessLocation['status'];

export const statusStyles: Record<BusinessStatus, {
    fill: string;
    ping: string;
    text: string;
    textBadge: string;
    dot: string;
}> = {
    'active': {
        fill: '#ed1f24',
        ping: 'bg-[#ed1f24]/40',
        text: 'text-[#ed1f24]',
        textBadge: 'bg-[#ed1f24]/10 text-[#ed1f24] border-[#ed1f24]/40',
        dot: 'bg-red-600'
    },
    'forsale': {
        fill: '#f97316',
        ping: 'bg-orange-500/40',
        text: 'text-orange-500',
        textBadge: 'bg-orange-50 text-orange-600 border-orange-200',
        dot: 'bg-orange-600'
    },
    'available': {
        fill: '#22c55e',
        ping: 'bg-green-500/40',
        text: 'text-green-500',
        textBadge: 'bg-green-50 text-green-600 border-green-200',
        dot: 'bg-green-600'
    }
};

// constants.ts
export const STATUS_DISPLAY_MAP: Record<string, string> = {
    'active': 'Active',
    'forsale': 'For Sale',
    'available': 'Available'
};


export const STATUS_DISPLAY_MAP2: Record<string, string> = {
    'draft': 'Draft'
};