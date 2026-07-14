import { PrismaClient } from '@prisma/client';

// Wait, the client is generated in lib/generated/prisma
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { PrismaClient: CustomPrismaClient } = require('./lib/generated/prisma/index.js');

const prisma = new CustomPrismaClient();

async function main() {
  console.log('Cleaning database...');
  
  // Delete all weddings first (due to foreign key constraints)
  const deletedWeddings = await prisma.wedding.deleteMany();
  console.log(`Deleted ${deletedWeddings.count} weddings.`);
  
  // Delete all venues
  const deletedVenues = await prisma.venue.deleteMany();
  console.log(`Deleted ${deletedVenues.count} venues.`);
  
  console.log('Database cleaned successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
