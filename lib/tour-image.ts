/**
 * Client-safe tour image utilities.
 *
 * This module is intentionally free of server-only imports (prisma, redis, etc.)
 * so it can be imported from "use client" components without pulling in Node.js
 * modules like ioredis that break the webpack client bundle.
 */

/**
 * Minimal tour shape for list pages (cards).
 * Only contains fields needed for rendering — keeps payload small.
 */
export type TourListItem = {
  id: string;
  title: string;
  slug: string;
  priceFrom: number;
  days: number;
  mainImage: string | null;
  mainImageUrl: string | null;
  description: string | null;
  location?: string;
  isFeatured: boolean;
  category: { id: string; name: string; slug: string } | null;
};

/**
 * Resolve the best available image for a tour.
 * Priority: mainImageUrl (Cloudinary) > mainImage (legacy, non-base64 only).
 * Base64 data URIs are never returned — they bloat SSR output.
 */
export function resolveTourImage(
  tour: { mainImageUrl?: string | null; mainImage?: string | null } | null,
): string | null {
  if (!tour) return null;
  if (tour.mainImageUrl) return tour.mainImageUrl;
  // Only use legacy mainImage if it's a real URL (not base64)
  if (tour.mainImage && !tour.mainImage.startsWith("data:"))
    return tour.mainImage;
  return null;
}
