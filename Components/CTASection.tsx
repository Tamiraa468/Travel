"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MapPin, Calendar, Phone } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// Pre-generate particle positions to avoid hydration mismatch
const generateParticles = () => {
  return Array.from({ length: 20 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    duration: 3 + Math.random() * 2,
    delay: Math.random() * 2,
  }));
};

const CTASection = () => {
  const { t } = useLanguage();
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: number;
      top: number;
      duration: number;
      delay: number;
    }>
  >([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setParticles(generateParticles());
    setMounted(true);
  }, []);

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-forest-900/95 via-forest-900/85 to-forest-900/95" />

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold-500 to-transparent" />

      {/* Floating Particles - Only render after mount to avoid hydration mismatch */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute w-1 h-1 bg-gold-500/30 rounded-full"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
              }}
            />
          ))}
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500/20 border border-gold-500/30 rounded-full text-gold-300 text-sm font-medium mb-8"
          >
            <Sparkles className="w-4 h-4" />
            {t.cta.title.includes("Ready")
              ? "Start Your Journey Today"
              : "Starten Sie Ihre Reise noch heute"}
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight !text-white"
          >
            {t.cta.title}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-ivory/80 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            {t.cta.subtitle}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link
              href="/tours"
              className="group px-8 py-4 bg-gold-500 text-forest-900 rounded-full font-semibold text-lg shadow-lg shadow-gold-500/30 hover:bg-gold-300 hover:shadow-xl hover:shadow-gold-500/40 transition-all flex items-center gap-2"
            >
              {t.cta.exploreTours}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 bg-transparent backdrop-blur-sm border-2 border-forest-500 text-ivory rounded-full font-semibold text-lg hover:bg-forest-700 hover:border-forest-700 transition-all"
            >
              {t.cta.contactUs}
            </Link>
          </motion.div>

          {/* Quick Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8 text-ivory/80"
          >
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-forest-700/50 rounded-full flex items-center justify-center">
                <Phone className="w-4 h-4 text-gold-500" />
              </div>
              <div className="text-left">
                <div className="text-xs text-ivory/60">{t.common.callUs}</div>
                <div className="font-medium">+976 8947-5188</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-forest-700/50 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-gold-500" />
              </div>
              <div className="text-left">
                <div className="text-xs text-ivory/60">
                  {t.cta.destinationsWorldwide}
                </div>
                <div className="font-medium">50+</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-forest-700/50 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-gold-500" />
              </div>
              <div className="text-left">
                <div className="text-xs text-ivory/60">
                  {t.cta.available247}
                </div>
                <div className="font-medium">24/7</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
