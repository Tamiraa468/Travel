import Navbar from "../Components/Navbar";
import HeaderSlider from "../Components/HeaderSlider";
import RecommendedTours from "@/Components/RecommendedTours";
import WhyChooseUs from "@/Components/WhyChooseUs";
import Footer from "@/Components/Footer";
import TestimonialsSection from "@/Components/TestimonialsSection";
import CTASection from "@/Components/CTASection";
import type { Metadata } from "next";

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
        {/* <TestimonialsSection /> */}
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
