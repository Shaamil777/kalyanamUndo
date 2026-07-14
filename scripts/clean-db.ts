import prisma from '../lib/prisma';

async function main() {
  console.log('Cleaning database...');
  await prisma.wedding.deleteMany();
  await prisma.venue.deleteMany();
  console.log('Database cleaned successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
