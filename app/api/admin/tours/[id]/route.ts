/**
 * Admin Tour API Route
 * Handles GET, PUT, DELETE operations for individual tours
 * All routes require admin authentication
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { updateTourSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

type Params = { params: { id: string } };

/**
 * Helper: Verify admin authentication
 */
async function requireAdmin() {
  const session = await getSession();
  if (!session?.isAdmin) {
    return { authorized: false, error: "Unauthorized: Admin access required" };
  }
  return { authorized: true, session };
}

/**
 * GET /api/admin/tours/[id]
 * Fetch a single tour with all related data
 */
export async function GET(req: NextRequest, { params }: Params) {
  // Admin auth check
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  try {
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      include: {
        dates: {
          orderBy: { startDate: "asc" },
        },
        itinerary: {
          orderBy: { dayNumber: "asc" },
        },
        priceTiers: {
          orderBy: { minPax: "asc" },
        },
        category: true,
      },
    });

    if (!tour) {
      return NextResponse.json(
        { ok: false, error: "Tour not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, data: tour });
  } catch (error) {
    console.error("GET /api/admin/tours/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch tour" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/admin/tours/[id]
 * Update a tour with all related data (itinerary, price tiers)
 */
export async function PUT(req: NextRequest, { params }: Params) {
  // Admin auth check
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Separate nested data from main tour data
    const { itinerary, priceTiers, dates, category, ...tourData } = body;

    // Validate main tour data
    const parseResult = updateTourSchema.safeParse(tourData);
    if (!parseResult.success) {
      const errors = parseResult.error.flatten().fieldErrors;
      return NextResponse.json(
        { ok: false, error: "Validation failed", details: errors },
        { status: 400 },
      );
    }

    const validated = parseResult.data;

    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({
      where: { id: params.id },
      select: { id: true, slug: true },
    });

    if (!existingTour) {
      return NextResponse.json(
        { ok: false, error: "Tour not found" },
        { status: 404 },
      );
    }

    // Check for slug uniqueness if slug is being changed
    if (validated.slug && validated.slug !== existingTour.slug) {
      const slugExists = await prisma.tour.findFirst({
        where: {
          slug: validated.slug,
          id: { not: params.id },
        },
      });

      if (slugExists) {
        return NextResponse.json(
          { ok: false, error: "A tour with this slug already exists" },
          { status: 400 },
        );
      }
    }

    // Use transaction to update tour and related data atomically
    const updatedTour = await prisma.$transaction(async (tx) => {
      // Update main tour data
      const tour = await tx.tour.update({
        where: { id: params.id },
        data: {
          ...validated,
          // Clean arrays - filter empty strings
          images: validated.images?.filter(Boolean) || [],
          includes: validated.includes?.filter(Boolean) || [],
          excludes: validated.excludes?.filter(Boolean) || [],
          highlights: validated.highlights?.filter(Boolean) || [],
          updatedAt: new Date(),
        },
      });

      // Update itinerary if provided
      if (itinerary && Array.isArray(itinerary)) {
        // Delete existing itinerary
        await tx.tourItinerary.deleteMany({
          where: { tourId: params.id },
        });

        // Create new itinerary
        if (itinerary.length > 0) {
          await tx.tourItinerary.createMany({
            data: itinerary.map((day: any) => ({
              tourId: params.id,
              dayNumber: day.dayNumber,
              title: day.title || "",
              description: day.description || "",
              meals: day.meals || null,
              accommodation: day.accommodation || null,
              highlights: day.highlights?.filter(Boolean) || [],
            })),
          });
        }
      }

      // Update price tiers if provided
      if (priceTiers && Array.isArray(priceTiers)) {
        // Delete existing price tiers
        await tx.tourPriceTier.deleteMany({
          where: { tourId: params.id },
        });

        // Create new price tiers
        if (priceTiers.length > 0) {
          await tx.tourPriceTier.createMany({
            data: priceTiers
              .filter((tier: any) => tier.pricePerPerson > 0)
              .map((tier: any) => ({
                tourId: params.id,
                minPax: tier.minPax,
                maxPax: tier.maxPax,
                pricePerPerson: tier.pricePerPerson,
                description: tier.description || null,
              })),
          });
        }
      }

      // Return updated tour with all relations
      return await tx.tour.findUnique({
        where: { id: params.id },
        include: {
          dates: { orderBy: { startDate: "asc" } },
          itinerary: { orderBy: { dayNumber: "asc" } },
          priceTiers: { orderBy: { minPax: "asc" } },
          category: true,
        },
      });
    });

    // Revalidate paths
    revalidatePath("/admin/tours");
    revalidatePath(`/admin/tours/${params.id}/edit`);
    revalidatePath("/tours");
    if (updatedTour?.slug) {
      revalidatePath(`/tours/${updatedTour.slug}`);
    }

    return NextResponse.json({ ok: true, data: updatedTour });
  } catch (error) {
    console.error("PUT /api/admin/tours/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update tour" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/tours/[id]
 * Delete a tour and all related data
 */
export async function DELETE(req: NextRequest, { params }: Params) {
  // Admin auth check
  const auth = await requireAdmin();
  if (!auth.authorized) {
    return NextResponse.json({ ok: false, error: auth.error }, { status: 401 });
  }

  try {
    // Check if tour exists
    const tour = await prisma.tour.findUnique({
      where: { id: params.id },
      select: { id: true, slug: true, title: true },
    });

    if (!tour) {
      return NextResponse.json(
        { ok: false, error: "Tour not found" },
        { status: 404 },
      );
    }

    // Delete tour (cascade will handle itinerary and price tiers)
    // Need to manually delete bookings and dates first due to relations
    await prisma.$transaction(async (tx) => {
      // Delete bookings
      await tx.booking.deleteMany({
        where: { tourId: params.id },
      });

      // Delete tour dates
      await tx.tourDate.deleteMany({
        where: { tourId: params.id },
      });

      // Delete tour (itinerary and price tiers cascade)
      await tx.tour.delete({
        where: { id: params.id },
      });
    });

    // Revalidate paths
    revalidatePath("/admin/tours");
    revalidatePath("/tours");

    return NextResponse.json({
      ok: true,
      message: `Tour "${tour.title}" deleted successfully`,
    });
  } catch (error) {
    console.error("DELETE /api/admin/tours/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete tour" },
      { status: 500 },
    );
  }
}
