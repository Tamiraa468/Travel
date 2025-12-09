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
    <section
      className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20 md:py-28"
      ref={sectionRef as any}
    >
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-block text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4"
          >
            Explore Mongolia
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-200">
              Our Tours
            </span>
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={triggered ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={triggered ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-slate-300 max-w-2xl mx-auto"
          >
            Choose from our carefully curated collection of extraordinary
            journeys across Mongolia
          </motion.p>
        </div>

        {/* Tours Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
          variants={container}
          initial="hidden"
          animate={triggered ? "visible" : "hidden"}
        >
          {tours.map((tour) => (
            <motion.div key={tour.id} variants={item}>
              <div className="transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]">
                <TourCard tour={tour} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ToursSection;
