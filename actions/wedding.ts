'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function deleteWedding(id: string) {
  try {
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
