import prisma from "@/lib/prisma";

/**
 * Minimal tour shape for list pages (cards).
 * Only selects fields needed for rendering — keeps payload small.
 */
export type TourListItem = {
  id: string;
  title: string;
  slug: string;
  priceFrom: number;
  days: number;
  mainImage: string | null;
  description: string | null;
  location?: string;
  isFeatured: boolean;
  category: { id: string; name: string; slug: string } | null;
};

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
