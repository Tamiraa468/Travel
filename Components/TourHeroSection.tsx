/**
 * TourHeroSection Component
 *
 * Full-width hero banner for tour detail page with:
 * - Background image
 * - Tour title
 * - Star rating + review count
 * - Duration info
 * - Price per person
 * - Primary & secondary CTAs
 * - Minimalist Scandinavian design
 */

"use client";

interface TourHeroSectionProps {
  title: string;
  rating: number;
  reviewCount: number;
  duration: number;
  nights: number;
  price: number;
  imageUrl?: string;
  onFindPrice: () => void;
  onRequestInfo: () => void;
}

export default function TourHeroSection({
  title,
  rating,
  reviewCount,
  duration,
  nights,
  price,
  imageUrl,
  onFindPrice,
  onRequestInfo,
}: TourHeroSectionProps) {
  return (
    <div
      className="relative w-full h-96 overflow-hidden bg-linear-to-b from-blue-900 to-blue-800"
      style={{
        backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-12 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Tour Title */}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 drop-shadow-lg">
          {title}
        </h1>

        {/* Rating + Review Count */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < Math.floor(rating) ? "text-yellow-300" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-white text-sm font-medium drop-shadow">
            {rating.toFixed(1)} ({reviewCount} reviews)
          </span>
        </div>

        {/* Duration + Price */}
        <div className="flex items-center gap-6 mb-8 flex-wrap">
          <div className="text-white drop-shadow">
            <p className="text-sm font-medium text-gray-200">Duration</p>
            <p className="text-lg font-semibold">
              {duration} days / {nights} nights
            </p>
          </div>

          <div className="text-white drop-shadow">
            <p className="text-sm font-medium text-gray-200">Starting from</p>
            <p className="text-2xl font-bold">€{price.toLocaleString()}</p>
            <p className="text-xs text-gray-200">per person</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 flex-wrap">
          {/* Primary CTA */}
          <button
            onClick={onFindPrice}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 drop-shadow-lg"
          >
            Find Your Price
          </button>

          {/* Secondary CTA */}
          <button
            onClick={onRequestInfo}
            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 drop-shadow-lg"
          >
            Request Info
          </button>
        </div>
      </div>
    </div>
  );
}
