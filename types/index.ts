export interface BusinessLocation {
    id: string; // The Firestore Document ID
    businessName: string;
    businessOwner: string;
    phone: string;
    address: string;
    email: string;
    imageUrl?: string;
    latitude: number;
    longitude: number;
    websiteUrl?: string;   // Added '?' to make it optional
    contentUrl?: string;   // Added '?' to make it optional
    createdAt: any; // Firestore Timestamp
    // status: 'draft' | 'published';
    status: 'Active' | 'For Sale' | 'Available';
    isSynced: boolean;
}

export interface AreaChartData {
    date: string;
    [key: string]: string | number;
    // id: string;
    // status: 'Active' | 'For Sale' | 'Available';
    // createdAt: string | Date;
}

export interface RadialBarData {
    published: number;
    draft: number;
    total: number;
}

export interface RadialBarProps {
    label: string;
    color: string;
    textColor?: string;
    icon: React.ReactNode;
    status: 'draft' | 'published';
}

export interface RecentLocationData {
    id: string;
    businessName: string;
    latitude: number;
    longitude: number;
    status: 'draft' | 'published';
    createdAt: Date;
}

export interface ActivityLog {
    id: string;
    action: 'Created' | 'Updated' | 'Deleted' | 'Synced';
    businessName: string;
    timestamp: Date;
    user?: string; // Optional: if you track who did the action
}