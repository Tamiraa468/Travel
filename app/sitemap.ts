import { MetadataRoute } from "next";

/**
 * Dynamic sitemap generation for SEO
 * Generates sitemap.xml at /sitemap.xml
 *
 * IMPORTANT: Always use the canonical production domain.
 * URLs here MUST match the canonical URLs set in page metadata.
 * Do NOT use process.env.VERCEL_URL or preview URLs.
 */

// Canonical production domain - hardcoded to prevent preview URL issues
const PRODUCTION_DOMAIN = "https://maralgoodreamland.com";

/**
 * Safely join URL parts without double slashes or trailing slashes
 * This ensures sitemap URLs match canonical URLs exactly
 */
function buildUrl(base: string, path: string = ""): string {
  const cleanBase = base.replace(/\/+$/, ""); // Remove trailing slashes
  const cleanPath = path.replace(/^\/+/, "").replace(/\/+$/, "").trim(); // Remove leading/trailing slashes
  return cleanPath ? `${cleanBase}/${cleanPath}` : cleanBase;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Always use production domain for sitemap URLs
  const baseUrl = PRODUCTION_DOMAIN;

  // Static pages - URLs must match canonical URLs in page metadata exactly
  // No trailing slashes (trailingSlash: false in next.config.js)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl, // Homepage canonical: "/"
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: buildUrl(baseUrl, "tours"), // canonical: "/tours"
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: buildUrl(baseUrl, "about"), // canonical: "/about"
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: buildUrl(baseUrl, "contact"), // canonical: "/contact"
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl(baseUrl, "faq"), // canonical: "/faq"
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: buildUrl(baseUrl, "blog"), // canonical: "/blog"
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: buildUrl(baseUrl, "why-mongolia"), // canonical: "/why-mongolia"
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl(baseUrl, "travel-guide"), // canonical: "/travel-guide"
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: buildUrl(baseUrl, "request-info"), // canonical: "/request-info"
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  // Try to fetch dynamic tour pages from database
  let tourPages: MetadataRoute.Sitemap = [];
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const tours = await prisma.tour.findMany({
      where: { isActive: true },
      select: { id: true, slug: true, updatedAt: true },
    });

    tourPages = tours.map((tour) => {
      // Use slug if available, otherwise use id (must match generateMetadata in tour page)
      const urlPath = tour.slug || tour.id;
      return {
        url: buildUrl(baseUrl, `tours/${urlPath}`),
        lastModified: tour.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    });
  } catch (error) {
    console.error("Failed to fetch tours for sitemap:", error);
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
      url: buildUrl(baseUrl, `blog/${post.slug}`),
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch blog posts for sitemap:", error);
  }

  return [...staticPages, ...tourPages, ...blogPages];
}
