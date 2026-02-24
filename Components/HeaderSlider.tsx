"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { sliderImages as registrySliders, SIZES } from "@/lib/images";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  MapPin,
  Calendar,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { optimizeImage } from "@/lib/image";

// Tour type for slider data
type SliderTour = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText1: string;
  buttonText2: string;
  imgSrc: string | any;
  stats: { duration: string; location: string };
};

const HeaderSlider = () => {
  const { t } = useLanguage();

  const [tours, setTours] = useState<SliderTour[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback slider data when no tours available
  const fallbackSliderData: SliderTour[] = [
    {
      id: "fallback-1",
      slug: "",
      title: t.hero.title,
      subtitle: t.hero.untouchedWilderness,
      description: t.hero.subtitle,
      buttonText1: t.hero.exploreTours,
      buttonText2: t.hero.watchVideo,
      imgSrc: registrySliders[0].src,
      stats: { duration: "7-21 " + t.common.days, location: "Mongolia" },
    },
  ];

  // Fetch tours from API
  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await fetch("/api/tours?limit=6");
        const result = await response.json();
        const dbTours = result.data || result || [];

        if (dbTours.length > 0) {
          // Map database tours to slider format
          const mappedTours: SliderTour[] = dbTours.map(
            (tour: any, index: number) => ({
              id: tour.id,
              slug: tour.slug || tour.id,
              title: tour.title,
              subtitle:
                tour.category || tour.tourType || t.hero.untouchedWilderness,
              description:
                tour.shortDescription ||
                tour.description?.substring(0, 150) + "..." ||
                "",
              buttonText1: t.hero.exploreTours,
              buttonText2: t.common.learnMore,
              imgSrc: optimizeImage(
                tour.mainImageUrl ||
                  tour.mainImage ||
                  tour.images?.[0] ||
                  registrySliders[index % registrySliders.length].src,
                1920,
              ),
              stats: {
                duration: tour.days
                  ? `${tour.days} ${t.common.days}`
                  : tour.duration || "7 " + t.common.days,
                location: tour.region || tour.location || "Mongolia",
              },
            }),
          );
          setTours(mappedTours);
        } else {
          setTours(fallbackSliderData);
        }
      } catch (error) {
        console.error("Error fetching tours for slider:", error);
        setTours(fallbackSliderData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTours();
  }, [t]);

  const sliderData = tours.length > 0 ? tours : fallbackSliderData;

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
      (currentSlide - 1 + sliderData.length) % sliderData.length,
    );

  return (
    <div className="relative w-full h-screen overflow-hidden bg-forest-900">
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
                  sizes={SIZES.hero}
                  className="object-cover"
                  priority={index === 0}
                />

                {/* Luxury Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-forest-900/90 via-forest-900/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-transparent to-forest-900/30" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
                    <div className="max-w-2xl">
                      {/* Subtitle Badge */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 backdrop-blur-sm border border-gold-500/30 rounded-full mb-6"
                      >
                        <span className="w-2 h-2 bg-gold-500 rounded-full animate-pulse" />
                        <span className="text-gold-300 text-sm font-medium tracking-wider uppercase">
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
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-300 to-gold-300">
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
                          <Calendar size={18} className="text-gold-500" />
                          <span className="text-sm">
                            {slide.stats.duration}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-white/70">
                          <MapPin size={18} className="text-gold-500" />
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
                          href={slide.slug ? `/tours/${slide.slug}` : "/tours"}
                          className="group relative px-8 py-4 bg-gold-500 text-forest-900 font-semibold rounded-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/30"
                        >
                          <span className="relative z-10">
                            {slide.buttonText1}
                          </span>
                          <div className="absolute inset-0 bg-gold-300 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                        </Link>
                        <Link
                          href="/tours"
                          className="group flex items-center gap-3 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white hover:text-forest-900 transition-all duration-300"
                        >
                          <div className="w-10 h-10 rounded-full bg-white/20 group-hover:bg-gold-500 flex items-center justify-center transition-colors duration-300">
                            <Play size={16} fill="currentColor" />
                          </div>
                          {slide.buttonText2}
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ),
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-6 z-20">
        <button
          onClick={prevSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-forest-900 transition-all duration-300"
        >
          <ChevronLeft size={24} />
        </button>
      </div>
      <div className="absolute bottom-1/2 translate-y-1/2 right-6 z-20">
        <button
          onClick={nextSlide}
          className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-forest-900 transition-all duration-300"
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
                  currentSlide === index ? "bg-gold-500" : "bg-white/30"
                }`}
              >
                {currentSlide === index && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "linear" }}
                    className="h-full bg-gold-300 rounded-full"
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
