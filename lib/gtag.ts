/**
 * Google Ads Conversion Tracking Utility
 *
 * Google Ads ID: AW-17911480435
 * Purpose: Track inquiry/contact form conversions for Google Ads campaigns
 */

// Google Ads ID
export const GOOGLE_ADS_ID = "AW-17911480435";

// Declare gtag for TypeScript
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

/**
 * Track Google Ads conversion
 * Call this after successful form submission (inquiry, contact, booking)
 * Client-side only - checks if gtag exists before firing
 */
export const trackGoogleAdsConversion = () => {
  if (typeof window === "undefined") return; // Server-side guard

  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: GOOGLE_ADS_ID,
    });
    console.log("✅ Google Ads conversion tracked");
  } else {
    console.warn("⚠️ Google Ads gtag not loaded");
  }
};
