import SiteProviders from "@/Components/SiteProviders";

/**
 * Layout for public SEO pages (/, /tours, /about, /contact, etc.).
 * Uses a lightweight provider stack — no AntD, no Wishlist.
 * This keeps the client JS bundle ~80KB+ smaller than wrapping everything.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteProviders>{children}</SiteProviders>;
}
