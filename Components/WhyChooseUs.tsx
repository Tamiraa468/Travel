"use client";
import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  CheckCircle,
  Globe2,
  Users,
  Headphones,
  ShieldCheck,
  Award,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Globe2 className="h-8 w-8" />,
    title: "Authentic Experiences",
    description:
      "Explore Mongolia with local guides and immerse yourself in genuine nomadic culture.",
    gradient: "from-blue-500 to-cyan-400",
  },
  {
    id: 2,
    icon: <Users className="h-8 w-8" />,
    title: "Small Group Tours",
    description:
      "Enjoy intimate group sizes for a more personal and comfortable travel experience.",
    gradient: "from-purple-500 to-pink-400",
  },
  {
    id: 3,
    icon: <ShieldCheck className="h-8 w-8" />,
    title: "Safe & Reliable",
    description:
      "Your safety is our top priority — from transport to accommodation.",
    gradient: "from-green-500 to-emerald-400",
  },
  {
    id: 4,
    icon: <Headphones className="h-8 w-8" />,
    title: "24/7 Support",
    description:
      "We're always here to assist you before, during, and after your trip.",
    gradient: "from-orange-500 to-amber-400",
  },
  {
    id: 5,
    icon: <CheckCircle className="h-8 w-8" />,
    title: "Tailor-Made Packages",
    description:
      "Customize your tour itinerary to fit your style, time, and budget.",
    gradient: "from-rose-500 to-red-400",
  },
  {
    id: 6,
    icon: <Award className="h-8 w-8" />,
    title: "Award Winning",
    description:
      "Recognized for excellence in tourism with multiple industry awards.",
    gradient: "from-indigo-500 to-violet-400",
  },
];

const WhyChooseUs = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -100px 0px",
  });

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-white overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-amber-50 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-slate-100 rounded-full blur-3xl opacity-60" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-full mb-6 tracking-wide uppercase">
            Our Promise
          </span>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-800 mb-6">
            Why Choose{" "}
            <span className="relative">
              <span className="text-amber-600">Us</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 100 15"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 10 Q50 0 100 10"
                  stroke="#f59e0b"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            We go beyond ordinary tours — offering authentic, safe, and
            unforgettable experiences across the breathtaking landscapes of
            Mongolia.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map(({ id, icon, title, description, gradient }, index) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-slate-800 mb-3 group-hover:text-amber-600 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-slate-600 leading-relaxed">{description}</p>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-amber-200 transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "15+", label: "Years Experience" },
            { number: "5000+", label: "Happy Travelers" },
            { number: "50+", label: "Tour Packages" },
            { number: "98%", label: "Satisfaction Rate" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
