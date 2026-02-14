import Script from "next/script";

/**
 * All third-party analytics scripts in one place.
 * Strategies:
 *   - afterInteractive: GTM / Google Ads base tag (needed for conversion tracking)
 *   - lazyOnload: Ahrefs analytics (SEO tool, not needed for first paint or conversions)
 *
 * This component is a Server Component — it renders <Script> tags without
 * adding any client JS bundle size.
 */
export default function Analytics() {
  return (
    <>
      {/* Ahrefs analytics — lazyOnload since it's an SEO audit tool, not user-facing */}
      <Script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="Nns/FvE1KbM30Z24DHSwgw"
        strategy="lazyOnload"
      />

      {/* Google Ads Global Tag (gtag.js) — afterInteractive for conversion tracking */}
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=AW-17911480435"
      />
      <Script id="google-ads-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'AW-17911480435');
        `}
      </Script>
    </>
  );
}
