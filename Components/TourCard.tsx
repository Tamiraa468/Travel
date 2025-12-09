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
  price: number;
  priceFrom?: number;
  days?: number;
  images?: string[];
  rating?: number;
  reviewCount?: number;
  location?: string;
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
  const finalDays = tour?.days || days || 7;
  const finalImages = tour?.images || images || [];
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
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden">
        {finalImages.length > 0 ? (
          <Image
            src={finalImages[0]}
            alt={finalTitle}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            <MapPin className="w-12 h-12 text-slate-400" />
          </div>
        )}

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white/20 backdrop-blur-sm text-white hover:bg-white hover:text-slate-900"
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4">
          <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="text-xs text-slate-500 uppercase tracking-wider">
              From
            </div>
            <div className="text-xl font-bold text-slate-900">
              ${finalPrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-sm font-medium rounded-full">
          <Clock size={14} />
          {finalDays} Days
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Location */}
        <div className="flex items-center gap-1.5 text-sm text-slate-500 mb-2">
          <MapPin size={14} className="text-amber-500" />
          {finalLocation}
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-amber-600 transition-colors duration-300">
          <Link href={`/tours/${finalSlug}`}>{finalTitle}</Link>
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
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
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-300"
                }
              />
            ))}
          </div>
          <span className="text-sm font-medium text-slate-700">
            {finalRating}
          </span>
          <span className="text-sm text-slate-400">
            ({finalReviewCount} reviews)
          </span>
        </div>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-4" />

        {/* CTA */}
        <Link
          href={`/tours/${finalSlug}`}
          className="flex items-center justify-between group/btn"
        >
          <span className="text-sm font-semibold text-amber-600 group-hover/btn:text-amber-700 transition-colors">
            View Details
          </span>
          <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center group-hover/btn:bg-amber-500 transition-all duration-300">
            <ArrowRight
              size={16}
              className="text-amber-600 group-hover/btn:text-white transition-colors"
            />
          </div>
        </Link>
      </div>
    </motion.article>
  );
}
