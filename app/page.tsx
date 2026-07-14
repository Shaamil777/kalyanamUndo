import prisma from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';
import AddVenueModal from '@/components/venue/AddVenueModal';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const session = await auth();
  const currentUserId = session?.user?.id || null;

  const venues = await prisma.venue.findMany({
    include: {
      weddings: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <>
      <HomeClient venues={venues} currentUserId={currentUserId} />
      <AddVenueModal currentUserId={currentUserId} />
    </>
  );
}
