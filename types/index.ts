export interface BusinessLocation {
    id: string; // The Firestore Document ID
    businessName: string;
    phone: string;
    address: string;
    email: string;
    imageUrl: string;
    latitude: number;
    longitude: number;
    websiteUrl?: string;   // Added '?' to make it optional
    contentUrl?: string;   // Added '?' to make it optional
    createdAt: any; // Firestore Timestamp
}