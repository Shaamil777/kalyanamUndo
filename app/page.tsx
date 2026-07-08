import prisma from '@/lib/prisma';
import HomeClient from '@/components/HomeClient';
import AddVenueModal from '@/components/AddVenueModal';

export const dynamic = 'force-dynamic';

export default async function Home() {
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
      <HomeClient venues={venues} />
      <AddVenueModal />
    </>
  );
}

