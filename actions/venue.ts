'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createVenue(formData: FormData) {
  const name = formData.get('name') as string;
  const city = formData.get('city') as string;
  const district = formData.get('district') as string;
  const address = formData.get('address') as string;
  const googleMapsUrl = formData.get('googleMapsUrl') as string;

  if (!name || !city || !district || !googleMapsUrl) {
    throw new Error('Invalid input: Name, City, District, and Google Maps Link are required');
  }

  // Geocode the city + district using Nominatim
  let latitude = 10.8505; // Fallback to Kerala center
  let longitude = 76.2711;

  try {
    const query = encodeURIComponent(`${city}, ${district}, Kerala`);
    const geocodeRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`, {
      headers: { 'User-Agent': 'KalyanamApp/1.0' }
    });
    const geocodeData = await geocodeRes.json();
    
    if (geocodeData && geocodeData.length > 0) {
      latitude = parseFloat(geocodeData[0].lat);
      longitude = parseFloat(geocodeData[0].lon);
    }
  } catch (error) {
    console.error("Failed to geocode venue location:", error);
    // Proceed with fallback coordinates
  }

  const venue = await prisma.venue.create({
    data: {
      name,
      city,
      district,
      address: address || null,
      googleMapsUrl: googleMapsUrl,
      latitude,
      longitude,
    },
  });

  revalidatePath('/');
  return venue;
}
