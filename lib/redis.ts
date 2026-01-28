/**
 * Redis Client Configuration
 * Optional - gracefully degrades when Redis is unavailable
 */
import Redis from "ioredis";

// Redis connection options
const REDIS_URL = process.env.REDIS_URL;

// Track if Redis is available
let isRedisAvailable = !!REDIS_URL;

// Global reference for connection reuse in serverless environment
declare global {
  // eslint-disable-next-line no-var
  var redisClient: Redis | null | undefined;
}

/**
 * Create Redis client with proper error handling and reconnection logic
 */
function createRedisClient(): Redis | null {
  // Skip if no Redis URL configured
  if (!REDIS_URL) {
    console.log("[Redis] No REDIS_URL configured, caching disabled");
    return null;
  }

  try {
    const client = new Redis(REDIS_URL, {
      maxRetriesPerRequest: 1, // Reduced from 3 - fail fast
      retryStrategy(times) {
        if (times > 2) {
          // Stop retrying after 2 attempts
          console.warn("[Redis] Max retries reached, disabling Redis");
          isRedisAvailable = false;
          return null; // Stop retrying
        }
        return Math.min(times * 100, 1000); // Max 1 second delay
      },
      connectTimeout: 5000, // Reduced from 10s
      enableOfflineQueue: false, // Don't queue commands when disconnected
      lazyConnect: true,
    });

    client.on("error", (err) => {
      console.error("[Redis] Connection error:", err.message);
      isRedisAvailable = false;
    });

    client.on("connect", () => {
      console.log("[Redis] Connected successfully");
      isRedisAvailable = true;
    });

    client.on("reconnecting", () => {
      console.log("[Redis] Reconnecting...");
    });

    return client;
  } catch (error) {
    console.warn("[Redis] Failed to create client:", error);
    return null;
  }
}

/**
 * Get Redis client instance (singleton)
 * Returns null if Redis is not available
 */
export function getRedisClient(): Redis | null {
  if (!isRedisAvailable) {
    return null;
  }

  if (global.redisClient === undefined) {
    global.redisClient = createRedisClient();
  }
  return global.redisClient;
}

/**
 * Check if Redis is available
 */
export function isRedisCacheEnabled(): boolean {
  return isRedisAvailable && global.redisClient !== null;
}

// Export default client instance (may be null)
const redis = getRedisClient();
export default redis;
