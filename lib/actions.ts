"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  createTourSchema,
  updateTourSchema,
  tourDateSchema,
} from "@/lib/validation";
import { getSession } from "@/lib/auth";

/**
 * Verify admin is authenticated
 */
async function requireAdmin() {
  const session = await getSession();
  console.log("Session in requireAdmin:", JSON.stringify(session));
  if (!session?.isAdmin) {
    console.warn("Admin check failed - session:", session);
    throw new Error("Unauthorized: Admin access required");
  }
}

// ===== TOUR ACTIONS =====

export async function createTour(data: any) {
  await requireAdmin();

  // Separate itinerary and priceTiers from main tour data
  const { itinerary, priceTiers, ...tourData } = data;
  const validated = createTourSchema.parse(tourData);

  const tour = await prisma.tour.create({
    data: {
      ...validated,
      images: validated.images || [],
      includes: validated.includes || [],
      highlights: validated.highlights || [],
      // Create itinerary days if provided
      ...(itinerary &&
        itinerary.length > 0 && {
          itinerary: {
            create: itinerary.map((day: any) => ({
              dayNumber: day.dayNumber,
              title: day.title,
              description: day.description,
              meals: day.meals || null,
              accommodation: day.accommodation || null,
              highlights: day.highlights?.filter(Boolean) || [],
            })),
          },
        }),
      // Create price tiers if provided
      ...(priceTiers &&
        priceTiers.length > 0 && {
          priceTiers: {
            create: priceTiers.map((tier: any) => ({
              minPax: tier.minPax,
              maxPax: tier.maxPax,
              pricePerPerson: tier.pricePerPerson,
              description: tier.description || null,
            })),
          },
        }),
    },
    include: {
      itinerary: {
        orderBy: { dayNumber: "asc" },
      },
      priceTiers: true,
    },
  });

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
  return tour;
}

export async function updateTour(id: string, data: any) {
  await requireAdmin();

  // Separate itinerary and priceTiers from main tour data
  const { itinerary, priceTiers, ...tourData } = data;
  const validated = updateTourSchema.parse(tourData);

  // Use transaction to update tour, itinerary, and price tiers together
  const tour = await prisma.$transaction(async (tx) => {
    // Update the tour
    const updatedTour = await tx.tour.update({
      where: { id },
      data: validated,
    });

    // If itinerary is provided, update it
    if (itinerary && Array.isArray(itinerary)) {
      // Delete existing itinerary
      await tx.tourItinerary.deleteMany({
        where: { tourId: id },
      });

      // Create new itinerary
      if (itinerary.length > 0) {
        await tx.tourItinerary.createMany({
          data: itinerary.map((day: any) => ({
            tourId: id,
            dayNumber: day.dayNumber,
            title: day.title,
            description: day.description,
            meals: day.meals || null,
            accommodation: day.accommodation || null,
            highlights: day.highlights?.filter(Boolean) || [],
          })),
        });
      }
    }

    // If price tiers are provided, update them
    if (priceTiers && Array.isArray(priceTiers)) {
      // Delete existing price tiers
      await tx.tourPriceTier.deleteMany({
        where: { tourId: id },
      });

      // Create new price tiers
      if (priceTiers.length > 0) {
        await tx.tourPriceTier.createMany({
          data: priceTiers.map((tier: any) => ({
            tourId: id,
            minPax: tier.minPax,
            maxPax: tier.maxPax,
            pricePerPerson: tier.pricePerPerson,
            description: tier.description || null,
          })),
        });
      }
    }

    // Return tour with itinerary and price tiers
    return await tx.tour.findUnique({
      where: { id },
      include: {
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
        priceTiers: true,
      },
    });
  });

  revalidatePath("/admin/tours");
  revalidatePath(`/admin/tours/${id}/edit`);
  revalidatePath("/tours");
  revalidatePath(`/tours/${validated.slug || id}`);
  return tour;
}

export async function deleteTour(id: string) {
  await requireAdmin();

  // Delete related records first
  await prisma.booking.deleteMany({
    where: { tourId: id },
  });

  await prisma.tourDate.deleteMany({
    where: { tourId: id },
  });

  // Itinerary and price tiers will be deleted automatically due to onDelete: Cascade

  await prisma.tour.delete({
    where: { id },
  });

  revalidatePath("/admin/tours");
  revalidatePath("/tours");
}

export async function getTourById(id: string) {
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: {
      dates: true,
      itinerary: {
        orderBy: { dayNumber: "asc" },
      },
      priceTiers: true,
    },
  });
  return tour;
}

export async function getAllTours() {
  try {
    console.log("getAllTours called");

    // First, try a simple query without includes
    const toursSimple = await prisma.tour.findMany({
      orderBy: { createdAt: "desc" },
    });
    console.log("Simple query returned:", toursSimple.length, "tours");

    // Then try with includes
    const tours = await prisma.tour.findMany({
      include: {
        dates: true,
        bookings: true,
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
        priceTiers: true,
      },
      orderBy: { createdAt: "desc" },
    });
    console.log("Query with includes returned:", tours.length, "tours");
    console.log("getAllTours SUCCESS:", tours.length, "tours found");

    return tours;
  } catch (error) {
    console.error("getAllTours ERROR:", error);
    console.error(
      "Error details:",
      error instanceof Error ? error.message : String(error),
    );
    throw error;
  }
}

// ===== ITINERARY ACTIONS =====

export async function createItineraryDay(tourId: string, data: any) {
  await requireAdmin();

  const itineraryDay = await prisma.tourItinerary.create({
    data: {
      tourId,
      dayNumber: data.dayNumber,
      title: data.title,
      description: data.description,
      meals: data.meals || null,
      accommodation: data.accommodation || null,
      highlights: data.highlights?.filter(Boolean) || [],
    },
  });

  revalidatePath(`/admin/tours/${tourId}/edit`);
  revalidatePath("/tours");
  return itineraryDay;
}

export async function updateItineraryDay(id: string, data: any) {
  await requireAdmin();

  const itineraryDay = await prisma.tourItinerary.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      meals: data.meals || null,
      accommodation: data.accommodation || null,
      highlights: data.highlights?.filter(Boolean) || [],
    },
  });

  const tour = await prisma.tourItinerary.findUnique({
    where: { id },
    select: { tourId: true },
  });

  if (tour) {
    revalidatePath(`/admin/tours/${tour.tourId}/edit`);
    revalidatePath("/tours");
  }

  return itineraryDay;
}

export async function deleteItineraryDay(id: string) {
  await requireAdmin();

  const itinerary = await prisma.tourItinerary.findUnique({
    where: { id },
    select: { tourId: true },
  });

  await prisma.tourItinerary.delete({
    where: { id },
  });

  if (itinerary) {
    revalidatePath(`/admin/tours/${itinerary.tourId}/edit`);
    revalidatePath("/tours");
  }
}

export async function getItineraryByTourId(tourId: string) {
  return await prisma.tourItinerary.findMany({
    where: { tourId },
    orderBy: { dayNumber: "asc" },
  });
}

// ===== PRICE TIER ACTIONS =====

export async function createPriceTier(tourId: string, data: any) {
  await requireAdmin();

  const priceTier = await prisma.tourPriceTier.create({
    data: {
      tourId,
      minPax: data.minPax,
      maxPax: data.maxPax,
      pricePerPerson: data.pricePerPerson,
      description: data.description || null,
    },
  });

  revalidatePath(`/admin/tours/${tourId}/edit`);
  revalidatePath("/tours");
  return priceTier;
}

export async function updatePriceTier(id: string, data: any) {
  await requireAdmin();

  const priceTier = await prisma.tourPriceTier.update({
    where: { id },
    data: {
      minPax: data.minPax,
      maxPax: data.maxPax,
      pricePerPerson: data.pricePerPerson,
      description: data.description || null,
    },
  });

  const tour = await prisma.tourPriceTier.findUnique({
    where: { id },
    select: { tourId: true },
  });

  if (tour) {
    revalidatePath(`/admin/tours/${tour.tourId}/edit`);
    revalidatePath("/tours");
  }

  return priceTier;
}

export async function deletePriceTier(id: string) {
  await requireAdmin();

  const priceTier = await prisma.tourPriceTier.findUnique({
    where: { id },
    select: { tourId: true },
  });

  await prisma.tourPriceTier.delete({
    where: { id },
  });

  if (priceTier) {
    revalidatePath(`/admin/tours/${priceTier.tourId}/edit`);
    revalidatePath("/tours");
  }
}

export async function getPriceTiersByTourId(tourId: string) {
  return await prisma.tourPriceTier.findMany({
    where: { tourId },
    orderBy: { minPax: "asc" },
  });
}

// ===== TOUR DATE ACTIONS =====

export async function createTourDate(tourId: string, data: any) {
  await requireAdmin();
  const validated = tourDateSchema.parse(data);

  const tourDate = await prisma.tourDate.create({
    data: {
      ...validated,
      tourId,
    },
  });

  revalidatePath(`/admin/tours/${tourId}/edit`);
  return tourDate;
}

export async function deleteTourDate(id: string) {
  await requireAdmin();

  // Check for bookings
  const bookings = await prisma.booking.findMany({
    where: { tourDateId: id },
  });

  if (bookings.length > 0) {
    throw new Error("Cannot delete tour date with existing bookings");
  }

  const tourDate = await prisma.tourDate.findUnique({
    where: { id },
  });

  await prisma.tourDate.delete({
    where: { id },
  });

  if (tourDate) {
    revalidatePath(`/admin/tours/${tourDate.tourId}/edit`);
  }
}

// ===== BOOKING ACTIONS =====

export async function getAllBookings() {
  return await prisma.booking.findMany({
    include: {
      customer: true,
      tour: true,
      tourDate: true,
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookingById(id: string) {
  return await prisma.booking.findUnique({
    where: { id },
    include: {
      customer: true,
      tour: true,
      tourDate: true,
      payment: true,
    },
  });
}

export async function confirmBooking(id: string) {
  await requireAdmin();

  return await prisma.booking.update({
    where: { id },
    data: { status: "CONFIRMED" },
  });
}

export async function cancelBooking(id: string) {
  await requireAdmin();

  return await prisma.booking.update({
    where: { id },
    data: { status: "CANCELLED" },
  });
}

// ===== PAYMENT ACTIONS =====

export async function getAllPayments() {
  return await prisma.payment.findMany({
    include: { booking: { include: { tour: true, customer: true } } },
    orderBy: { createdAt: "desc" },
  });
}

// ===== DASHBOARD STATS =====

export async function getDashboardStats() {
  const [totalBookings, totalPayments, totalTours, totalCustomers] =
    await Promise.all([
      prisma.booking.count(),
      prisma.payment.count({ where: { status: "PAID" } }),
      prisma.tour.count(),
      prisma.customer.count(),
    ]);

  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { customer: true, tour: true },
  });

  return {
    totalBookings,
    totalPayments,
    totalTours,
    totalCustomers,
    recentBookings,
  };
}
