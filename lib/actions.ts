"use server";

import prisma from "@/lib/prisma";
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
  if (!session?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
}

// ===== TOUR ACTIONS =====

export async function createTour(data: any) {
  await requireAdmin();
  const validated = createTourSchema.parse(data);

  return await prisma.tour.create({
    data: {
      ...validated,
      images: validated.images || [],
      includes: validated.includes || [],
      highlights: validated.highlights || [],
    },
  });
}

export async function updateTour(id: string, data: any) {
  await requireAdmin();
  const validated = updateTourSchema.parse(data);

  return await prisma.tour.update({
    where: { id },
    data: validated,
  });
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

  return await prisma.tour.delete({
    where: { id },
  });
}

export async function getTourById(id: string) {
  const tour = await prisma.tour.findUnique({
    where: { id },
    include: { dates: true },
  });
  return tour;
}

export async function getAllTours() {
  return await prisma.tour.findMany({
    include: { dates: true, bookings: true },
    orderBy: { createdAt: "desc" },
  });
}

// ===== TOUR DATE ACTIONS =====

export async function createTourDate(tourId: string, data: any) {
  await requireAdmin();
  const validated = tourDateSchema.parse(data);

  return await prisma.tourDate.create({
    data: {
      ...validated,
      tourId,
    },
  });
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

  return await prisma.tourDate.delete({
    where: { id },
  });
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
