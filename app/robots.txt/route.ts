import { NextResponse } from "next/server";

/**
 * Dynamic robots.txt route handler
 * Ensures /admin routes are always disallowed from crawling
 */
export async function GET() {
  const robotsTxt = `# robots.txt for Maralgoo Dreamland Travel
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/
Disallow: /api/*

# Sitemap location (update with your actual domain)
# Sitemap: https://yourdomain.com/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
