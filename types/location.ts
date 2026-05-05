// 1. Define the internal shape of GHL's raw data
interface GHLSubAccount {
  id: string;
  name: string;
  address?: string;
  city?: string;
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
  name: string;
  address: string;
  email: string;
  phone: string;
  status: 'draft';
}