"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Clock, Star, ArrowRight, Heart } from "lucide-react";
import { useState } from "react";

type Tour = {
  id?: string;
  slug?: string;
  title: string;
  description?: string;
  price?: number;
  priceFrom?: number;
  days?: number;
  mainImage?: string | null;
  image?: string | null; // Context uses 'image' instead of 'mainImage'
  rating?: number;
  reviewCount?: number;
  location?: string;
  duration?: string;
};

type Props = {
  tour?: Tour;
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  price?: number;
  days?: number;
  images?: string[];
  index?: number;
  currentTourId?: string;
};

export default function TourCard({
  tour,
  title,
  description,
  price,
  slug,
  id,
  days,
  images,
  index = 0,
}: Props) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Support both object and spread props
  const finalTitle = tour?.title || title || "Unknown Tour";
  const finalDescription = tour?.description || description || "";
  const finalPrice = tour?.priceFrom ?? tour?.price ?? price ?? 0;
  const finalSlug = tour?.slug || slug || tour?.id || id || "#";
  // Parse days from duration string like "8 days" if days not available
  const parseDays = tour?.duration ? parseInt(tour.duration) : undefined;
  const finalDays = tour?.days || days || parseDays || 7;
  // Check both mainImage and image (context uses 'image')
  const finalMainImage =
    tour?.mainImage || tour?.image || (images && images[0]) || null;
  const finalRating = tour?.rating || 4.8;
  const finalReviewCount = tour?.reviewCount || 24;
  const finalLocation = tour?.location || "Mongolia";

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
    >
      {/* Image Container — aspect ratio container prevents CLS */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {finalMainImage ? (
          <Image
            src={finalMainImage}
            alt={finalTitle}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            quality={75}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
            <span className="text-ivory/70 text-lg">No Image</span>
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-forest-900"
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4">
          <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="text-xs text-stone uppercase tracking-wider">
              From
            </div>
            <div className="text-xl font-bold text-forest-900">
              ${finalPrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-gold-500 text-forest-900 text-sm font-medium rounded-full">
          <Clock size={14} />
          {finalDays} Days
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-stone mb-2">
          <MapPin size={14} className="text-gold-500" />
          {finalLocation}
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-semibold text-forest-900 mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors duration-300">
          <Link href={`/tours/${finalSlug}`}>{finalTitle}</Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-stone mb-4 line-clamp-2">
          {finalDescription}
        </p>

        {/* Rating & Reviews */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.floor(finalRating)
                    ? "text-gold-500 fill-gold-500"
                    : "text-sand"
                }
              />
            ))}
          </div>
          <span className="text-sm font-medium text-forest-700">
            {finalRating}
          </span>
          <span className="text-sm text-stone">
            ({finalReviewCount} reviews)
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-sand mb-4" />

        {/* CTA */}
        <Link
          href={`/tours/${finalSlug}`}
          className="flex items-center justify-between group/btn"
        >
          <span className="text-sm font-semibold text-forest-700 group-hover/btn:text-gold-500 transition-colors">
            View Details
          </span>
          <div className="w-8 h-8 rounded-full bg-forest-500/10 flex items-center justify-center group-hover/btn:bg-gold-500 transition-all duration-300">
            <ArrowRight
              size={16}
              className="text-forest-700 group-hover/btn:text-white transition-colors"
            />
          </div>
        </Link>
      </div>
    </motion.article>
  );
}
