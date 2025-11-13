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
      "We’re always here to assist you before, during, and after your trip.",
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
  const [lastScrollY, setLastScrollY] = useState(0);

  // Track scroll direction
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation trigger: only when scrolled into view
  const isInView = useInView(sectionRef, {
    once: true, // Animation plays only once, when first entering viewport
    margin: "0px 0px -100px 0px", // Trigger 100px before entering viewport
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
      animate={isInView ? "visible" : "hidden"}
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
