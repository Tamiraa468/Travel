"use client";

import { Shield, Clock, Star, CheckCircle } from "lucide-react";

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
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm font-medium">
            Book This Tour
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-white text-sm font-medium">4.9</span>
          </div>
        </div>
      </div>

      {/* Price Section */}
      <div className="p-6 text-center border-b border-slate-100">
        <p className="text-sm text-slate-500 mb-1 uppercase tracking-wide">
          Starting From
        </p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-5xl font-serif font-bold text-slate-800">
            €{price.toLocaleString()}
          </span>
        </div>
        <p className="text-slate-500 text-sm mt-1">per person</p>
      </div>

      {/* Features */}
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-3 text-slate-600">
          <CheckCircle className="w-5 h-5 text-green-500" />
          <span className="text-sm">Free cancellation up to 7 days</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Shield className="w-5 h-5 text-amber-500" />
          <span className="text-sm">Secure booking & payment</span>
        </div>
        <div className="flex items-center gap-3 text-slate-600">
          <Clock className="w-5 h-5 text-blue-500" />
          <span className="text-sm">Instant confirmation</span>
        </div>
      </div>

      {/* CTA Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onRequestInfo}
          className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 text-lg"
          type="button"
        >
          Request Information
        </button>
        <p className="text-center text-slate-400 text-xs mt-3">
          No payment required • Get a custom quote
        </p>
      </div>
    </div>
  );
}
