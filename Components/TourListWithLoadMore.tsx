"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import TourCardServer from "@/Components/TourCardServer";
import type { TourListItem } from "@/lib/tour-image";

type Props = {
  initialTours: TourListItem[];
  totalCount: number;
  pageSize: number;
  categoryId?: string | null;
};

/**
 * Client component that handles "Load more" pagination.
 * First page is server-rendered; subsequent pages fetched from /api/tours.
 */
export default function TourListWithLoadMore({
  initialTours,
  totalCount,
  pageSize,
  categoryId,
}: Props) {
  const [tours, setTours] = useState<TourListItem[]>(initialTours);
  const [page, setPage] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [isLoading, setIsLoading] = useState(false);

  const hasMore = tours.length < totalCount;

  const loadMore = async () => {
    setIsLoading(true);
    try {
      const nextPage = page + 1;
      const params = new URLSearchParams({
        page: String(nextPage),
        pageSize: String(pageSize),
      });
      if (categoryId) params.set("categoryId", categoryId);

      const res = await fetch(`/api/tours/list?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      startTransition(() => {
        setTours((prev) => [...prev, ...data.tours]);
        setPage(nextPage);
      });
    } catch (err) {
      console.error("Load more failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tours.map((tour, index) => (
          <TourCardServer key={tour.id} tour={tour} index={index} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-12">
          <button
            onClick={loadMore}
            disabled={isLoading || isPending}
            className="group flex items-center gap-2 px-8 py-4 bg-gold-500 text-forest-900 font-semibold rounded-full hover:bg-gold-400 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading || isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load More Tours
                <span className="text-sm opacity-75">
                  ({tours.length}/{totalCount})
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}
