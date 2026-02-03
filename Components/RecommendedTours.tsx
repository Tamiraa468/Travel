"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useTravelAgencyContext, Tour } from "../context/TravelAgencyContext";
import TourCard from "./TourCard";
import { ChevronLeft, ChevronRight, Compass } from "lucide-react";

const RecommendedTours: React.FC = () => {
  const { tours, fetchTours } = useTravelAgencyContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(1);
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -100px 0px",
  });

  // Ensure tours are loaded in context on first mount
  useEffect(() => {
    if (!tours || tours.length === 0) {
      fetchTours().catch((err) => console.error("Failed to fetch tours:", err));
    }
  }, [tours, fetchTours]);

  // Handle responsive card count
  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth >= 1280) setCardsPerSlide(3);
      else if (window.innerWidth >= 768) setCardsPerSlide(2);
      else setCardsPerSlide(1);
    };
    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);
    return () => window.removeEventListener("resize", updateCardsPerSlide);
  }, []);

  // Split tours into chunks for each slide
  const slides: Tour[][] = [];
  for (let i = 0; i < tours.length; i += cardsPerSlide) {
    slides.push(tours.slice(i, i + cardsPerSlide));
  }

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-ivory overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-forest-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/10 rounded-full mb-6">
            <Compass size={18} className="text-gold-500" />
            <span className="text-sm font-medium text-gold-700 tracking-wide uppercase">
              Featured Destinations
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest-900 mb-6">
            Explore the Beauty of{" "}
            <span className="text-gold-500">Mongolia</span>
          </h2>

          <p className="text-lg text-stone max-w-2xl mx-auto leading-relaxed">
            Discover vast steppes, pristine lakes, and rich nomadic culture.
            Choose from our carefully curated tours to experience the true
            spirit of Mongolia.
          </p>

          {/* Decorative Line */}
          <div className="flex items-center justify-center gap-3 mt-8">
            <div className="w-12 h-px bg-sand" />
            <div className="w-3 h-3 bg-gold-500 rounded-full" />
            <div className="w-12 h-px bg-sand" />
          </div>
        </motion.div>

        {/* Tours Grid */}
        <div className="relative">
          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-forest-700 hover:text-gold-500 hover:shadow-xl transition-all duration-300 hidden lg:flex"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-forest-700 hover:text-gold-500 hover:shadow-xl transition-all duration-300 hidden lg:flex"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Slider */}
          <div className="overflow-hidden">
            <motion.div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {slides.map((slideTours, slideIndex) => (
                <div
                  key={slideIndex}
                  className="min-w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 px-2"
                >
                  {slideTours.map((tour: Tour, tourIndex: number) => (
                    <TourCard key={tour.id} tour={tour} index={tourIndex} />
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Dots */}
          {slides.length > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentSlide === index
                      ? "w-8 bg-gold-500"
                      : "w-2 bg-sand hover:bg-stone"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Link
            href="/tours"
            className="inline-flex items-center gap-3 px-8 py-4 bg-forest-900 text-ivory font-semibold rounded-full hover:bg-forest-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            View All Tours
            <ChevronRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default RecommendedTours;
