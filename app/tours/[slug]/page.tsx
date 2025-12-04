import React from "react";
import prisma from "@/lib/prisma";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import TourPackageSection from "@/Components/TourPackageSection";
import TourHeroWrapper from "@/Components/TourHeroWrapper";

type Props = { params: { slug: string } };

export default async function TourPage({ params }: Props) {
  const { slug } = params;

  // Try find by slug first
  let tour = await prisma.tour.findUnique({
    where: { slug },
    include: { dates: true },
  });

  // Fallback search by id
  if (!tour) {
    tour = await prisma.tour.findUnique({
      where: { id: slug },
      include: { dates: true },
    });
  }

  if (!tour) {
    return (
      <main className="max-w-4xl mx-auto py-20">
        <h1 className="text-2xl font-semibold">Tour not found</h1>
      </main>
    );
  }

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
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-bold mb-2">{tour.title}</h1>
          <p className="text-gray-600 mb-6">{tour.description}</p>
          <div className="mb-6">
            <strong>Price:</strong> ${tour.priceFrom.toFixed(2)} —{" "}
            <strong>Duration:</strong> {tour.days} days
          </div>

          <section>
            <h2 className="text-xl font-semibold mb-3">Available Dates</h2>
            {tour.dates && tour.dates.length > 0 ? (
              <ul className="space-y-3">
                {tour.dates.map((d) => (
                  <li key={d.id} className="p-3 border rounded">
                    <div>
                      <strong>
                        {new Date(d.startDate).toLocaleDateString()}
                      </strong>{" "}
                      — {new Date(d.endDate).toLocaleDateString()}
                    </div>
                    <div>Capacity: {d.capacity}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No dates available yet</p>
            )}
          </section>
        </div>

        {/* Right Column - Sticky Price Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <TourPackageSection
              price={tour.priceFrom}
              tourId={tour.id}
              tourName={tour.title}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
