'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function deleteVenue(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('Unauthorized');
  }

  try {
    const venue = await prisma.venue.findUnique({ where: { id } });
    if (!venue) throw new Error('Venue not found');
    
    if (venue.userId !== session.user.id) {
      throw new Error('Forbidden: You can only delete your own venues');
    }

    await prisma.venue.delete({
      where: { id }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting venue:', error);
    throw new Error('Failed to delete venue');
  }
}

export async function updateVenue(id: string, formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('Unauthorized');
  }

  try {
    const existingVenue = await prisma.venue.findUnique({ where: { id } });
    if (!existingVenue) throw new Error('Venue not found');
    
    if (existingVenue.userId !== session.user.id) {
      throw new Error('Forbidden: You can only edit your own venues');
    }

    const name = formData.get('name') as string;
    const city = formData.get('city') as string;
    const district = formData.get('district') as string;
    const address = formData.get('address') as string;
    const googleMapsUrl = formData.get('googleMapsUrl') as string;

    if (!name || !city || !district || !googleMapsUrl) {
      throw new Error('Invalid input: Name, City, District, and Google Maps Link are required');
    }

    // Geocode the city + district using Nominatim if city or district changed
    let latitude = existingVenue.latitude;
    let longitude = existingVenue.longitude;

    if (city !== existingVenue.city || district !== existingVenue.district) {
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
      }
    }

    const updatedVenue = await prisma.venue.update({
      where: { id },
      data: {
        name,
        city,
        district,
        address: address || null,
        googleMapsUrl,
        latitude,
        longitude,
      },
    });

    revalidatePath('/');
    return updatedVenue;
  } catch (error) {
    console.error('Error updating venue:', error);
    throw new Error('Failed to update venue');
  }
}

export async function createVenue(formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('Unauthorized');
  }

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
      userId: session.user.id,
    },
  });

  revalidatePath('/');
  return venue;
}
