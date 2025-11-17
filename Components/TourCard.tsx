"use client";

import Link from "next/link";

type Tour = {
  id?: string;
  slug?: string;
  title: string;
  description?: string;
  price: number;
};

type Props = {
  tour?: Tour;
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  price?: number;
};

export default function TourCard({
  tour,
  title,
  description,
  price,
  slug,
  id,
}: Props) {
  // Support both object and spread props
  const finalTitle = tour?.title || title || "Unknown Tour";
  const finalDescription = tour?.description || description || "";
  const finalPrice = tour?.price ?? price ?? 0;
  const finalSlug = tour?.slug || slug || tour?.id || id || "#";

  return (
    <article className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          <Link href={`/tours/${finalSlug}`}>{finalTitle}</Link>
        </h3>
        <p className="text-sm text-gray-600 mb-3">{finalDescription}</p>
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">${finalPrice.toFixed(2)}</div>
          <Link href={`/tours/${finalSlug}`} className="text-sm text-blue-600">
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
