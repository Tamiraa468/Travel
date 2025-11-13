# Complete Working Animation Examples

This document shows the full, production-ready code for both components with scroll-triggered animations.

## RecommendedTours Component

### Full Code

```tsx
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
  const [isAnimating, setIsAnimating] = useState(false);
  const sectionRef = useRef(null);

  // Animation trigger: either scrolled into view OR content is visible
  const isInView = useInView(sectionRef, {
    once: false,
    margin: "0px 0px -100px 0px",
  });

  // Use tours from context if available, otherwise fallback to TOURS data
  const displayTours = tours && tours.length > 0 ? tours : TOURS;

  // Ensure tours are loaded in context on first mount
  useEffect(() => {
    if (!tours || tours.length === 0) {
      fetchTours().catch((err) => console.error("Failed to fetch tours:", err));
    }
    // Mark that initial render is ready (animations can play)
    setIsAnimating(true);
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
      animate={isInView || isAnimating ? "visible" : "hidden"}
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
```

### Key Features

✅ Renders immediately on first load  
✅ Auto-rotates carousel every 5 seconds  
✅ Staggered card animations (150ms between each)  
✅ Responsive (1-3 cards per slide)  
✅ Hover lift effect on cards  
✅ Slide indicators with spring animation

---

## WhyChooseUs Component

### Full Code

```tsx
"use client";
import React, { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle,
  Globe2,
  Users,
  Headphones,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Globe2 className="h-10 w-10 text-blue-800" />,
    title: "Authentic Experiences",
    description:
      "Explore Mongolia with local guides and immerse yourself in genuine nomadic culture.",
  },
  {
    id: 2,
    icon: <Users className="h-10 w-10 text-blue-800" />,
    title: "Small Group Tours",
    description:
      "Enjoy intimate group sizes for a more personal and comfortable travel experience.",
  },
  {
    id: 3,
    icon: <ShieldCheck className="h-10 w-10 text-blue-800" />,
    title: "Safe & Reliable",
    description:
      "Your safety is our top priority — from transport to accommodation.",
  },
  {
    id: 4,
    icon: <Headphones className="h-10 w-10 text-blue-800" />,
    title: "24/7 Support",
    description:
      "We're always here to assist you before, during, and after your trip.",
  },
  {
    id: 5,
    icon: <CheckCircle className="h-10 w-10 text-blue-800" />,
    title: "Tailor-Made Packages",
    description:
      "Customize your tour itinerary to fit your style, time, and budget.",
  },
];

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Always trigger animation on mount for guaranteed first-load visibility
  useEffect(() => {
    setIsAnimating(true);
  }, []);

  const isInView = useInView(sectionRef, {
    once: false,
    margin: "0px 0px -100px 0px",
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  const lineVariants = {
    hidden: { width: 0 },
    visible: {
      width: 96,
      transition: { duration: 0.6, delay: 0.3, ease: "easeOut" as any },
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
      className="py-20 bg-white"
      initial="hidden"
      animate={isInView || isAnimating ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Header */}
      <motion.div
        className="flex flex-col items-center text-center px-4"
        variants={containerVariants}
      >
        <motion.h2
          className="text-3xl md:text-4xl font-semibold text-gray-800"
          variants={headingVariants}
        >
          Why <span className="text-blue-800">Choose Us?</span>
        </motion.h2>
        <motion.div
          className="h-0.5 bg-blue-800 mt-3"
          variants={lineVariants}
        />
        <motion.p
          className="text-gray-600 max-w-xl mt-4"
          variants={textVariants}
        >
          We go beyond ordinary tours — offering authentic, safe, and
          unforgettable experiences across Mongolia.
        </motion.p>
      </motion.div>

      {/* Features grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 px-6 md:px-16 lg:px-32"
        variants={containerVariants}
      >
        {features.map(({ id, icon, title, description }) => (
          <motion.div
            key={id}
            className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center"
            variants={cardVariants}
            whileHover={{
              y: -8,
              boxShadow: "0 20px 40px rgba(0, 0, 0, 0.15)",
              transition: { duration: 0.3 },
            }}
          >
            <motion.div
              className="mb-4"
              whileHover={{
                scale: 1.1,
                rotate: 10,
                transition: { duration: 0.3 },
              }}
            >
              {icon}
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default WhyChooseUs;
```

### Key Features

✅ Renders immediately on first load  
✅ Animated header with line draw effect  
✅ Staggered feature card animations (100ms between each)  
✅ Icon hover with scale and rotate  
✅ Card hover with lift and shadow  
✅ Responsive 3-column grid (1-2 on mobile)  
✅ Smooth text and description animations

---

## Animation Breakdown

### RecommendedTours

```
Timeline:
0ms   → Heading starts fading in & sliding up (0-600ms)
100ms → Description starts (with 200ms delay = 300ms total)
100ms → First card starts appearing
250ms → Second card starts appearing
400ms → Third card starts appearing
500ms → Indicators fade in

Total Duration: ~1000ms (1 second) from start to full visibility
```

### WhyChooseUs

```
Timeline:
0ms   → Heading starts fading in & sliding up (0-600ms)
100ms → Line starts drawing (with 300ms delay = 400ms total)
100ms → Description starts (with 200ms delay = 300ms total)
100ms → First feature card starts appearing
200ms → Second feature card starts appearing
300ms → Third feature card starts appearing
400ms → Fourth feature card starts appearing
500ms → Fifth feature card starts appearing

Total Duration: ~1100ms from start to full visibility
```

---

## Customization Guide

### Adjust Animation Speed

To make animations **faster** (e.g., 400ms instead of 600ms):

```tsx
const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }, // Changed from 0.6
  },
};
```

### Adjust Stagger Delay

To increase spacing between card animations:

```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Changed from 0.15 (200ms instead of 150ms)
      delayChildren: 0.1,
    },
  },
};
```

### Change Hover Effect

To make cards lift more on hover:

```tsx
whileHover={{
  y: -12,  // Changed from -8 (12px lift instead of 8px)
  boxShadow: "0 30px 50px rgba(0, 0, 0, 0.2)",
  transition: { duration: 0.3 },
}}
```

### Disable Re-animation on Scroll

If you want animations to play only once:

```tsx
const isInView = useInView(sectionRef, {
  once: true, // Changed from false
  margin: "0px 0px -100px 0px",
});
```

---

## Testing & Deployment

### Local Testing

```bash
npm run dev
# Visit http://localhost:3000
# Verify animations play on first load
```

### Production Build

```bash
npm run build
# Should see "✓ Compiled successfully"
```

### Deploy to Vercel

```bash
git add .
git commit -m "feat(animations): add scroll-triggered animations to RecommendedTours and WhyChooseUs"
git push origin main
# Vercel auto-deploys and rebuilds
```

---

**Your animations are ready for production!** 🚀
