'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

export async function deleteWedding(id: string) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('Unauthorized');
  }

  try {
    const wedding = await prisma.wedding.findUnique({ where: { id } });
    if (!wedding) throw new Error('Wedding not found');
    
    if (wedding.userId !== session.user.id) {
      throw new Error('Forbidden: You can only delete your own programs');
    }

    await prisma.wedding.delete({
      where: { id }
    });
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting wedding:', error);
    throw new Error('Failed to delete wedding');
  }
}

export async function createWedding(formData: FormData) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    throw new Error('Unauthorized');
  }

  try {
    const venueId = formData.get('venueId') as string;
    const brideName = formData.get('brideName') as string;
    const groomName = formData.get('groomName') as string;
    const dateStr = formData.get('date') as string;
    const startTimeStr = formData.get('startTime') as string;
    const endTimeStr = formData.get('endTime') as string;
    const food = formData.get('food') as string;

    if (!venueId || !brideName || !groomName || !dateStr || !startTimeStr) {
      throw new Error('Missing required fields');
    }

    // Convert date string "YYYY-MM-DD" to DateTime at midnight IST
    const date = new Date(`${dateStr}T00:00:00+05:30`);
    
    // Combine date and time to create proper Date objects for start and end times in IST
    const startTime = new Date(`${dateStr}T${startTimeStr}:00+05:30`);
    const endTime = endTimeStr ? new Date(`${dateStr}T${endTimeStr}:00+05:30`) : null;

    await prisma.wedding.create({
      data: {
        venueId,
        brideName,
        groomName,
        date,
        startTime,
        endTime,
        food: food || null,
        userId: session.user.id,
      }
    });
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error creating wedding:', error);
    throw new Error('Failed to create wedding');
  }
}
