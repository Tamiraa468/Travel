"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Tour = {
  id: string;
  title: string;
  slug: string;
  priceFrom: number;
  mainImage?: string | null;
  days: number;
  description?: string | null;
};

type Props = {
  tours: Tour[];
  title?: string;
  currentTourId?: string;
};

export default function RelatedTours({
  tours,
  title = "Related Tours",
  currentTourId,
}: Props) {
  // Filter out current tour and limit to 3
  const filteredTours = tours
    .filter((tour) => tour.id !== currentTourId)
    .slice(0, 3);

  if (filteredTours.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <Link
              key={tour.id}
              href={`/tours/${tour.slug}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative aspect-[16/10] overflow-hidden">
                {tour.mainImage ? (
                  <img
                    src={tour.mainImage}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
                    <span className="text-ivory/70 text-lg">No Image</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-medium text-charcoal">
                  {tour.days} Days
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-charcoal mb-1 group-hover:text-gold-500 transition-colors line-clamp-2">
                  {tour.title}
                </h3>
                {tour.description && (
                  <p className="text-sm text-stone line-clamp-2 mb-3">
                    {tour.description}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-stone">From</span>
                    <span className="ml-1 font-bold text-forest-700">
                      ${tour.priceFrom.toLocaleString()}
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-gold-500 group-hover:gap-2 transition-all">
                    View <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-ivory rounded-lg hover:bg-forest-700 transition-colors"
          >
            View All Tours <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
