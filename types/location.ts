import { FieldValue, Timestamp } from "firebase/firestore";

// 1. Define the internal shape of GHL's raw data
interface GHLSubAccount {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  email?: string;
  phone?: string;
}

// 2. Define the wrapper object GHL returns
export interface GHLSearchResponse {
  locations: GHLSubAccount[];
}

// 3. Define the structure you are sending to your Dashboard
export interface MappedLocation {
  ghlId: string;
  businessName: string;
  businessOwner: string;
  address: string;
  email: string;
  phone: string;
  status: 'draft' | 'published';
  // FieldValue is for when saving (serverTimestamp), 
  // Timestamp is for when reading from Firestore
  createdAt?: Timestamp | FieldValue | string | null;
}