"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/Components/Wishlist";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { normalizeImageUrl, SIZES } from "@/lib/images";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow bg-sand">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <h1 className="text-3xl font-bold text-forest-900">
                My Wishlist
              </h1>
              <span className="bg-sand text-charcoal px-3 py-1 rounded-full text-sm border border-sand">
                {wishlist.length} tours
              </span>
            </div>
            {wishlist.length > 0 && (
              <button
                onClick={clearWishlist}
                className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>

          {wishlist.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlist.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-ivory rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-sand"
                >
                  {/* Image */}
                  <Link href={`/tours/${tour.slug}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {tour.mainImage ? (
                        <Image
                          src={normalizeImageUrl(tour.mainImage)}
                          alt={tour.title}
                          fill
                          sizes={SIZES.card}
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
                          <span className="text-white/70 text-lg">
                            Maralgoo Dreamland
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-sm">
                        {tour.days} Days
                      </div>
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-4">
                    <Link href={`/tours/${tour.slug}`}>
                      <h3 className="font-semibold text-forest-900 mb-2 hover:text-forest-700 transition-colors">
                        {tour.title}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-charcoal">From</span>
                        <span className="ml-1 font-bold text-forest-700">
                          ${tour.priceFrom.toLocaleString()}
                        </span>
                      </div>

                      <button
                        onClick={() => removeFromWishlist(tour.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Remove from wishlist"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <Link
                      href={`/tours/${tour.slug}`}
                      className="mt-3 w-full block text-center px-4 py-2 bg-forest-900 text-white rounded-lg hover:bg-forest-700 transition-colors"
                    >
                      View Tour
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-ivory rounded-xl border border-sand">
              <ShoppingBag className="w-16 h-16 text-stone mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-forest-900 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-charcoal mb-6">
                Start exploring our tours and save your favorites!
              </p>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-white rounded-lg hover:bg-forest-700 transition-colors"
              >
                Browse Tours <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
