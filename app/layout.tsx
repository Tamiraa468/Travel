import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AntdProvider from "@/Components/AntdProvider";
import TravelAgencyProvider from "../context/TravelAgencyContext";
import { WishlistProvider } from "@/Components/Wishlist";
import { LanguageProvider } from "@/context/LanguageContext";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

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
              <WishlistProvider>{children}</WishlistProvider>
            </TravelAgencyProvider>
          </LanguageProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
