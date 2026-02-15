import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Playfair_Display } from "next/font/google";
import type { Metadata } from "next";
import Analytics from "@/Components/Analytics";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

// Canonical production domain for SEO
const SITE_URL = "https://maralgoodreamland.com";

export const metadata: Metadata = {
  // Base URL for all relative URLs in metadata
  // This is used to resolve relative canonical URLs in child pages
  metadataBase: new URL(SITE_URL),

  // Site title and description
  title: {
    default: "Maralgoo Dreamland - Mongolia Tours & Travel",
    template: "%s | Maralgoo Dreamland",
  },
  description:
    "Discover authentic Mongolia adventures with Maralgoo Dreamland. Expert-guided tours to the Gobi Desert, nomadic experiences, and unforgettable journeys across the land of eternal blue sky.",

  // NOTE: Do NOT set global canonical here!
  // Each page should define its own canonical URL to avoid duplicates
  // alternates: { canonical: "/" } - set per page, not globally

  // Open Graph for social sharing
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Maralgoo Dreamland",
    title: "Maralgoo Dreamland - Mongolia Tours & Travel",
    description:
      "Discover authentic Mongolia adventures with Maralgoo Dreamland. Expert-guided tours to the Gobi Desert, nomadic experiences, and unforgettable journeys.",
    images: [
      {
        url: "https://res.cloudinary.com/dutauqy6m/image/upload/f_auto,q_auto,w_1200/utravel/gobi_Hero.jpg",
        width: 1200,
        height: 630,
        alt: "Maralgoo Dreamland - Mongolia Tours",
      },
    ],
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Maralgoo Dreamland - Mongolia Tours & Travel",
    description:
      "Discover authentic Mongolia adventures with expert-guided tours.",
    images: [
      "https://res.cloudinary.com/dutauqy6m/image/upload/f_auto,q_auto,w_1200/utravel/gobi_Hero.jpg",
    ],
  },

  // Favicon and icons
  icons: {
    icon: [
      {
        url: "https://res.cloudinary.com/dutauqy6m/image/upload/f_auto,q_auto,w_32/utravel/logo.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple:
      "https://res.cloudinary.com/dutauqy6m/image/upload/f_auto,q_auto,w_180/utravel/logo.png",
  },

  // Additional SEO settings
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add your codes when available)
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={playfair.variable}>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}
