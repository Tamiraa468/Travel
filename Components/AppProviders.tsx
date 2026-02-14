"use client";

import React from "react";
import { LanguageProvider } from "@/context/LanguageContext";
import TravelAgencyProvider from "@/context/TravelAgencyContext";
import { WishlistProvider } from "@/Components/Wishlist";

/**
 * Full provider stack for interactive pages that need Wishlist.
 * Used for: /wishlist, /request-info, /payment, etc.
 * Still no AntD — it's unused in the codebase.
 */
export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <TravelAgencyProvider>
        <WishlistProvider>{children}</WishlistProvider>
      </TravelAgencyProvider>
    </LanguageProvider>
  );
}
