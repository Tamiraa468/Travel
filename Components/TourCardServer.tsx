import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Star, ArrowRight } from "lucide-react";
import type { TourListItem } from "@/lib/tours";

type Props = {
  tour: TourListItem;
  index?: number;
};

/**
 * Server-compatible TourCard — no "use client", no framer-motion.
 * Uses next/image with proper sizes for CLS-free lazy loading.
 */
export default function TourCardServer({ tour, index = 0 }: Props) {
  const truncatedDesc = tour.description
    ? tour.description.length > 120
      ? tour.description.substring(0, 120) + "..."
      : tour.description
    : "";

  return (
    <article className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500">
      {/* Image Container — aspect ratio wrapper prevents CLS */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {tour.mainImage ? (
          <Image
            src={tour.mainImage}
            alt={tour.title}
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

        {/* Price Tag */}
        <div className="absolute bottom-4 left-4">
          <div className="px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg">
            <div className="text-xs text-stone uppercase tracking-wider">
              From
            </div>
            <div className="text-xl font-bold text-forest-900">
              ${tour.priceFrom.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Duration Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-gold-500 text-forest-900 text-sm font-medium rounded-full">
          <Clock size={14} />
          {tour.days} Days
        </div>

        {/* Featured Badge */}
        {tour.isFeatured && (
          <div className="absolute top-4 right-4 px-3 py-1.5 bg-forest-700 text-gold-300 text-xs font-semibold rounded-full uppercase tracking-wide">
            Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        {tour.category && (
          <div className="flex items-center gap-1.5 text-sm text-stone mb-2">
            <MapPin size={14} className="text-gold-500" />
            {tour.category.name}
          </div>
        )}

        {/* Title */}
        <h3 className="text-xl font-serif font-semibold text-forest-900 mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors duration-300">
          <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
        </h3>

        {/* Description */}
        {truncatedDesc && (
          <p className="text-sm text-stone mb-4 line-clamp-2">
            {truncatedDesc}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-sand mb-4" />

        {/* CTA */}
        <Link
          href={`/tours/${tour.slug}`}
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
    </article>
  );
}
