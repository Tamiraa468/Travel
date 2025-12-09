/**
 * ==========================================
 * SECURITY UTILITIES
 * ==========================================
 *
 * Protections against React2Shell and other vulnerabilities:
 * - Input sanitization
 * - XSS prevention
 * - Path traversal prevention
 * - Rate limiting helper
 * - CSRF token generation
 */

import crypto from "crypto";

/**
 * Sanitize string input to prevent XSS attacks
 * Removes or escapes dangerous HTML characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== "string") return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .replace(/`/g, "&#x60;")
    .replace(/=/g, "&#x3D;");
}

/**
 * Strip HTML tags from input
 */
export function stripHtml(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Sanitize email - only allow valid email characters
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== "string") return "";
  // Remove any character that's not valid in an email
  return email
    .toLowerCase()
    .replace(/[^a-z0-9@._+-]/gi, "")
    .slice(0, 254);
}

/**
 * Sanitize phone number - only allow digits and common phone characters
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== "string") return "";
  return phone.replace(/[^0-9+\-() ]/g, "").slice(0, 20);
}

/**
 * Prevent path traversal attacks
 * Removes ../ and other dangerous path sequences
 */
export function sanitizePath(path: string): string {
  if (typeof path !== "string") return "";

  return path
    .replace(/\.\./g, "") // Remove ..
    .replace(/\/\//g, "/") // Remove double slashes
    .replace(/^\/+/, "") // Remove leading slashes
    .replace(/[<>:"|?*]/g, ""); // Remove Windows-invalid chars
}

/**
 * Validate and sanitize filename
 * Prevents directory traversal and shell injection via filenames
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== "string") return "file";

  // Remove path traversal attempts
  let clean = filename.replace(/\.\./g, "").replace(/[\/\\]/g, "");

  // Remove null bytes and control characters (shell injection vector)
  clean = clean.replace(/[\x00-\x1f\x7f]/g, "");

  // Remove shell metacharacters
  clean = clean.replace(/[`$(){}|;&<>!]/g, "");

  // Limit length
  clean = clean.slice(0, 255);

  return clean || "file";
}

/**
 * Validate URL to prevent SSRF attacks
 * Only allow http/https protocols
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== "string") return false;

  try {
    const parsed = new URL(url);
    // Only allow http and https
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return false;
    }
    // Block private/local IPs (SSRF prevention)
    const hostname = parsed.hostname.toLowerCase();
    const blockedPatterns = [
      "localhost",
      "127.0.0.1",
      "0.0.0.0",
      "::1",
      "169.254.", // Link-local
      "10.", // Private
      "172.16.", // Private
      "192.168.", // Private
      "metadata", // Cloud metadata endpoints
    ];
    for (const pattern of blockedPatterns) {
      if (hostname.includes(pattern)) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Simple in-memory rate limiter
 * For production, use Redis-based rate limiting
 */
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minute default
): { allowed: boolean; remaining: number; resetIn: number } {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  // Clean up old entries periodically
  if (rateLimitStore.size > 10000) {
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) rateLimitStore.delete(k);
    }
  }

  if (!record || record.resetTime < now) {
    // New window
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetIn: windowMs };
  }

  if (record.count >= maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      resetIn: record.resetTime - now,
    };
  }

  record.count++;
  return {
    allowed: true,
    remaining: maxRequests - record.count,
    resetIn: record.resetTime - now,
  };
}

/**
 * Get client IP from request (for rate limiting)
 */
export function getClientIp(request: Request): string {
  // Check common proxy headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP in the chain
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  // Fallback
  return "unknown";
}

/**
 * Validate content type to prevent content type attacks
 */
export function validateContentType(
  request: Request,
  expected: string
): boolean {
  const contentType = request.headers.get("content-type") || "";
  return contentType.toLowerCase().includes(expected.toLowerCase());
}

/**
 * Escape string for use in SQL LIKE queries
 * Note: Prisma handles parameterization, but this adds extra safety
 */
export function escapeSqlLike(input: string): string {
  if (typeof input !== "string") return "";
  return input.replace(/[%_\\]/g, "\\$&");
}

/**
 * Validate that an ID looks like a valid CUID
 * Prevents injection via malformed IDs
 */
export function isValidCuid(id: string): boolean {
  if (typeof id !== "string") return false;
  // CUID format: c + lowercase alphanumeric, 25 chars total
  return /^c[a-z0-9]{24}$/.test(id);
}

/**
 * Security headers to add to responses
 */
export const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};
