'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createVenue(formData: FormData) {
  const name = formData.get('name') as string;
  const district = formData.get('district') as string;
  const address = formData.get('address') as string;
  const latitude = parseFloat(formData.get('latitude') as string);
  const longitude = parseFloat(formData.get('longitude') as string);

  if (!name || !district || isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Invalid input');
  }

  const venue = await prisma.venue.create({
    data: {
      name,
      district,
      address: address || null,
      latitude,
      longitude,
    },
  });

  revalidatePath('/');
  return venue;
}
