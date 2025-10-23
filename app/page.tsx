import Navbar from "../Components/Navbar";
import HeaderSlider from "../Components/HeaderSlider";
import RecommendedTours from "@/Components/RecommendedTours";
import WhyChooseUs from "@/Components/WhyChooseUs";
import Footer from "@/Components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <div>
        <HeaderSlider />
        <RecommendedTours />
        <WhyChooseUs />
      </div>
      <Footer />
    </>
  );
}
