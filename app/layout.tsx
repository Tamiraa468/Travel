import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AntdProvider from "@/Components/AntdProvider";
import TravelAgencyProvider from "../context/TravelAgencyContext";
import { WishlistProvider } from "@/Components/Wishlist";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdProvider>
          <TravelAgencyProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </TravelAgencyProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
