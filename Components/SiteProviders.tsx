"use client";

import React from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import TravelAgencyProvider from "@/context/TravelAgencyContext";

/**
 * Lightweight provider stack for public SEO pages.
 * Does NOT include AntD or Wishlist — keeps the client JS bundle small.
 */
export default function SiteProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <TravelAgencyProvider>{children}</TravelAgencyProvider>
    </LanguageProvider>
  );
}
