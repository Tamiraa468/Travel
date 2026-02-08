"use client";

/**
 * BoxPackageInfo Component
 *
 * ============================================
 * INQUIRY-FIRST SALES MODEL
 * ============================================
 *
 * This is NOT a booking card - it's an inquiry CTA card.
 * Emphasizes conversation and customization over transaction.
 *
 * Key changes:
 * - "Customize This Trip" instead of "Book This Tour"
 * - Trust badges focus on human support, not booking security
 * - No payment or deposit language
 */

import {
  Shield,
  MessageCircle,
  Star,
  Sparkles,
  Clock,
  Users,
} from "lucide-react";

interface BoxPackageInfoProps {
  price: number;
  onRequestInfo: () => void;
}

export default function BoxPackageInfo({
  price,
  onRequestInfo,
}: BoxPackageInfoProps) {
  return (
    <div className="w-full bg-white rounded-2xl overflow-hidden">
      {/* Header - Updated messaging */}
      <div className="bg-gradient-to-r from-forest-900 to-forest-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-ivory/80 text-sm font-medium">
            Customize This Trip
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gold-500 fill-gold-500" />
            <span className="text-ivory text-sm font-medium">4.9</span>
          </div>
        </div>
      </div>

      {/* Price Section - Now indicates starting price */}
      <div className="p-6 text-center border-b border-sand">
        <p className="text-sm text-stone mb-1 uppercase tracking-wide">
          Starting From
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-serif font-bold text-forest-900">
            ${price.toLocaleString()}
          </span>
        </div>
        <p className="text-stone text-sm mt-1">per person</p>
        <p className="text-gold-500 text-xs mt-2 font-medium">
          ✓ Custom pricing available for your group
        </p>
      </div>

      {/* Features - Updated for inquiry-first model */}
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-3 text-charcoal">
          <Users className="w-5 h-5 text-forest-500" />
          <span className="text-sm">Private or small group options</span>
        </div>
        <div className="flex items-center gap-3 text-charcoal">
          <MessageCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm">Local expert personal support</span>
        </div>
        <div className="flex items-center gap-3 text-charcoal">
          <Clock className="w-5 h-5 text-forest-700" />
          <span className="text-sm">Reply within 24 hours</span>
        </div>
      </div>

      {/* CTA Button - Updated language */}
      <div className="px-6 pb-6">
        <button
          onClick={onRequestInfo}
          className="w-full bg-gradient-to-r from-gold-500 to-gold-700 text-forest-900 font-semibold py-4 px-6 rounded-xl hover:from-gold-300 hover:to-gold-500 transition-all duration-200 shadow-lg shadow-gold-500/30 hover:shadow-xl hover:shadow-gold-500/40 text-lg"
          type="button"
        >
          Request Free Itinerary
        </button>

        {/* WhatsApp secondary option */}
        <a
          href="https://wa.me/97689475188"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-all border border-green-200"
        >
          <MessageCircle className="w-5 h-5" />
          Chat on WhatsApp
        </a>
      </div>
    </div>
  );
}
