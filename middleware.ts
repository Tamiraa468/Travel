import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter: stores IP -> array of request timestamps
const requestCounts = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // Max 10 requests per minute

// Security headers to prevent XSS, clickjacking, and other attacks
const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  // Content Security Policy - adjusted for Stripe and Vercel
  "Content-Security-Policy":
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://vercel.live https://*.vercel.live; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https: blob:; " +
    "font-src 'self' data:; " +
    "connect-src 'self' https://api.stripe.com https://maps.googleapis.com https://*.vercel.live wss://*.vercel.live; " +
    "frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://vercel.live; " +
    "object-src 'none'; " +
    "base-uri 'self';",
};

/**
 * Get client IP address from request
 */
function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    request.ip ||
    "unknown"
  );
}

/**
 * Check if request exceeds rate limit
 */
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Get existing requests for this IP
  let requests = requestCounts.get(ip) || [];

  // Filter out old requests outside the window
  requests = requests.filter((timestamp) => timestamp > windowStart);

  // Check if limit exceeded
  if (requests.length >= RATE_LIMIT_MAX) {
    return true;
  }

  // Add current request
  requests.push(now);
  requestCounts.set(ip, requests);

  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Apply rate limiting to /api/request-info
  if (pathname === "/api/request-info" && request.method === "POST") {
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many requests. Please try again in a minute.",
        },
        { status: 429 }
      );
    }
  }

  // Allow login page
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect admin routes - just check if session cookie exists
  if (pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("admin_session")?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify session signature format (basic check)
    // Full verification happens in getSession()
    const parts = sessionCookie.split(".");
    if (parts.length !== 2 || parts[1].length !== 64) {
      // Invalid session format - likely tampering attempt
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_session");
      return response;
    }
  }

  // Add security headers to all responses
  const response = NextResponse.next();

  for (const [key, value] of Object.entries(securityHeaders)) {
    response.headers.set(key, value);
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/request-info",
    "/api/stripe/:path*",
    "/payment/:path*",
  ],
};
