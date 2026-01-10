import { NextRequest, NextResponse } from "next/server";

// ============================================
// NOTE: Domain redirects (HTTP→HTTPS, www→non-www) are handled by Vercel.
// Do NOT add redirect logic in middleware to avoid ERR_TOO_MANY_REDIRECTS.
// ============================================

// Environment checks for admin panel visibility
const isProduction = process.env.NODE_ENV === "production";
const isAdminEnabled = process.env.ADMIN_ENABLED === "true";

// Simple in-memory rate limiter: stores IP -> array of request timestamps
const requestCounts = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // Max 10 requests per minute

// Separate rate limiter for admin login (stricter)
const loginRequestCounts = new Map<string, number[]>();
const LOGIN_RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const LOGIN_RATE_LIMIT_MAX = 5; // Max 5 login attempts per minute per IP

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

/**
 * Check if login request exceeds rate limit (stricter for login)
 */
function isLoginRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - LOGIN_RATE_LIMIT_WINDOW;

  let requests = loginRequestCounts.get(ip) || [];
  requests = requests.filter((timestamp) => timestamp > windowStart);

  if (requests.length >= LOGIN_RATE_LIMIT_MAX) {
    return true;
  }

  requests.push(now);
  loginRequestCounts.set(ip, requests);

  return false;
}

/**
 * Check if admin panel should be accessible
 * - Hidden in production by default
 * - Can be enabled via ADMIN_ENABLED=true environment variable
 * - Always accessible in development
 */
function shouldAllowAdminAccess(): boolean {
  // In development, always allow
  if (!isProduction) {
    return true;
  }

  // In production, only allow if explicitly enabled
  return isAdminEnabled;
}

/**
 * Return a 404 response that doesn't leak admin existence
 */
function return404Response(): NextResponse {
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Content-Type": "text/html",
    },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ============================================
  // NOTE: HTTP→HTTPS and www→non-www redirects are handled by Vercel
  // Do NOT add redirect logic here to avoid ERR_TOO_MANY_REDIRECTS
  // ============================================

  // ============================================
  // ADMIN PANEL PROTECTION (Production Hide)
  // ============================================
  // In production, return 404 for all admin routes unless explicitly enabled
  // This prevents discovery of the admin panel by attackers
  if (pathname.startsWith("/admin")) {
    if (!shouldAllowAdminAccess()) {
      // Return 404 to hide admin panel existence in production
      return return404Response();
    }

    // Admin is accessible - apply rate limiting to login endpoint
    if (pathname === "/admin/login") {
      const clientIp = getClientIp(request);

      // Rate limit login attempts
      if (request.method === "POST" && isLoginRateLimited(clientIp)) {
        return NextResponse.json(
          {
            success: false,
            error: "Too many login attempts. Please try again in a minute.",
          },
          { status: 429 }
        );
      }

      // Add no-index headers for login page (dev/staging)
      const response = NextResponse.next();
      response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
      for (const [key, value] of Object.entries(securityHeaders)) {
        response.headers.set(key, value);
      }
      return response;
    }

    // Protect other admin routes - check session
    const sessionCookie = request.cookies.get("admin_session")?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // Verify session signature format (basic check)
    const parts = sessionCookie.split(".");
    if (parts.length !== 2 || parts[1].length !== 64) {
      // Invalid session format - likely tampering attempt
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete("admin_session");
      return response;
    }

    // Valid session - add no-index headers for all admin pages
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
    for (const [key, value] of Object.entries(securityHeaders)) {
      response.headers.set(key, value);
    }
    return response;
  }

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

  // Rate limit admin login API endpoint
  if (pathname === "/api/admin/login" && request.method === "POST") {
    const clientIp = getClientIp(request);

    if (isLoginRateLimited(clientIp)) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many login attempts. Please try again in a minute.",
        },
        { status: 429 }
      );
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
    // Match all routes for HTTPS redirect and security headers
    // Exclude static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
