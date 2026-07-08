import 'dotenv/config';
import prisma from '../lib/prisma';

async function main() {
  console.log('Clearing old data...');
  await prisma.wedding.deleteMany();
  await prisma.venue.deleteMany();

  console.log('Seeding database with venues...');

  const venuesData = [
    {
      name: 'Lulu International Convention Center',
      district: 'Thrissur',
      address: 'Puzhakkal, Ayyanthole, Thrissur, Kerala 680003',
      latitude: 10.5369,
      longitude: 76.1911,
      googleMapsUrl: 'https://maps.app.goo.gl/dummyLuluThrissur'
    },
    {
      name: 'Adlux International Convention & Exhibition Centre',
      district: 'Ernakulam',
      address: 'Karakutty, Angamaly, Ernakulam, Kerala 683576',
      latitude: 10.2198,
      longitude: 76.3860,
      googleMapsUrl: 'https://maps.app.goo.gl/dummyAdlux'
    },
    {
      name: 'Gokulam Convention Centre',
      district: 'Ernakulam',
      address: 'Kaloor, Kochi, Ernakulam, Kerala 682017',
      latitude: 9.9972,
      longitude: 76.2946,
      googleMapsUrl: 'https://maps.app.goo.gl/dummyGokulam'
    },
    {
      name: 'Calicut Trade Centre',
      district: 'Kozhikode',
      address: 'Mini Bypass Rd, Sarovaram Biopark, Kozhikode, Kerala 673004',
      latitude: 11.2678,
      longitude: 75.7953,
      googleMapsUrl: 'https://maps.app.goo.gl/dummyCalicutTC'
    },
    {
      name: 'Al Saj Convention Centre',
      district: 'Trivandrum',
      address: 'Kazhakuttom, Thiruvananthapuram, Kerala 695582',
      latitude: 8.5670,
      longitude: 76.8722,
      googleMapsUrl: 'https://maps.app.goo.gl/dummyAlSaj'
    },
    {
      name: 'Flora Airport Convention Centre',
      district: 'Ernakulam',
      address: 'Nedumbassery, Kochi Airport, Ernakulam, Kerala 683572',
      latitude: 10.1558,
      longitude: 76.3900,
      googleMapsUrl: 'https://maps.app.goo.gl/dummyFlora'
    },
    {
      name: 'Perinthalmanna Convention Centre',
      district: 'Malappuram',
      address: 'Perinthalmanna, Malappuram, Kerala 679322',
      latitude: 10.9760,
      longitude: 76.2230,
    }
  ];

  const createdVenues = [];
  for (const venue of venuesData) {
    const v = await prisma.venue.create({ data: venue });
    createdVenues.push(v);
  }

  console.log('Seeding weddings (live, upcoming, past)...');
  
  const today = new Date();
  
  // 1. Live Wedding (Today, time active)
  const startTimeLive = new Date(today);
  startTimeLive.setHours(today.getHours() - 1);
  const endTimeLive = new Date(today);
  endTimeLive.setHours(today.getHours() + 4);

  await prisma.wedding.create({
    data: {
      brideName: 'Aiswarya',
      groomName: 'Rahul',
      date: today,
      startTime: startTimeLive,
      endTime: endTimeLive,
      food: 'Traditional Kerala Sadya',
      venueId: createdVenues[0].id, // Lulu Thrissur
    }
  });

  // 2. Upcoming Wedding (Tomorrow)
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startTimeUp = new Date(tomorrow);
  startTimeUp.setHours(10, 0, 0);
  const endTimeUp = new Date(tomorrow);
  endTimeUp.setHours(14, 0, 0);

  await prisma.wedding.create({
    data: {
      brideName: 'Fatima',
      groomName: 'Rishad',
      date: tomorrow,
      startTime: startTimeUp,
      endTime: endTimeUp,
      food: 'Biriyani Feast',
      venueId: createdVenues[1].id, // Adlux
    }
  });

  // 3. Past Wedding (No active/upcoming wedding should result in Gray)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const startTimePast = new Date(yesterday);
  startTimePast.setHours(11, 0, 0);
  const endTimePast = new Date(yesterday);
  endTimePast.setHours(15, 0, 0);

  await prisma.wedding.create({
    data: {
      brideName: 'Sneha',
      groomName: 'Arjun',
      date: yesterday,
      startTime: startTimePast,
      endTime: endTimePast,
      food: 'Buffet',
      venueId: createdVenues[2].id, // Gokulam
    }
  });

  // The rest have no weddings, so they will be Gray by default.

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
