"use client";
import React, { useState, useEffect } from "react";
import { useTravelAgencyContext, Tour } from "../context/TravelAgencyContext";
import TourCard from "./TourCard";

const RecommendedTours: React.FC = () => {
  const { tours } = useTravelAgencyContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  // How many cards to show per slide depending on screen size
  const [cardsPerSlide, setCardsPerSlide] = useState(1);

  useEffect(() => {
    const updateCardsPerSlide = () => {
      if (window.innerWidth >= 1024) setCardsPerSlide(3);
      else if (window.innerWidth >= 768) setCardsPerSlide(2);
      else setCardsPerSlide(1);
    };
    updateCardsPerSlide();
    window.addEventListener("resize", updateCardsPerSlide);
    return () => window.removeEventListener("resize", updateCardsPerSlide);
  }, []);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(tours.length / cardsPerSlide)
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [tours.length, cardsPerSlide]);

  if (!tours || tours.length === 0) return <p>No tours available</p>;

  // Split tours into chunks for each slide
  const slides: Tour[][] = [];
  for (let i = 0; i < tours.length; i += cardsPerSlide) {
    slides.push(tours.slice(i, i + cardsPerSlide));
  }

  return (
    <section className="w-full py-12 bg-white">
      {/* Heading */}
      <div className="text-center mb-8 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-blue-800 mb-4">
          Explore the Beauty of Mongolia
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the vast steppes, pristine lakes, deserts, and rich nomadic
          culture. Choose from our carefully curated tours to experience the
          true spirit of Mongolia.
        </p>
      </div>

      {/* Slider */}
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideTours, index) => (
            <div
              key={index}
              className="min-w-full flex justify-center gap-6 px-4"
            >
              {slideTours.map((tour: Tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          ))}
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <div
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                currentSlide === index ? "bg-blue-600" : "bg-gray-400/40"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedTours;
