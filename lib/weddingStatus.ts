import { Venue, Wedding } from '@/lib/generated/prisma/client';

export type VenueWithWeddings = Venue & { weddings: Wedding[] };

export type WeddingStatus = 'live' | 'none';

export function getWeddingStatus(venue: VenueWithWeddings): { status: WeddingStatus, activeWedding?: Wedding } {
  if (!venue.weddings || venue.weddings.length === 0) {
    return { status: 'none' };
  }

  const now = new Date();

  // Find live wedding
  const liveWedding = venue.weddings.find(w => {
    const isToday = w.date.toDateString() === now.toDateString();
    if (!isToday) return false;
    
    // Check if current time is between start and end time
    const start = new Date(w.startTime);
    const end = w.endTime ? new Date(w.endTime) : null;
    
    const nowTimeStr = now.toTimeString().split(' ')[0];
    const startTimeStr = start.toTimeString().split(' ')[0];
    const endTimeStr = end ? end.toTimeString().split(' ')[0] : '23:59:59';
    
    return nowTimeStr >= startTimeStr && nowTimeStr <= endTimeStr;
  });

  if (liveWedding) {
    return { status: 'live', activeWedding: liveWedding };
  }

  return { status: 'none' };
}
