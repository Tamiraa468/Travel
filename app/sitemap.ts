import { MetadataRoute } from "next";

/**
 * Dynamic sitemap generation for SEO
 * Generates sitemap.xml at /sitemap.xml
 *
 * IMPORTANT: Always use the canonical production domain.
 * Do NOT use process.env.VERCEL_URL or preview URLs.
 */

// Canonical production domain - hardcoded to prevent preview URL issues
const PRODUCTION_DOMAIN = "https://maralgoodreamland.com";

/**
 * Safely join URL parts without double slashes or spaces
 */
function buildUrl(base: string, path: string): string {
  const cleanBase = base.replace(/\/+$/, ""); // Remove trailing slashes
  const cleanPath = path.replace(/^\/+/, "").trim(); // Remove leading slashes and spaces
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use production domain for sitemap URLs
  const baseUrl = PRODUCTION_DOMAIN;

  // Static pages - using buildUrl to ensure proper URL formatting
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: buildUrl(baseUrl, "tours"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: buildUrl(baseUrl, "about"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: buildUrl(baseUrl, "contact"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl(baseUrl, "faq"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: buildUrl(baseUrl, "blog"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: buildUrl(baseUrl, "why-mongolia"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl(baseUrl, "travel-guide"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl(baseUrl, "request-info"),
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Try to fetch dynamic tour pages from database
  let tourPages: MetadataRoute.Sitemap = [];
  try {
    // Import prisma dynamically to avoid build issues
    const { default: prisma } = await import("@/lib/prisma");
    const tours = await prisma.tour.findMany({
      select: { id: true, updatedAt: true },
    });

    tourPages = tours.map((tour) => ({
      url: buildUrl(baseUrl, `tours/${encodeURIComponent(tour.id)}`),
      lastModified: tour.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch tours for sitemap:", error);
    // Continue without dynamic tour pages
  }

  // Try to fetch dynamic blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });

    blogPages = posts.map((post) => ({
      url: buildUrl(baseUrl, `blog/${encodeURIComponent(post.slug)}`),
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
    // Continue without dynamic blog pages
  }

  return [...staticPages, ...tourPages, ...blogPages];
}
