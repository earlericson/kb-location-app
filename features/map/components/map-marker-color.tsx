import { BusinessLocation } from "@/types";

export type BusinessStatus = BusinessLocation['status'];

export const statusStyles: Record<BusinessStatus, {
    fill: string;
    ping: string;
    text: string;
    textBadge: string;
    dot: string;
}> = {
    'Active': {
        fill: '#ed1f24',
        ping: 'bg-[#ed1f24]/40',
        text: 'text-[#ed1f24]',
        textBadge: 'bg-[#ed1f24]/10 text-[#ed1f24] border-[#ed1f24]/40',
        dot: 'bg-red-600'
    },
    'For Sale': {
        fill: '#f97316',
        ping: 'bg-orange-500/40',
        text: 'text-orange-500',
        textBadge: 'bg-orange-50 text-orange-600 border-orange-200',
        dot: 'bg-orange-600'
    },
    'Available': {
        fill: '#22c55e',
        ping: 'bg-green-500/40',
        text: 'text-green-500',
        textBadge: 'bg-green-50 text-green-600 border-green-200',
        dot: 'bg-green-600'
    }
};