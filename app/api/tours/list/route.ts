import { NextRequest, NextResponse } from "next/server";
import { getToursPaginated } from "@/lib/tours";

/**
 * Public API for paginated tour listing.
 * Used by the "Load More" client component after the first server-rendered page.
 *
 * GET /api/tours/list?page=2&pageSize=9&categoryId=xxx
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      24,
      Math.max(1, parseInt(searchParams.get("pageSize") || "9", 10)),
    );
    const categoryId = searchParams.get("categoryId") || null;

    const result = await getToursPaginated({ page, pageSize, categoryId });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/tours/list error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tours" },
      { status: 500 },
    );
  }
}
