/**
 * Redis Cache Layer
 * Implements read-through caching with TTL and invalidation
 * Gracefully falls back to no caching when Redis is unavailable
 */
import redis, { isRedisCacheEnabled } from "./redis";

// Default TTL in seconds (5 minutes)
const DEFAULT_TTL = 300;

// Cache key prefixes for organization
export const CacheKeys = {
  // Tour-related keys
  TOUR: (id: string) => `tour:${id}`,
  TOUR_BY_SLUG: (slug: string) => `tour:slug:${slug}`,
  TOURS_LIST: (page?: number, limit?: number) =>
    `tours:list:${page || "all"}:${limit || "all"}`,
  TOURS_FEATURED: () => `tours:featured`,
  TOURS_BY_CATEGORY: (categoryId: string) => `tours:category:${categoryId}`,

  // Category keys
  CATEGORY: (id: string) => `category:${id}`,
  CATEGORIES_LIST: () => `categories:list`,

  // Blog keys
  BLOG_POST: (id: string) => `blog:${id}`,
  BLOG_LIST: (page?: number) => `blog:list:${page || "all"}`,

  // Settings/content
  SETTINGS: (key: string) => `settings:${key}`,
  FAQ_LIST: () => `faq:list`,
  TESTIMONIALS: () => `testimonials:list`,
} as const;

/**
 * Get cached value or fetch from source (read-through pattern)
 * @param key - Cache key
 * @param fetcher - Async function to fetch data if cache miss
 * @param ttl - Time to live in seconds
 */
export async function cacheGet<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = DEFAULT_TTL,
): Promise<T> {
  // Skip cache if Redis is not available
  if (!isRedisCacheEnabled() || !redis) {
    return fetcher();
  }

  try {
    // Try to get from cache first
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (error) {
    // Log but don't fail - fallback to database
    console.warn(`[Cache] Read error for key ${key}:`, error);
    return fetcher();
  }

  // Cache miss - fetch from source
  const data = await fetcher();

  // Store in cache (fire and forget, don't block response)
  setCache(key, data, ttl).catch((err) =>
    console.warn(`[Cache] Write error for key ${key}:`, err),
  );

  return data;
}

/**
 * Set cache value with TTL
 */
export async function setCache<T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL,
): Promise<void> {
  // Skip if Redis not available
  if (!isRedisCacheEnabled() || !redis) {
    return;
  }

  try {
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.warn(`[Cache] Set error for key ${key}:`, error);
  }
}

/**
 * Delete specific cache key
 */
export async function invalidateCache(key: string): Promise<void> {
  try {
    await redis.del(key);
  } catch (error) {
    console.warn(`[Cache] Invalidate error for key ${key}:`, error);
  }
}

/**
 * Delete multiple cache keys by pattern
 * Use with caution - SCAN is O(N) operation
 */
export async function invalidateCachePattern(pattern: string): Promise<void> {
  try {
    let cursor = "0";
    const keysToDelete: string[] = [];

    // Use SCAN to safely iterate without blocking
    do {
      const [newCursor, keys] = await redis.scan(
        cursor,
        "MATCH",
        pattern,
        "COUNT",
        100,
      );
      cursor = newCursor;
      keysToDelete.push(...keys);
    } while (cursor !== "0");

    // Delete in batches using pipeline
    if (keysToDelete.length > 0) {
      const pipeline = redis.pipeline();
      keysToDelete.forEach((key) => pipeline.del(key));
      await pipeline.exec();
    }
  } catch (error) {
    console.warn(`[Cache] Pattern invalidate error for ${pattern}:`, error);
  }
}

/**
 * Invalidate all tour-related caches
 * Call this on tour create/update/delete
 */
export async function invalidateTourCaches(
  tourId?: string,
  slug?: string,
  categoryId?: string,
): Promise<void> {
  const keysToInvalidate: string[] = [];

  // Specific tour caches
  if (tourId) keysToInvalidate.push(CacheKeys.TOUR(tourId));
  if (slug) keysToInvalidate.push(CacheKeys.TOUR_BY_SLUG(slug));

  // Category-specific list
  if (categoryId)
    keysToInvalidate.push(CacheKeys.TOURS_BY_CATEGORY(categoryId));

  // Featured tours (might have changed)
  keysToInvalidate.push(CacheKeys.TOURS_FEATURED());

  // Delete specific keys
  if (keysToInvalidate.length > 0) {
    try {
      await redis.del(...keysToInvalidate);
    } catch (error) {
      console.warn("[Cache] Tour invalidation error:", error);
    }
  }

  // Invalidate all list caches (paginated)
  await invalidateCachePattern("tours:list:*");
}

/**
 * Cache warming utility - preload frequently accessed data
 */
export async function warmCache<T>(
  entries: Array<{ key: string; fetcher: () => Promise<T>; ttl?: number }>,
): Promise<void> {
  await Promise.all(
    entries.map(async ({ key, fetcher, ttl }) => {
      try {
        const data = await fetcher();
        await setCache(key, data, ttl);
      } catch (error) {
        console.warn(`[Cache] Warm error for key ${key}:`, error);
      }
    }),
  );
}
