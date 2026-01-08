import { NextResponse } from "next/server";

/**
 * Dynamic robots.txt route handler
 * Ensures /admin routes are always disallowed from crawling
 */
export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://www.maralgoodreamland.com";

  const robotsTxt = `# robots.txt for Maralgoo Dreamland Travel
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /api/*
Disallow: /payment/
Disallow: /wishlist

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
