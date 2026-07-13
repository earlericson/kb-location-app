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
    updatedAt?: any;
    // status: 'draft' | 'published';
    // status: 'Active' | 'For Sale' | 'Available';
    status: 'active' | 'forsale' | 'available' | (string & {});
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
    total: number;
    [key: string]: number; // Allows any status key to be counted dynamically
}

export interface RadialBarProps {
    label: string;
    status: string;
    color: string;
    textColor: string;
    icon: React.ReactNode;
    value: number;
    total: number;

}

export interface RecentLocationData {
    id: string;
    businessName: string;
    imageUrl?: string;
    status: string;
    createdAt: Date;
}

export interface ActivityLog {
    id: string;
    action: 'Created' | 'Updated' | 'Deleted' | 'Imported' | 'Synced';
    businessName: string;
    message: string;
    timestamp: Date;
    user?: string; // Optional: if you track who did the action
}