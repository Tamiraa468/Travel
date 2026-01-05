import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import TourPackageSection from "@/Components/TourPackageSection";
import TourHeroWrapper from "@/Components/TourHeroWrapper";
import ItineraryAccordion from "@/Components/ItineraryAccordion";
import PricingTable from "@/Components/PricingTable";
import IncludesExcludes from "@/Components/IncludesExcludes";
import PhotoGallery from "@/Components/PhotoGallery";
import TourMap from "@/Components/TourMap";
import RelatedTours from "@/Components/RelatedTours";
import {
  Calendar,
  Users,
  Mountain,
  Sun,
  Check,
  Sparkles,
  Shield,
  Award,
} from "lucide-react";

type Props = { params: { slug: string } };

export default async function TourPage({ params }: Props) {
  const { slug } = params;

  // Try find by slug first
  let tour = await prisma.tour.findUnique({
    where: { slug },
    include: {
      dates: true,
      category: true,
      itinerary: { orderBy: { dayNumber: "asc" } },
      priceTiers: { orderBy: { minPax: "asc" } },
    },
  });

  // Fallback search by id
  if (!tour) {
    tour = await prisma.tour.findUnique({
      where: { id: slug },
      include: {
        dates: true,
        category: true,
        itinerary: { orderBy: { dayNumber: "asc" } },
        priceTiers: { orderBy: { minPax: "asc" } },
      },
    });
  }

  if (!tour) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h1 className="text-4xl font-serif font-bold text-slate-800 mb-4">
              Tour Not Found
            </h1>
            <p className="text-slate-600 mb-8">
              The tour you're looking for doesn't exist or has been removed.
            </p>
            <a
              href="/tours"
              className="px-6 py-3 bg-amber-500 text-white rounded-full font-semibold hover:bg-amber-600 transition-colors"
            >
              Browse All Tours
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Fetch related tours (same category or similar duration)
  const relatedTours = await prisma.tour.findMany({
    where: {
      isActive: true,
      id: { not: tour.id },
      OR: [
        { categoryId: tour.categoryId },
        { days: { gte: tour.days - 2, lte: tour.days + 2 } },
      ],
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <TourHeroWrapper
        title={tour.title}
        rating={4.8}
        reviewCount={29}
        duration={tour.days}
        nights={tour.days - 1}
        price={tour.priceFrom}
        tourId={tour.id}
        tourName={tour.title}
      />

      {/* Main Content Area - Two Column Layout */}
      <div className="bg-slate-50 relative">
        {/* Decorative top curve */}
        <div className="absolute -top-16 left-0 w-full h-16 bg-slate-50 rounded-t-[50%]" />

        <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-3 gap-10 relative">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Tour Overview Card */}
            <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-800">
                  About This Tour
                </h2>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  {tour.days} Days / {tour.days - 1} Nights
                </span>
                {tour.groupSize && (
                  <span className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    <Users className="w-4 h-4 text-amber-500" />
                    {tour.groupSize}
                  </span>
                )}
                {tour.activityLevel && (
                  <span className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    <Mountain className="w-4 h-4 text-amber-500" />
                    {tour.activityLevel}
                  </span>
                )}
                {tour.season && (
                  <span className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                    <Sun className="w-4 h-4 text-amber-500" />
                    {tour.season}
                  </span>
                )}
                {tour.category && (
                  <span className="px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                    {tour.category.name}
                  </span>
                )}
              </div>

              <p className="text-slate-600 text-lg leading-relaxed">
                {tour.description}
              </p>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-600">
                  <Shield className="w-5 h-5 text-green-500" />
                  <span className="text-sm">Free Cancellation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Award className="w-5 h-5 text-amber-500" />
                  <span className="text-sm">Best Price Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Check className="w-5 h-5 text-blue-500" />
                  <span className="text-sm">Verified Experience</span>
                </div>
              </div>
            </section>

            {/* Tour Highlights */}
            {tour.highlights && tour.highlights.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                    <Award className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-slate-800">
                    Tour Highlights
                  </h2>
                </div>
                <ul className="grid md:grid-cols-2 gap-4">
                  {tour.highlights.map((highlight, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-4 p-4 bg-gradient-to-r from-amber-50 to-slate-50 rounded-xl border border-amber-100/50 hover:shadow-md transition-shadow"
                    >
                      <span className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 shadow-sm">
                        {index + 1}
                      </span>
                      <span className="text-slate-700 leading-relaxed">
                        {highlight}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Day-by-Day Itinerary */}
            {tour.itinerary && tour.itinerary.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                <ItineraryAccordion itinerary={tour.itinerary} />
              </section>
            )}

            {/* Includes / Excludes */}
            <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <IncludesExcludes
                includes={tour.includes || []}
                excludes={tour.excludes || []}
              />
            </section>

            {/* Photo Gallery */}
            {tour.images && tour.images.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                <PhotoGallery images={tour.images} title="Photo Gallery" />
              </section>
            )}

            {/* Tour Map */}
            {tour.mapEmbed && (
              <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
                <TourMap mapEmbed={tour.mapEmbed} title="Tour Route Map" />
              </section>
            )}

            {/* Available Dates */}
            <section className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-slate-800">
                  Available Dates
                </h2>
              </div>

              {tour.dates && tour.dates.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {tour.dates.map((d) => (
                    <div
                      key={d.id}
                      className="p-5 border border-slate-200 rounded-xl hover:border-amber-300 hover:shadow-md transition-all bg-gradient-to-r from-white to-slate-50 group cursor-pointer"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-serif font-semibold text-slate-800 text-lg group-hover:text-amber-600 transition-colors">
                            {new Date(d.startDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}{" "}
                            -{" "}
                            {new Date(d.endDate).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-sm text-slate-500 mt-2 flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            {d.capacity} spots available
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          Open
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-slate-50 rounded-xl">
                  <Calendar className="w-12 h-12 text-stone mx-auto mb-3" />
                  <p className="text-slate-600 mb-2">No scheduled dates yet</p>
                  <p className="text-slate-500 text-sm">
                    Contact us for custom dates and private tours.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Sticky Price Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Price Tiers Table */}
              {tour.priceTiers && tour.priceTiers.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <PricingTable priceTiers={tour.priceTiers} />
                </div>
              )}

              {/* Booking Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <TourPackageSection
                  price={tour.priceFrom}
                  tourId={tour.id}
                  tourName={tour.title}
                />
              </div>

              {/* Help Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <h3 className="font-serif font-bold text-lg mb-2">
                  Need Help?
                </h3>
                <p className="text-stone text-sm mb-4">
                  Our travel experts are here to help you plan your perfect
                  trip.
                </p>
                <a
                  href="/contact"
                  className="block text-center py-3 bg-amber-500 hover:bg-amber-600 rounded-xl font-semibold transition-colors"
                >
                  Contact Us
                </a>
                <div className="mt-4 pt-4 border-t border-slate-700 text-center">
                  <p className="text-slate-400 text-xs">Or call us at</p>
                  <p className="text-white font-semibold">+976 8947-5188</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Tours */}
      {relatedTours.length > 0 && (
        <div className="bg-white py-16">
          <RelatedTours
            tours={relatedTours}
            title="You Might Also Like"
            currentTourId={tour.id}
          />
        </div>
      )}

      <Footer />
    </>
  );
}
