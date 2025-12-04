import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import AntdProvider from "@/Components/AntdProvider";
import TravelAgencyProvider from "../context/TravelAgencyContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AntdProvider>
          <TravelAgencyProvider>{children}</TravelAgencyProvider>
        </AntdProvider>
      </body>
    </html>
  );
}
