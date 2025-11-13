"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTravelAgencyContext, Tour } from "../context/TravelAgencyContext";
import TourCard from "./TourCard";
import TOURS from "@/data/tours";

const RecommendedTours: React.FC = () => {
  const { tours, fetchTours } = useTravelAgencyContext();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerSlide, setCardsPerSlide] = useState(1);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const sectionRef = useRef(null);

  // Animation trigger: only when scrolled into view AND scrolling down
  const isInView = useInView(sectionRef, {
    once: true, // Animation plays only once, when first entering viewport
    margin: "0px 0px -100px 0px", // Trigger 100px before entering viewport
  });

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrollingDown(currentScrollY > lastScrollY);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Use tours from context if available, otherwise fallback to TOURS data
  const displayTours = tours && tours.length > 0 ? tours : TOURS;

  // Ensure tours are loaded in context on first mount
  useEffect(() => {
    if (!tours || tours.length === 0) {
      fetchTours().catch((err) => console.error("Failed to fetch tours:", err));
    }
  }, [tours, fetchTours]);

  // Handle responsive card count
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

  // Auto-rotate carousel every 5 seconds
  useEffect(() => {
    if (!displayTours || displayTours.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(displayTours.length / cardsPerSlide)
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [displayTours.length, cardsPerSlide]);

  // Split tours into chunks for each slide
  const slides: Tour[][] = [];
  for (let i = 0; i < displayTours.length; i += cardsPerSlide) {
    slides.push(displayTours.slice(i, i + cardsPerSlide));
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" as any },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" as any },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as any },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      className="w-full py-12 bg-white"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Heading */}
      <motion.div
        className="text-center mb-8 px-4"
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-blue-800 mb-4"
          variants={headingVariants}
        >
          Explore the Beauty of Mongolia
        </motion.h2>
        <motion.p
          className="text-gray-600 max-w-2xl mx-auto"
          variants={textVariants}
        >
          Discover the vast steppes, pristine lakes, deserts, and rich nomadic
          culture. Choose from our carefully curated tours to experience the
          true spirit of Mongolia.
        </motion.p>
      </motion.div>

      {/* Slider */}
      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slideTours, index) => (
            <motion.div
              key={index}
              className="min-w-full flex justify-center gap-6 px-4"
              variants={containerVariants}
            >
              {slideTours.map((tour: Tour) => (
                <motion.div
                  key={tour.id}
                  variants={cardVariants}
                  whileHover={{
                    y: -8,
                    boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
                    transition: { duration: 0.3 },
                  }}
                >
                  <TourCard tour={tour} />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Slide indicators */}
        <motion.div
          className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${
                currentSlide === index ? "bg-blue-600" : "bg-gray-400/40"
              }`}
              whileHover={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default RecommendedTours;
