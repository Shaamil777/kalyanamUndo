import 'dotenv/config';
import prisma from '../lib/prisma';

const manualVenues = [
  { name: 'Regency Convention Centre', district: 'Malappuram', latitude: 11.06275, longitude: 76.09303 },
  { name: 'Rose Lounge', district: 'Malappuram', latitude: 11.0386, longitude: 76.06965 },
  { name: 'Malabar Convention Centre', district: 'Malappuram', latitude: 11.10996, longitude: 76.05232 },
  { name: 'C4 Convention Centre', district: 'Malappuram', latitude: 11.00701, longitude: 76.12659 },
  { name: 'White Line', district: 'Malappuram', latitude: 11.06716, longitude: 76.06543 },
  { name: 'Parappan', district: 'Malappuram', latitude: 11.01842, longitude: 75.94651 },
  { name: 'Malayil Convention', district: 'Malappuram', latitude: 11.02202, longitude: 76.06874 },
  { name: 'Tayseer Convention', district: 'Malappuram', latitude: 11.0799, longitude: 76.09574 },
  { name: 'Rivera Convention', district: 'Malappuram', latitude: 11.06759, longitude: 76.09795 },
  { name: 'Grand View', district: 'Malappuram', latitude: 11.00029, longitude: 76.07874 },
  { name: 'Century Convention', district: 'Malappuram', latitude: 11.1357, longitude: 76.11906 },
  { name: 'VP Hall Malappuram', district: 'Malappuram', latitude: 11.1289, longitude: 76.11494 },
  { name: 'Hillton Convention', district: 'Malappuram', latitude: 11.10609, longitude: 76.127 },
  { name: 'Mount Rich', district: 'Malappuram', latitude: 11.12256, longitude: 76.13365 },
  { name: 'Haifa Plaza', district: 'Malappuram', latitude: 11.14006, longitude: 76.11934 },
  { name: 'Shifa Convention', district: 'Malappuram', latitude: 10.97785, longitude: 76.24618 },
  { name: 'Presidency', district: 'Malappuram', latitude: 11.00643, longitude: 76.21973 },
  { name: 'Eventive Convention', district: 'Malappuram', latitude: 10.98637, longitude: 76.23057 },
  { name: 'New Grand', district: 'Malappuram', latitude: 10.99541, longitude: 76.22284 },
  { name: 'Bona Dea', district: 'Malappuram', latitude: 10.94995, longitude: 76.24578 },
  { name: 'Bianco Castle', district: 'Malappuram', latitude: 10.90797, longitude: 75.91988 },
  { name: 'Crown Convention', district: 'Malappuram', latitude: 10.93291, longitude: 75.90771 },
  { name: 'Red Rose', district: 'Malappuram', latitude: 10.90936, longitude: 75.96259 },
  { name: 'Enayat Convention', district: 'Malappuram', latitude: 10.89225, longitude: 75.89452 },
  { name: 'Amanath', district: 'Malappuram', latitude: 10.92106, longitude: 75.95096 },
  { name: 'MK Convention', district: 'Malappuram', latitude: 11.13578, longitude: 75.93982 },
  { name: 'Rozia International', district: 'Malappuram', latitude: 11.13979, longitude: 75.9797 },
  { name: 'Zawaj Convention', district: 'Malappuram', latitude: 11.14523, longitude: 75.96226 },
  { name: 'Eden Convention', district: 'Malappuram', latitude: 11.31238, longitude: 76.2134 },
  { name: 'Maharaja', district: 'Malappuram', latitude: 11.28339, longitude: 76.24882 },
  { name: 'KS Convention', district: 'Malappuram', latitude: 11.24644, longitude: 76.20254 },
  { name: 'The Vaz', district: 'Malappuram', latitude: 11.2519, longitude: 76.20238 },
  { name: 'Levante Convention', district: 'Malappuram', latitude: 11.3231, longitude: 76.31444 },
  { name: 'Vaheeda', district: 'Malappuram', latitude: 10.7812, longitude: 75.92701 },
  { name: 'RV Hall', district: 'Malappuram', latitude: 10.78189, longitude: 75.92908 },
  { name: 'RV Palace', district: 'Malappuram', latitude: 10.78897, longitude: 75.94919 },
  { name: 'Maas Complex', district: 'Malappuram', latitude: 10.78244, longitude: 75.93135 },
  { name: 'Mother Plaza', district: 'Malappuram', latitude: 10.75999, longitude: 75.96823 },
  { name: 'Eventz Square', district: 'Malappuram', latitude: 10.90559, longitude: 76.04005 },
  { name: 'Nadhas Convention', district: 'Malappuram', latitude: 10.89857, longitude: 76.0776 },
  { name: 'Olive International', district: 'Malappuram', latitude: 10.86515, longitude: 76.03852 },
  { name: 'Parakkal Convention', district: 'Malappuram', latitude: 10.90255, longitude: 76.05822 },
  { name: 'Sagar Auditorium', district: 'Malappuram', latitude: 10.90178, longitude: 76.05819 },
  { name: 'OPS Royal', district: 'Malappuram', latitude: 11.0052, longitude: 76.01653 },
  { name: 'BNK Convention', district: 'Malappuram', latitude: 10.97839, longitude: 76.00147 },
  { name: 'KNG Convention', district: 'Malappuram', latitude: 10.98182, longitude: 75.98859 },
  { name: 'Koyas Convention', district: 'Malappuram', latitude: 11.0047, longitude: 76.02992 },
  { name: 'VVK Convention', district: 'Malappuram', latitude: 10.75322, longitude: 76.02165 },
  { name: 'Ansari Convention', district: 'Malappuram', latitude: 10.78211, longitude: 76.00961 },
  { name: 'Viva Palace', district: 'Malappuram', latitude: 10.77389, longitude: 76.01556 },
  { name: 'Kadeeja Convention', district: 'Malappuram', latitude: 10.77303, longitude: 75.99609 },
  { name: 'Sun City Convention', district: 'Malappuram', latitude: 11.23409, longitude: 76.0438 },
  { name: 'Royal Grand', district: 'Malappuram', latitude: 11.24941, longitude: 76.00624 },
  { name: 'Vibgyor Auditorium', district: 'Malappuram', latitude: 11.2391, longitude: 76.00818 },
  { name: 'KT Convention', district: 'Malappuram', latitude: 11.17817, longitude: 76.23452 },
  { name: 'Sienna Auditorium', district: 'Malappuram', latitude: 11.19362, longitude: 76.24163 }
];

async function main() {
  console.log('Seeding manual venues...');
  
  await prisma.venue.deleteMany({});
  console.log('Cleared existing venues.');

  await prisma.venue.createMany({
    data: manualVenues
  });

  console.log(`Inserted ${manualVenues.length} manual venues successfully.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
