import { GHLSearchResponse, MappedLocation } from '@/types/location';
import { NextResponse } from 'next/server';

// Helper function to capitalize the fullname
const toTitleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export async function POST() {
  const GHL_TOKEN = process.env.GHL_API_KEY;

  if (!GHL_TOKEN) {
    return NextResponse.json(
      { error: 'Server configuration error: Missing API Key' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch('https://services.leadconnectorhq.com/locations/search?limit=100', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${GHL_TOKEN}`,
        'Version': '2021-07-28'
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `GHL API responded with status: ${response.status}` },
        { status: response.status }
      );
    }

    // Cast the JSON response to our GHL interface
    const data = (await response.json()) as GHLSearchResponse;

    const formatted: MappedLocation[] = data.locations.map((loc) => {
      // Collect all geographical parts
      const addressParts: (string | undefined)[] = [
        loc.address,
        loc.city,
        loc.state,
        loc.postalCode,
        loc.country
      ];

      const fullName = [loc.firstName, loc.lastName]
        .filter(name => !!name && name.trim() !== '')
        .join(' ');

      // Merge into a single clean string: "Street, City, State, Zip, Country"
      const fullAddress = addressParts
        .filter((part): part is string => !!part && part.trim() !== '')
        .join(', ');

      return {
        ghlId: loc.id,
        businessName: loc.name || 'Unnamed Business',
        businessOwner: fullName ? toTitleCase(fullName) : 'No Owner',
        address: fullAddress || 'No address provided',
        email: loc.email || '',
        phone: loc.phone || '',
        websiteUrl: loc.website || '',
        status: 'Draft'
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    // Log the actual error for Vercel logs, but return a clean message
    console.error('GHL Import Route Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error during GHL fetch' },
      { status: 500 }
    );
  }
}