"use client";

import {
  Check,
  X,
  Plane,
  Hotel,
  Car,
  Utensils,
  Camera,
  Users,
  MapPin,
  Shield,
  Coffee,
  Mountain,
  Package,
} from "lucide-react";

type Props = {
  includes: string[];
  excludes: string[];
};

// Map keywords to icons
const getIcon = (text: string) => {
  const lowerText = text.toLowerCase();
  if (lowerText.includes("flight") || lowerText.includes("airport"))
    return Plane;
  if (lowerText.includes("hotel") || lowerText.includes("accommodation"))
    return Hotel;
  if (lowerText.includes("transport") || lowerText.includes("vehicle"))
    return Car;
  if (lowerText.includes("meal") || lowerText.includes("food")) return Utensils;
  if (lowerText.includes("guide")) return Users;
  if (lowerText.includes("entrance") || lowerText.includes("fee"))
    return MapPin;
  if (lowerText.includes("insurance")) return Shield;
  if (lowerText.includes("breakfast") || lowerText.includes("coffee"))
    return Coffee;
  if (lowerText.includes("photo") || lowerText.includes("camera"))
    return Camera;
  if (lowerText.includes("trek") || lowerText.includes("hike")) return Mountain;
  return null;
};

export default function IncludesExcludes({ includes, excludes }: Props) {
  const hasIncludes = includes && includes.length > 0;
  const hasExcludes = excludes && excludes.length > 0;

  if (!hasIncludes && !hasExcludes) {
    return null;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-gold-300 to-gold-500 rounded-xl flex items-center justify-center">
          <Package className="w-5 h-5 text-forest-900" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-forest-900">
          What&apos;s Included
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Includes */}
        {hasIncludes && (
          <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
            <h3 className="text-lg font-semibold text-emerald-800 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm">
                <Check className="w-4 h-4 text-white" />
              </div>
              Package Includes
            </h3>
            <ul className="space-y-4">
              {includes.map((item, index) => {
                const IconComponent = getIcon(item);
                return (
                  <li key={index} className="flex items-start gap-3 group">
                    <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                      {IconComponent ? (
                        <IconComponent className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </div>
                    <span className="text-charcoal leading-relaxed">
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Excludes */}
        {hasExcludes && (
          <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-6 border border-rose-100">
            <h3 className="text-lg font-semibold text-rose-800 mb-5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center shadow-sm">
                <X className="w-4 h-4 text-white" />
              </div>
              Package Excludes
            </h3>
            <ul className="space-y-4">
              {excludes.map((item, index) => {
                const IconComponent = getIcon(item);
                return (
                  <li key={index} className="flex items-start gap-3 group">
                    <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-rose-100 flex items-center justify-center group-hover:bg-rose-200 transition-colors">
                      {IconComponent ? (
                        <IconComponent className="w-3.5 h-3.5 text-rose-500" />
                      ) : (
                        <X className="w-3.5 h-3.5 text-rose-500" />
                      )}
                    </div>
                    <span className="text-charcoal leading-relaxed">
                      {item}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
