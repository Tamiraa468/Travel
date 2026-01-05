import Navbar from "../Components/Navbar";
import HeaderSlider from "../Components/HeaderSlider";
import RecommendedTours from "@/Components/RecommendedTours";
import WhyChooseUs from "@/Components/WhyChooseUs";
import Footer from "@/Components/Footer";
import TestimonialsSection from "@/Components/TestimonialsSection";
import CTASection from "@/Components/CTASection";

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
