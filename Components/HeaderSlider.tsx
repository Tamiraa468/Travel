"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { assets } from "../assets/assets";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  MapPin,
  Calendar,
} from "lucide-react";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Discover the Heart of Mongolia",
      subtitle: "Untouched Wilderness",
      description:
        "Embark on an extraordinary journey through ancient steppes, majestic mountains, and the legendary Gobi Desert",
      buttonText1: "Explore Tours",
      buttonText2: "Watch Video",
      imgSrc: assets.sliderImages[0],
      stats: { duration: "7-21 Days", location: "Ulaanbaatar" },
    },
    {
      id: 2,
      title: "Experience Nomadic Heritage",
      subtitle: "Cultural Immersion",
      description:
        "Live with nomadic families, witness the famous Naadam Festival, and discover a way of life unchanged for centuries",
      buttonText1: "View Experiences",
      buttonText2: "Learn More",
      imgSrc: assets.sliderImages[1],
      stats: { duration: "5-14 Days", location: "Khövsgöl" },
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliderData.length, isAutoPlaying]);

  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const nextSlide = () =>
    handleSlideChange((currentSlide + 1) % sliderData.length);
  const prevSlide = () =>
    handleSlideChange(
      (currentSlide - 1 + sliderData.length) % sliderData.length
    );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900">
      {/* Slides */}
      <AnimatePresence mode="wait">
        {sliderData.map(
          (slide, index) =>
            index === currentSlide && (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.imgSrc}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                />

                {/* Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                    <div className="max-w-2xl">
                      {/* Subtitle Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 backdrop-blur-sm border border-amber-500/30 rounded-full mb-6"
                      >
                        <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                        <span className="text-amber-300 text-sm font-medium tracking-wider uppercase">
                          {slide.subtitle}
                        </span>
                      </motion.div>

                      {/* Title */}
                      <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-lg"
                      >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-200">
                          {slide.title}
                        </span>
                      </motion.h1>

                      {/* Description */}
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.6 }}
                        className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-xl"
                      >
                        {slide.description}
                      </motion.p>

                      {/* Stats */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9, duration: 0.6 }}
                        className="flex items-center gap-6 mb-10"
                      >
                        <div className="flex items-center gap-2 text-white/70">
                          <Calendar size={18} className="text-amber-400" />
                          <span className="text-sm">
                            {slide.stats.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <MapPin size={18} className="text-amber-400" />
                          <span className="text-sm">
                            {slide.stats.location}
                          </span>
                        </div>
                      </motion.div>

                      {/* Buttons */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1, duration: 0.6 }}
                        className="flex flex-wrap gap-4"
                      >
                        <Link
                          href="/tours"
                          className="group relative px-8 py-4 bg-amber-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
                        >
                          <span className="relative z-10">
                            {slide.buttonText1}
                          </span>
                          <div className="absolute inset-0 bg-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </Link>
                        <button className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white hover:text-slate-900 transition-all duration-300">
                          <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-amber-500 flex items-center justify-center transition-colors duration-300">
                            <Play size={16} fill="currentColor" />
                          </div>
                          {slide.buttonText2}
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-6 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute bottom-1/2 translate-y-1/2 right-6 z-20">
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-slate-900 transition-all duration-300"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Progress Dots & Slide Counter */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        <div className="flex items-center gap-3">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => handleSlideChange(index)}
              className="group relative"
            >
              <div
                className={`w-12 h-1 rounded-full transition-all duration-500 ${
                  currentSlide === index ? "bg-amber-500" : "bg-white/30"
                }`}
              >
                {currentSlide === index && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                )}
              </div>
            </button>
          ))}
        </div>
        <span className="text-white/60 text-sm font-medium">
          <span className="text-white">
            {String(currentSlide + 1).padStart(2, "0")}
          </span>
          <span className="mx-1">/</span>
          <span>{String(sliderData.length).padStart(2, "0")}</span>
        </span>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-12 right-12 hidden lg:flex flex-col items-center gap-3"
      >
        <span className="text-white/60 text-xs tracking-widest uppercase rotate-90 origin-center translate-x-8">
          Scroll
        </span>
        <div className="w-px h-16 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </div>
  );
};

export default HeaderSlider;
