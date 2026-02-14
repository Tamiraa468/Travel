import AppProviders from "@/Components/AppProviders";

/**
 * Layout for interactive pages that need the full provider stack
 * (Wishlist, request-info, payment, etc.).
 */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppProviders>{children}</AppProviders>;
}
