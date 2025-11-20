const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const tours = await prisma.tour.findMany();
    console.log('Total tours in database:', tours.length);
    tours.forEach(tour => {
      console.log(`- ${tour.title} (${tour.slug})`);
    });
  } catch (error) {
    console.error('Database error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
