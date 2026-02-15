"use client";
import React from "react";
import { motion } from "framer-motion";
import { heroImages, SIZES } from "@/lib/images";
import Image from "next/image";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full h-[58vh] md:h-[70vh] lg:h-[80vh] overflow-hidden">
      {/* Background Image */}
      <Image
        src={heroImages.home.src}
        alt={heroImages.home.alt}
        fill
        sizes={SIZES.hero}
        className="absolute top-0 left-0 object-cover"
        priority
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Hero Text */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight">
            Our Tours
          </h1>
          <p className="mt-4 text-sm md:text-lg text-white/90">
            Explore the best tours curated for you
          </p>

          {/* Scroll Down Indicator */}
          <div className="mt-8 flex justify-center">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center"
              aria-hidden="true"
            >
              <span className="block w-1 h-2 bg-white/80" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
