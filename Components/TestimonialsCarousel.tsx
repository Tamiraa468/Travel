"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { normalizeImageUrl } from "@/lib/images";

type Testimonial = {
  id: string;
  name: string;
  country?: string | null;
  avatar?: string | null;
  rating: number;
  text: string;
  tourName?: string | null;
  travelDate?: string | null;
};

type Props = {
  testimonials: Testimonial[];
  autoPlay?: boolean;
  showNavigation?: boolean;
};

export default function TestimonialsCarousel({
  testimonials,
  autoPlay = true,
  showNavigation = true,
}: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === testimonials.length - 1 ? 0 : prev + 1,
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1,
    );
  };

  useEffect(() => {
    if (autoPlay && testimonials.length > 1) {
      intervalRef.current = setInterval(nextSlide, 5000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [autoPlay, testimonials.length]);

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-gradient-to-br from-sand to-gold-300/20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-forest-900 mb-2">
            What Our Travelers Say
          </h2>
          <p className="text-stone">
            Real experiences from our satisfied customers
          </p>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-10"
            >
              <Quote className="w-12 h-12 text-gold-300 mb-4" />

              <p className="text-lg md:text-xl text-charcoal mb-6 italic leading-relaxed">
                "{testimonials[currentIndex].text}"
              </p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  {testimonials[currentIndex].avatar ? (
                    <Image
                      src={normalizeImageUrl(
                        testimonials[currentIndex].avatar!,
                      )}
                      alt={testimonials[currentIndex].name}
                      width={56}
                      height={56}
                      sizes="56px"
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-forest-700 flex items-center justify-center text-ivory font-bold text-xl">
                      {testimonials[currentIndex].name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-forest-900">
                      {testimonials[currentIndex].name}
                    </p>
                    <p className="text-sm text-stone">
                      {testimonials[currentIndex].country}
                      {testimonials[currentIndex].travelDate &&
                        `, ${testimonials[currentIndex].travelDate}`}
                    </p>
                    {testimonials[currentIndex].tourName && (
                      <p className="text-sm text-gold-500">
                        {testimonials[currentIndex].tourName}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  {renderStars(testimonials[currentIndex].rating)}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          {showNavigation && testimonials.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-sand transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-forest-700" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-sand transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-forest-700" />
              </button>
            </>
          )}
        </div>

        {/* Dots */}
        {testimonials.length > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-gold-500" : "bg-sand"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
