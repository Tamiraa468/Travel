import prisma from "@/lib/prisma";

// Re-export client-safe types and helpers so existing server-side imports still work
export type { TourListItem } from "@/lib/tour-image";
export { resolveTourImage } from "@/lib/tour-image";

type GetToursOptions = {
  page?: number;
  pageSize?: number;
  categoryId?: string | null;
  /** Only return active tours */
  activeOnly?: boolean;
};

/**
 * Server-only function to fetch paginated tours from the database.
 * Used by the /tours Server Component for ISR rendering.
 */
export async function getToursPaginated({
  page = 1,
  pageSize = 9,
  categoryId = null,
  activeOnly = true,
}: GetToursOptions = {}) {
  const where: Record<string, unknown> = {};
  if (activeOnly) where.isActive = true;
  if (categoryId) where.categoryId = categoryId;

  const [tours, totalCount] = await Promise.all([
    prisma.tour.findMany({
      where,
      select: {
        id: true,
        title: true,
        slug: true,
        priceFrom: true,
        days: true,
        mainImage: true,
        mainImageUrl: true,
        description: true,
        isFeatured: true,
        category: {
          select: { id: true, name: true, slug: true },
        },
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.tour.count({ where }),
  ]);

  return {
    tours: tours as TourListItem[],
    totalCount,
    page,
    pageSize,
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

/**
 * Fetch all active tour categories with tour counts.
 */
export async function getTourCategories() {
  return prisma.tourCategory.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { tours: true } },
    },
    orderBy: { order: "asc" },
  });
}

/**
 * Fetch a single tour by slug (or id fallback) with all relations.
 * Uses Redis read-through cache (10-minute TTL).
 * Called from the [slug] detail page with ISR.
 */
export async function getTourBySlug(slug: string) {
  const { cacheGet, CacheKeys } = await import("@/lib/cache");

  return cacheGet(
    CacheKeys.TOUR_BY_SLUG(slug),
    async () => {
      // Try slug first
      let tour = await prisma.tour.findUnique({
        where: { slug },
        include: {
          dates: true,
          category: true,
          itinerary: { orderBy: { dayNumber: "asc" } },
          priceTiers: { orderBy: { minPax: "asc" } },
        },
      });

      // Fallback to id
      if (!tour) {
        tour = await prisma.tour.findUnique({
          where: { id: slug },
          include: {
            dates: true,
            category: true,
            itinerary: { orderBy: { dayNumber: "asc" } },
            priceTiers: { orderBy: { minPax: "asc" } },
          },
        });
      }

      return tour;
    },
    600, // 10-minute Redis TTL
  );
}

/**
 * Fetch related tours for a given tour (same category or similar duration).
 * Used by the tour detail page sidebar.
 */
export async function getRelatedTours(
  tourId: string,
  categoryId: string | null,
  days: number,
) {
  return prisma.tour.findMany({
    where: {
      isActive: true,
      id: { not: tourId },
      OR: [
        ...(categoryId ? [{ categoryId }] : []),
        { days: { gte: days - 2, lte: days + 2 } },
      ],
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Return all active tour slugs for generateStaticParams (ISR pre-rendering).
 */
export async function getAllTourSlugs(): Promise<string[]> {
  const tours = await prisma.tour.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return tours.map((t) => t.slug).filter(Boolean);
}
