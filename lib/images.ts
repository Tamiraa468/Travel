/**
 * Centralized Image Registry
 *
 * Single source of truth for all static image URLs used across the site.
 * Every image entry includes: src, alt, width, height.
 *
 * - Static images: defined here with Cloudinary URLs
 * - Dynamic images (from DB): use normalizeImageUrl() or pass directly to next/image
 * - next/image handles format conversion (WebP/AVIF) and responsive sizing
 * - Cloudinary w_ param caps the source download size
 */

const CLOUD = "https://res.cloudinary.com/dutauqy6m/image/upload";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ImageEntry = {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
};

// ---------------------------------------------------------------------------
// Site Logo
// ---------------------------------------------------------------------------

export const logo: ImageEntry = {
  src: `${CLOUD}/w_256/utravel/logo.png`,
  alt: "Maralgoo Dreamland Travel",
  width: 256,
  height: 256,
};

// ---------------------------------------------------------------------------
// Homepage Slider Images
// ---------------------------------------------------------------------------

export const sliderImages: ImageEntry[] = [
  {
    src: `${CLOUD}/w_1920/utravel/slider1.png`,
    alt: "Mongolia vast steppe landscape",
    width: 1920,
    height: 1080,
  },
  {
    src: `${CLOUD}/w_1920/utravel/slider2.png`,
    alt: "Mongolian nomadic ger camp",
    width: 1920,
    height: 1080,
  },
  {
    src: `${CLOUD}/w_1920/utravel/slider3.jpg`,
    alt: "Gobi Desert sand dunes",
    width: 1920,
    height: 1080,
  },
  {
    src: `${CLOUD}/w_1920/utravel/slider4.jpg`,
    alt: "Khuvsgul Lake panoramic view",
    width: 1920,
    height: 1080,
  },
  {
    src: `${CLOUD}/w_1920/utravel/slider5.jpg`,
    alt: "Mongolian wild horses",
    width: 1920,
    height: 1080,
  },
  {
    src: `${CLOUD}/w_1920/utravel/slider6.jpg`,
    alt: "Terelj National Park mountains",
    width: 1920,
    height: 1080,
  },
];

// ---------------------------------------------------------------------------
// Hero Images (one per top-level page)
// ---------------------------------------------------------------------------

export const heroImages = {
  home: {
    src: `${CLOUD}/w_1920/utravel/gobi_Hero.jpg`,
    alt: "Mongolian Gobi Desert landscape",
    width: 1920,
    height: 1080,
  },
  about: {
    src: `${CLOUD}/w_1920/utravel/gobi_Hero.jpg`,
    alt: "About Maralgoo Dreamland",
    width: 1920,
    height: 1080,
  },
  whyMongolia: {
    src: `${CLOUD}/w_1920/utravel/khuvsgul.jpg`,
    alt: "Khuvsgul Lake Mongolia",
    width: 1920,
    height: 1080,
  },
  travelGuide: {
    src: `${CLOUD}/w_1920/utravel/terelj.jpg`,
    alt: "Terelj National Park",
    width: 1920,
    height: 1080,
  },
  cta: {
    src: `${CLOUD}/w_1920/utravel/gobi_Hero.jpg`,
    alt: "Start your Mongolia journey",
    width: 1920,
    height: 1080,
  },
  tourFallback: {
    src: `${CLOUD}/w_1920/utravel/gobi_Hero.jpg`,
    alt: "Mongolia tour",
    width: 1920,
    height: 1080,
  },
} as const;

// ---------------------------------------------------------------------------
// Static Tour Showcase Images
// ---------------------------------------------------------------------------

export const tourImages = {
  gobi: {
    src: `${CLOUD}/w_800/utravel/gobi.jpg`,
    alt: "Gobi Desert tour",
    width: 800,
    height: 600,
  },
  khuvsgul: {
    src: `${CLOUD}/w_800/utravel/khuvsgul.jpg`,
    alt: "Khuvsgul Lake tour",
    width: 800,
    height: 600,
  },
  terelj: {
    src: `${CLOUD}/w_800/utravel/terelj.jpg`,
    alt: "Terelj National Park tour",
    width: 800,
    height: 600,
  },
} as const;

// ---------------------------------------------------------------------------
// Partner Logos
// ---------------------------------------------------------------------------

export const partnerLogos: ImageEntry[] = [
  {
    src: `${CLOUD}/utravel/partners/nomad-air.svg`,
    alt: "Nomad Air logo",
    width: 400,
    height: 100,
  },
  {
    src: `${CLOUD}/utravel/partners/steppe-hotels.svg`,
    alt: "Steppe Hotels logo",
    width: 400,
    height: 100,
  },
  {
    src: `${CLOUD}/utravel/partners/blue-sky-bank.svg`,
    alt: "Blue Sky Bank logo",
    width: 400,
    height: 100,
  },
  {
    src: `${CLOUD}/utravel/partners/eagle-outfitters.svg`,
    alt: "Eagle Outfitters logo",
    width: 400,
    height: 100,
  },
  {
    src: `${CLOUD}/utravel/partners/ger-camp-group.svg`,
    alt: "Ger Camp Group logo",
    width: 400,
    height: 100,
  },
  {
    src: `${CLOUD}/utravel/partners/horizon-logistics.svg`,
    alt: "Horizon Logistics logo",
    width: 400,
    height: 100,
  },
];

// ---------------------------------------------------------------------------
// Testimonial Avatars
// ---------------------------------------------------------------------------

export const testimonialAvatars: ImageEntry[] = [
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    alt: "Sarah Mitchell",
    width: 150,
    height: 150,
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    alt: "James Chen",
    width: 150,
    height: 150,
  },
  {
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "Alessandro Romano",
    width: 150,
    height: 150,
  },
  {
    src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    alt: "Victoria Adams",
    width: 150,
    height: 150,
  },
];

// ---------------------------------------------------------------------------
// OG / Social Sharing
// ---------------------------------------------------------------------------

export const ogImage: ImageEntry = {
  src: `${CLOUD}/w_1200/utravel/gobi_Hero.jpg`,
  alt: "Maralgoo Dreamland - Mongolia Tours",
  width: 1200,
  height: 630,
};

// ---------------------------------------------------------------------------
// Responsive sizes presets (for next/image `sizes` prop)
// ---------------------------------------------------------------------------

export const SIZES = {
  /** Hero / full-width banners */
  hero: "100vw",
  /** 3-column card grid */
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  /** 2-column layout (e.g. about page story image) */
  half: "(max-width: 1024px) 100vw, 50vw",
  /** Small logos / avatars */
  logo: "(max-width: 640px) 33vw, 160px",
  /** Thumbnail grid (4 col) */
  thumbnail: "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw",
} as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Normalize any database image URL to a consistent format.
 * - Full URLs (https://...) are returned as-is
 * - Paths starting with / are returned as-is (public folder)
 * - Bare public IDs are prefixed with Cloudinary base URL
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  // Never pass base64 through — it bloats SSR output
  if (url.startsWith("data:")) return "";

  // Already a full URL
  if (url.startsWith("https://") || url.startsWith("http://")) {
    return url;
  }

  // Relative path to public folder
  if (url.startsWith("/")) {
    return url;
  }

  // Bare Cloudinary public_id
  return `${CLOUD}/${url}`;
}
