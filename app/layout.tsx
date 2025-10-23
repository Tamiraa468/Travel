import "./globals.css";
import { ConfigProvider } from "antd";
import TravelAgencyProvider from "../context/TravelAgencyContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ConfigProvider theme={{ token: { colorPrimary: "#1677ff" } }}>
          <TravelAgencyProvider>{children}</TravelAgencyProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
