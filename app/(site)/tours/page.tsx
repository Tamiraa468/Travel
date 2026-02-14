import type { Metadata } from "next";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import TourListWithLoadMore from "@/Components/TourListWithLoadMore";
import { getToursPaginated, getTourCategories } from "@/lib/tours";

// ISR: revalidate every hour — tours are server-rendered HTML for SEO
export const revalidate = 3600;

const PAGE_SIZE = 9;

export const metadata: Metadata = {
  title: "Tours",
  description:
    "Explore our collection of authentic Mongolia tours. From Gobi Desert adventures to nomadic experiences, find your perfect journey.",
  alternates: {
    canonical: "/tours",
  },
  openGraph: {
    title: "Mongolia Tours - Maralgoo Dreamland",
    description:
      "Explore our collection of authentic Mongolia tours and adventures.",
    url: "/tours",
  },
};

export default async function ToursPage() {
  const { tours, totalCount } = await getToursPaginated({
    page: 1,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-forest-900 via-forest-700 to-forest-900 py-20 md:py-28">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="inline-block text-gold-500 text-sm font-semibold tracking-widest uppercase mb-4">
                Explore Mongolia
              </span>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-300 to-gold-300">
                  Our Tours
                </span>
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-gold-500 to-gold-700 mx-auto mb-6" />
              <p className="text-lg text-ivory/80 max-w-2xl mx-auto">
                Discover handcrafted journeys through Mongolia&apos;s most
                breathtaking landscapes and cultures.
              </p>
            </div>

            {/* Tours Grid + Load More (first page is server-rendered HTML) */}
            <TourListWithLoadMore
              initialTours={tours}
              totalCount={totalCount}
              pageSize={PAGE_SIZE}
            />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
