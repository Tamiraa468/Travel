import dynamic from "next/dynamic";
import Navbar from "@/Components/Navbar";
import PartnersSection from "@/Components/PartnersSection";
import Footer from "@/Components/Footer";
import type { Metadata } from "next";

// ---------------------------------------------------------------------------
// Dynamic imports – heavy client components loaded AFTER initial paint.
// Each uses framer-motion + client-side data fetching, so ssr:false is safe.
// The skeleton fallbacks keep CLS near zero while JS loads.
// ---------------------------------------------------------------------------

const HeaderSlider = dynamic(() => import("@/Components/HeaderSlider"), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[80vh] bg-forest-900 animate-pulse flex items-center justify-center">
      <div className="text-center space-y-4 px-6">
        <div className="h-10 w-72 bg-white/10 rounded mx-auto" />
        <div className="h-6 w-96 bg-white/10 rounded mx-auto" />
        <div className="h-12 w-40 bg-gold-500/20 rounded-full mx-auto mt-6" />
      </div>
    </div>
  ),
});

const RecommendedTours = dynamic(
  () => import("@/Components/RecommendedTours"),
  {
    ssr: false,
    loading: () => (
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-8 w-64 bg-gray-200 rounded mx-auto mb-10 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 bg-gray-100 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    ),
  },
);

const WhyChooseUs = dynamic(() => import("@/Components/WhyChooseUs"), {
  ssr: false,
  loading: () => (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-8 w-48 bg-gray-200 rounded mx-auto mb-10 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-48 bg-gray-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </section>
  ),
});

const CTASection = dynamic(() => import("@/Components/CTASection"), {
  ssr: false,
  loading: () => (
    <section className="py-32 bg-forest-900 animate-pulse">
      <div className="max-w-3xl mx-auto text-center px-6">
        <div className="h-10 w-80 bg-white/10 rounded mx-auto mb-4" />
        <div className="h-6 w-96 bg-white/10 rounded mx-auto" />
      </div>
    </section>
  ),
});

export const metadata: Metadata = {
  title: "Maralgoo Dreamland - Mongolia Tours & Travel",
  description:
    "Discover authentic Mongolia adventures with Maralgoo Dreamland. Expert-guided tours to the Gobi Desert, nomadic experiences, and unforgettable journeys across the land of eternal blue sky.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Maralgoo Dreamland - Mongolia Tours & Travel",
    description:
      "Discover authentic Mongolia adventures with expert-guided tours to the Gobi Desert and nomadic experiences.",
    url: "/",
  },
};

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeaderSlider />
        <RecommendedTours />
        <WhyChooseUs />
        <PartnersSection />
        {/* <TestimonialsSection /> */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
