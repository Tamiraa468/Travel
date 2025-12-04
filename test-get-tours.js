// Test script to verify getAllTours works
const { PrismaClient } = require('@prisma/client');

async function testGetAllTours() {
  const prisma = new PrismaClient();
  
  try {
    console.log("Testing getAllTours...");
    const tours = await prisma.tour.findMany({
      include: { dates: true, bookings: true },
      orderBy: { createdAt: "desc" },
    });
    
    console.log("✓ Success! Found tours:", tours.length);
    console.log(JSON.stringify(tours, null, 2));
    
  } catch (error) {
    console.error("✗ Error:", error.message);
    console.error("Full error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testGetAllTours();
