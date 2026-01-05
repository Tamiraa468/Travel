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
import { useLanguage } from "@/context/LanguageContext";

const WhyChooseUs = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, {
    once: true,
    margin: "0px 0px -100px 0px",
  });

  const features = [
    {
      id: 1,
      icon: <Globe2 className="h-8 w-8" />,
      title: t.whyChooseUs.authenticExperiences,
      description: t.whyChooseUs.authenticDesc,
      gradient: "from-forest-500 to-forest-700",
    },
    {
      id: 2,
      icon: <Users className="h-8 w-8" />,
      title: t.whyChooseUs.smallGroups,
      description: t.whyChooseUs.smallGroupsDesc,
      gradient: "from-forest-700 to-forest-900",
    },
    {
      id: 3,
      icon: <ShieldCheck className="h-8 w-8" />,
      title: t.whyChooseUs.safeReliable,
      description: t.whyChooseUs.safeReliableDesc,
      gradient: "from-forest-500 to-forest-700",
    },
    {
      id: 4,
      icon: <Headphones className="h-8 w-8" />,
      title: t.whyChooseUs.support247,
      description: t.whyChooseUs.support247Desc,
      gradient: "from-gold-500 to-gold-700",
    },
    {
      id: 5,
      icon: <CheckCircle className="h-8 w-8" />,
      title: t.whyChooseUs.tailorMade,
      description: t.whyChooseUs.tailorMadeDesc,
      gradient: "from-forest-700 to-forest-900",
    },
    {
      id: 6,
      icon: <Award className="h-8 w-8" />,
      title: t.whyChooseUs.awardWinning,
      description: t.whyChooseUs.awardWinningDesc,
      gradient: "from-gold-700 to-gold-500",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 bg-ivory overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-20 left-0 w-72 h-72 bg-gold-300/20 rounded-full blur-3xl opacity-60" />
      <div className="absolute bottom-20 right-0 w-96 h-96 bg-forest-500/10 rounded-full blur-3xl opacity-60" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-forest-500/10 text-forest-700 text-sm font-medium rounded-full mb-6 tracking-wide uppercase">
            {t.tours.ourPromise}
          </span>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-forest-900 mb-6">
            {t.whyChooseUs.title.split(" ").slice(0, -1).join(" ")}{" "}
            <span className="relative">
              <span className="text-gold-500">
                {t.whyChooseUs.title.split(" ").slice(-1)}
              </span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 100 15"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 10 Q50 0 100 10"
                  stroke="#C9A962"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-stone max-w-2xl mx-auto leading-relaxed">
            {t.whyChooseUs.subtitle}
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
              className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 border border-sand"
            >
              {/* Icon */}
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                {icon}
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-forest-900 mb-3 group-hover:text-gold-500 transition-colors duration-300">
                {title}
              </h3>
              <p className="text-stone leading-relaxed">{description}</p>

              {/* Hover Border Effect */}
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-gold-300 transition-colors duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: "15+", label: t.whyChooseUs.yearsExperience },
            { number: "5000+", label: t.whyChooseUs.happyTravelers },
            { number: "50+", label: t.whyChooseUs.tourPackages },
            { number: "98%", label: t.whyChooseUs.satisfactionRate },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-600 mb-2">
                {stat.number}
              </div>
              <div className="text-slate-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div> */}
      </div>
    </section>
  );
};

export default WhyChooseUs;
