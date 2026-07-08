import { Venue, Wedding } from '@/lib/generated/prisma/client';

export type VenueWithWeddings = Venue & { weddings: Wedding[] };

export type WeddingStatus = 'live' | 'upcoming' | 'none';

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

  // Find upcoming wedding (future dates, or today but future time)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const upcomingWeddings = venue.weddings.filter(w => {
    const wDate = new Date(w.date.getFullYear(), w.date.getMonth(), w.date.getDate());
    if (wDate > today) return true;
    if (wDate.getTime() === today.getTime()) {
        const start = new Date(w.startTime);
        return now.toTimeString().split(' ')[0] < start.toTimeString().split(' ')[0];
    }
    return false;
  });

  if (upcomingWeddings.length > 0) {
    // Return the soonest upcoming
    upcomingWeddings.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    return { status: 'upcoming', activeWedding: upcomingWeddings[0] };
  }

  return { status: 'none' };
}
