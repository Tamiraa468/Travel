/**
 * Request Info page - allows users to request tour information
 */

import RequestInfoForm from "@/Components/RequestInfoForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request Information",
  description:
    "Request personalized tour information from Maralgoo Dreamland. Tell us about your dream Mongolia trip and get custom recommendations.",
  alternates: {
    canonical: "/request-info",
  },
  openGraph: {
    title: "Request Tour Information - Maralgoo Dreamland",
    description: "Get personalized Mongolia tour recommendations.",
    url: "/request-info",
  },
};

export default function RequestInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sand to-ivory py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-forest-900 mb-4">
            Request Tour Information
          </h1>
          <p className="text-xl text-charcoal">
            Tell us about your dream tour and we'll send you personalized
            recommendations
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-ivory rounded-lg shadow-xl p-8 border border-sand">
          <RequestInfoForm />
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gold-500/10 border-l-4 border-gold-500 p-6 rounded-r">
          <h3 className="font-semibold text-forest-900 mb-2">
            What happens next?
          </h3>
          <ul className="text-charcoal space-y-2 text-sm">
            <li>✓ We'll send you a confirmation email within minutes</li>
            <li>
              ✓ Our team will review your preferences and create a custom
              itinerary
            </li>
            <li>
              ✓ You'll receive detailed pricing and options within 24 hours
            </li>
            <li>✓ We're here to answer any questions and help you book!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
