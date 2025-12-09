"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Sarah Mitchell",
    location: "New York, USA",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "An absolutely unforgettable experience! The attention to detail and personalized service made our honeymoon in the Maldives truly magical. Every moment was carefully curated to perfection.",
    tour: "Luxury Maldives Escape",
  },
  {
    id: 2,
    name: "James & Emily Chen",
    location: "London, UK",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "From the private villa to the exclusive dining experiences, everything exceeded our expectations. UTravel transformed our dream vacation into reality with impeccable service.",
    tour: "Bali Paradise Journey",
  },
  {
    id: 3,
    name: "Alessandro Romano",
    location: "Milan, Italy",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The level of luxury and exclusivity was beyond compare. Our guide was incredibly knowledgeable, and the private experiences arranged were simply extraordinary.",
    tour: "Swiss Alps Adventure",
  },
  {
    id: 4,
    name: "Victoria Adams",
    location: "Sydney, Australia",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "UTravel redefined what a vacation could be. The seamless coordination, stunning accommodations, and thoughtful touches made this the trip of a lifetime.",
    tour: "Santorini Sunset Experience",
  },
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-sm font-medium tracking-wide mb-4">
            Client Stories
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-4">
            What Our Travelers Say
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto rounded-full" />
        </motion.div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-3xl shadow-xl p-8 md:p-12 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-6 left-12 w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-white" fill="white" />
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Profile */}
                <div className="flex-shrink-0 text-center md:text-left">
                  <div className="relative inline-block">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-amber-100">
                      <Image
                        src={testimonials[currentIndex].image}
                        alt={testimonials[currentIndex].name}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                  <h4 className="font-serif font-bold text-slate-800 mt-4 text-lg">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-slate-500 text-sm">
                    {testimonials[currentIndex].location}
                  </p>
                  {/* Rating */}
                  <div className="flex justify-center md:justify-start gap-1 mt-2">
                    {[...Array(testimonials[currentIndex].rating)].map(
                      (_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-amber-400 fill-amber-400"
                        />
                      )
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <p className="text-slate-600 text-lg leading-relaxed italic mb-6">
                    &quot;{testimonials[currentIndex].text}&quot;
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-400">Tour:</span>
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full font-medium">
                      {testimonials[currentIndex].tour}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-600 hover:text-amber-600 hover:shadow-xl transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-amber-500 w-8"
                      : "bg-slate-300 hover:bg-slate-400"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center text-slate-600 hover:text-amber-600 hover:shadow-xl transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center items-center gap-8 mt-16 pt-16 border-t border-slate-200"
        >
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-slate-800">
              4.9/5
            </div>
            <div className="text-slate-500 text-sm">Average Rating</div>
          </div>
          <div className="w-px h-12 bg-slate-200 hidden md:block" />
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-slate-800">
              2,500+
            </div>
            <div className="text-slate-500 text-sm">Happy Travelers</div>
          </div>
          <div className="w-px h-12 bg-slate-200 hidden md:block" />
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-slate-800">
              98%
            </div>
            <div className="text-slate-500 text-sm">Satisfaction Rate</div>
          </div>
          <div className="w-px h-12 bg-slate-200 hidden md:block" />
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-slate-800">
              50+
            </div>
            <div className="text-slate-500 text-sm">Destinations</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
