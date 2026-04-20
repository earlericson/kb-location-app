export interface BusinessLocation {
    id: string; // The Firestore Document ID
    businessName: string;
    phone: string;
    address: string;
    email: string;
    imageUrl: string;
    latitude: string;
    longitude: string;
    websiteUrl: string;
    contentUrl: string;
    createdAt: any; // Firestore Timestamp
}