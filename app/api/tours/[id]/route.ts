/**
 * Tour by Encoded ID API Route
 * Demonstrates decoding URL-safe tokens back to database IDs
 */
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { cacheGet, CacheKeys, invalidateTourCaches } from "@/lib/cache";
import {
  withRateLimit,
  addRateLimitHeaders,
  createRateLimitResponse,
} from "@/lib/rate-limit";
import { decodeId, encodeId, validateEncodedId } from "@/lib/id-encoder";

type Params = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Params) {
  // Rate limiting
  const rateLimitResult = await withRateLimit(req, "tour-detail", "PUBLIC");
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  // Decode the URL token to get the real database ID
  const { valid, id, error } = validateEncodedId(params.id);
  if (!valid || !id) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  try {
    // Read-through cache
    const tour = await cacheGet(
      CacheKeys.TOUR(id),
      async () => {
        return prisma.tour.findUnique({
          where: { id },
          include: {
            dates: true,
            itinerary: { orderBy: { dayNumber: "asc" } },
            priceTiers: { orderBy: { minPax: "asc" } },
            category: true,
          },
        });
      },
      600, // 10 minute TTL for individual tours
    );

    if (!tour) {
      return NextResponse.json(
        { ok: false, error: "Tour not found" },
        { status: 404 },
      );
    }

    // Return tour with encoded ID (never expose raw DB ID)
    const response = NextResponse.json({
      ok: true,
      data: { ...tour, encodedId: encodeId(tour.id), id: undefined },
    });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    console.error("GET /api/tours/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch tour" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  // Decode ID first
  const { valid, id, error } = validateEncodedId(params.id);
  if (!valid || !id) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  // Auth and rate limiting
  const session = await getSession();
  const rateLimitResult = await withRateLimit(
    req,
    "tour-update",
    session?.isAdmin ? "ADMIN" : "PUBLIC",
    session?.email,
  );
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  if (!session?.isAdmin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();

    // Get existing tour for cache invalidation
    const existing = await prisma.tour.findUnique({
      where: { id },
      select: { slug: true, categoryId: true },
    });

    const tour = await prisma.tour.update({
      where: { id },
      data: body,
    });

    // Invalidate caches (old slug, new slug, category)
    await invalidateTourCaches(
      id,
      existing?.slug,
      existing?.categoryId || undefined,
    );
    if (tour.slug !== existing?.slug) {
      await invalidateTourCaches(id, tour.slug, tour.categoryId || undefined);
    }

    const response = NextResponse.json({
      ok: true,
      data: { ...tour, encodedId: encodeId(tour.id), id: undefined },
    });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    console.error("PUT /api/tours/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update tour" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  // Decode ID
  const { valid, id, error } = validateEncodedId(params.id);
  if (!valid || !id) {
    return NextResponse.json({ ok: false, error }, { status: 400 });
  }

  // Auth and rate limiting
  const session = await getSession();
  const rateLimitResult = await withRateLimit(
    req,
    "tour-delete",
    session?.isAdmin ? "ADMIN" : "PUBLIC",
    session?.email,
  );
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  if (!session?.isAdmin) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    // Get tour for cache invalidation before delete
    const tour = await prisma.tour.findUnique({
      where: { id },
      select: { slug: true, categoryId: true },
    });

    await prisma.tour.delete({ where: { id } });

    // Invalidate all related caches
    if (tour) {
      await invalidateTourCaches(id, tour.slug, tour.categoryId || undefined);
    }

    const response = NextResponse.json({ ok: true });
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    console.error("DELETE /api/tours/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete tour" },
      { status: 500 },
    );
  }
}
