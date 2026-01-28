/**
 * Redis-based Rate Limiter
 * Implements sliding window algorithm for accurate rate limiting
 * Falls back to allowing requests when Redis is unavailable
 */
import { NextRequest, NextResponse } from "next/server";
import redis, { isRedisCacheEnabled } from "./redis";

// Rate limit configurations
export const RateLimitConfig = {
  // Public endpoints - stricter limits
  PUBLIC: {
    windowMs: 60 * 1000, // 1 minute window
    maxRequests: 30, // 30 requests per minute
  },
  // Authenticated users - more generous
  AUTHENTICATED: {
    windowMs: 60 * 1000,
    maxRequests: 100, // 100 requests per minute
  },
  // Admin endpoints
  ADMIN: {
    windowMs: 60 * 1000,
    maxRequests: 200, // 200 requests per minute
  },
  // Sensitive endpoints (login, register, password reset)
  SENSITIVE: {
    windowMs: 15 * 60 * 1000, // 15 minute window
    maxRequests: 5, // 5 attempts per 15 minutes
  },
  // API-heavy endpoints (search, etc.)
  HEAVY: {
    windowMs: 60 * 1000,
    maxRequests: 10, // 10 requests per minute
  },
} as const;

export type RateLimitTier = keyof typeof RateLimitConfig;

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number; // Unix timestamp when window resets
  retryAfter?: number; // Seconds until next allowed request
}

/**
 * Extract client identifier from request
 * Prefers userId for authenticated, falls back to IP
 */
export function getClientIdentifier(req: NextRequest, userId?: string): string {
  if (userId) {
    return `user:${userId}`;
  }

  // Get IP from various headers (handle proxies)
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  const cfIp = req.headers.get("cf-connecting-ip"); // Cloudflare

  const ip =
    cfIp ||
    (forwarded ? forwarded.split(",")[0].trim() : null) ||
    realIp ||
    "unknown";

  return `ip:${ip}`;
}

/**
 * Sliding window rate limiter using Redis sorted sets
 * More accurate than fixed window, prevents burst at window edges
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string,
  config: (typeof RateLimitConfig)[RateLimitTier],
): Promise<RateLimitResult> {
  const key = `ratelimit:${endpoint}:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;

  // If Redis is not available, allow all requests
  if (!isRedisCacheEnabled() || !redis) {
    return {
      success: true,
      remaining: config.maxRequests,
      resetTime: Math.ceil((now + config.windowMs) / 1000),
    };
  }

  try {
    // Use Redis transaction for atomic operations
    const pipeline = redis.pipeline();

    // Remove old entries outside the window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // Count requests in current window
    pipeline.zcard(key);

    // Add current request with timestamp as score
    pipeline.zadd(key, now, `${now}-${Math.random()}`);

    // Set expiry on the key (cleanup)
    pipeline.pexpire(key, config.windowMs);

    const results = await pipeline.exec();

    // Get request count (result of zcard)
    const requestCount = (results?.[1]?.[1] as number) || 0;
    const remaining = Math.max(0, config.maxRequests - requestCount - 1);
    const resetTime = Math.ceil((now + config.windowMs) / 1000);

    if (requestCount >= config.maxRequests) {
      // Get oldest request timestamp to calculate retry time
      const oldest = await redis.zrange(key, 0, 0, "WITHSCORES");
      const oldestTime = oldest.length >= 2 ? parseInt(oldest[1]) : now;
      const retryAfter = Math.ceil((oldestTime + config.windowMs - now) / 1000);

      return {
        success: false,
        remaining: 0,
        resetTime,
        retryAfter: Math.max(1, retryAfter),
      };
    }

    return {
      success: true,
      remaining,
      resetTime,
    };
  } catch (error) {
    // On Redis error, allow request but log warning
    console.warn("[RateLimit] Redis error, allowing request:", error);
    return {
      success: true,
      remaining: config.maxRequests,
      resetTime: Math.ceil((now + config.windowMs) / 1000),
    };
  }
}

/**
 * Create rate limit response with proper headers
 */
export function createRateLimitResponse(result: RateLimitResult): NextResponse {
  return NextResponse.json(
    {
      error: "Too Many Requests",
      message: "Rate limit exceeded. Please slow down.",
      retryAfter: result.retryAfter,
    },
    {
      status: 429,
      headers: {
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": result.resetTime.toString(),
        "Retry-After": (result.retryAfter || 60).toString(),
      },
    },
  );
}

/**
 * Add rate limit headers to successful response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  result: RateLimitResult,
): NextResponse {
  response.headers.set("X-RateLimit-Remaining", result.remaining.toString());
  response.headers.set("X-RateLimit-Reset", result.resetTime.toString());
  return response;
}

/**
 * Rate limit middleware wrapper
 * Use in API route handlers
 */
export async function withRateLimit(
  req: NextRequest,
  endpoint: string,
  tier: RateLimitTier,
  userId?: string,
): Promise<RateLimitResult> {
  const identifier = getClientIdentifier(req, userId);
  const config = RateLimitConfig[tier];
  return checkRateLimit(identifier, endpoint, config);
}

/**
 * Higher-order function to wrap API handlers with rate limiting
 *
 * @example
 * export const GET = rateLimited("tours", "PUBLIC", async (req) => {
 *   return NextResponse.json({ data: "..." });
 * });
 */
export function rateLimited(
  endpoint: string,
  tier: RateLimitTier,
  handler: (
    req: NextRequest,
    rateLimitResult: RateLimitResult,
  ) => Promise<NextResponse>,
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    // Note: For authenticated tier, you'd need to extract userId from session
    const result = await withRateLimit(req, endpoint, tier);

    if (!result.success) {
      return createRateLimitResponse(result);
    }

    const response = await handler(req, result);
    return addRateLimitHeaders(response, result);
  };
}
