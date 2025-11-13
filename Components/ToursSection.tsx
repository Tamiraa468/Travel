"use client";
import React, { useRef } from "react";
import { motion } from "framer-motion";
import TourCard from "./TourCard";
import { useTravelAgencyContext } from "../context/TravelAgencyContext";
import { useScrollAnimationTrigger } from "@/hooks/useScrollDirection";

const ToursSection: React.FC = () => {
  const { tours } = useTravelAgencyContext();
  const sectionRef = useRef<HTMLElement | null>(null);
  const triggered = useScrollAnimationTrigger(sectionRef as any, {
    threshold: 0.1,
    rootMargin: "-120px 0px 0px 0px",
  });

  const container = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.12,
        when: "beforeChildren",
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as any },
    },
  };

  return (
    <section className="container mx-auto px-4 py-12" ref={sectionRef as any}>
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-800">Our Tours</h2>
        <p className="text-gray-600 mt-2">
          Choose from curated tours across Mongolia.
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
        variants={container}
        initial="hidden"
        animate={triggered ? "visible" : "hidden"}
      >
        {tours.map((tour) => (
          <motion.div key={tour.id} variants={item}>
            <div className="transform transition duration-300 hover:-translate-y-2 hover:shadow-xl hover:scale-[1.02]">
              <TourCard tour={tour} />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default ToursSection;
