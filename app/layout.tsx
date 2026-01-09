import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AntdProvider from "@/Components/AntdProvider";
import TravelAgencyProvider from "../context/TravelAgencyContext";
import { WishlistProvider } from "@/Components/Wishlist";
import { LanguageProvider } from "@/context/LanguageContext";
import { Playfair_Display } from "next/font/google";
import type { Metadata } from "next";

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
  metadataBase: new URL(SITE_URL),
  
  // Site title and description
  title: {
    default: "Maralgoo Dreamland - Mongolia Tours & Travel",
    template: "%s | Maralgoo Dreamland",
  },
  description:
    "Discover authentic Mongolia adventures with Maralgoo Dreamland. Expert-guided tours to the Gobi Desert, nomadic experiences, and unforgettable journeys across the land of eternal blue sky.",
  
  // Canonical URL - tells search engines this is the primary URL
  alternates: {
    canonical: SITE_URL,
  },
  
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
        url: "/og-image.jpg",
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
    images: ["/og-image.jpg"],
  },
  
  // Favicon and icons
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
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
        <AntdProvider>
          <LanguageProvider>
            <TravelAgencyProvider>
              <WishlistProvider>
                {children}
                <SpeedInsights />
              </WishlistProvider>
            </TravelAgencyProvider>
          </LanguageProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
