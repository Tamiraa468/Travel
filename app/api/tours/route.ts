import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { cacheGet, CacheKeys, invalidateTourCaches } from "@/lib/cache";
import {
  withRateLimit,
  addRateLimitHeaders,
  createRateLimitResponse,
} from "@/lib/rate-limit";
import { encodeId } from "@/lib/id-encoder";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

// Type for tour with encoded ID
type TourWithEncodedId = {
  encodedId: string;
  [key: string]: unknown;
};

export async function GET(req: NextRequest) {
  // Rate limiting - public endpoint
  const rateLimitResult = await withRateLimit(req, "tours-list", "PUBLIC");
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    // Read-through cache with 5 minute TTL
    const tours = await cacheGet(
      CacheKeys.TOURS_LIST(),
      async () => {
        const data = await prisma.tour.findMany({
          include: { dates: true },
          orderBy: { createdAt: "desc" },
        });
        // Encode IDs before caching (hide raw DB IDs)
        return data.map((tour) => ({
          ...tour,
          encodedId: encodeId(tour.id),
        })) as TourWithEncodedId[];
      },
      300, // 5 minutes TTL
    );

    const response = NextResponse.json(tours);
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    console.error("GET /api/tours error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch tours" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  // Rate limiting - admin endpoint
  const session = await getSession();
  const rateLimitResult = await withRateLimit(
    req,
    "tours-create",
    session?.isAdmin ? "ADMIN" : "PUBLIC",
    session?.email,
  );
  if (!rateLimitResult.success) {
    return createRateLimitResponse(rateLimitResult);
  }

  try {
    // Auth check - only admins can create tours
    if (!session?.isAdmin) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { title, slug, description, price, duration, images = [] } = body;
    const tour = await prisma.tour.create({
      data: {
        title,
        slug,
        description,
        price: Number(price),
        duration: Number(duration),
        images,
      },
    });

    // Invalidate tour list caches after creation
    await invalidateTourCaches(tour.id, tour.slug);

    const response = NextResponse.json(
      { ok: true, data: { ...tour, encodedId: encodeId(tour.id) } },
      { status: 201 },
    );
    return addRateLimitHeaders(response, rateLimitResult);
  } catch (error) {
    console.error("POST /api/tours error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create tour" },
      { status: 500 },
    );
  }
}
