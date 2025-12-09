"use client";

import Link from "next/link";
import { useWishlist } from "@/Components/Wishlist";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { Heart, Trash2, ShoppingBag, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Heart className="w-8 h-8 text-red-500 fill-red-500" />
              <h1 className="text-3xl font-bold">My Wishlist</h1>
              <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">
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
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Image */}
                  <Link href={`/tours/${tour.slug}`} className="block">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {tour.mainImage ? (
                        <img
                          src={tour.mainImage}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <span className="text-white/70 text-lg">UTravel</span>
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
                      <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                        {tour.title}
                      </h3>
                    </Link>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500">From</span>
                        <span className="ml-1 font-bold text-blue-600">
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
                      className="mt-3 w-full block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      View Tour
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 mb-2">
                Your wishlist is empty
              </h2>
              <p className="text-gray-500 mb-6">
                Start exploring our tours and save your favorites!
              </p>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
