"use client";

import { motion } from "framer-motion";
import {
  Star,
  Clock,
  Users,
  MapPin,
  Calendar,
  ArrowRight,
  Share2,
  Heart,
} from "lucide-react";
import { useState } from "react";

interface TourHeroSectionProps {
  title: string;
  rating: number;
  reviewCount: number;
  duration: number;
  nights: number;
  price: number;
  imageUrl?: string;
  location?: string;
  onFindPrice: () => void;
  onRequestInfo: () => void;
}

export default function TourHeroSection({
  title,
  rating,
  reviewCount,
  duration,
  nights,
  price,
  imageUrl,
  location = "Multiple Destinations",
  onFindPrice,
  onRequestInfo,
}: TourHeroSectionProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div className="relative w-full min-h-[70vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: imageUrl
            ? `url(${imageUrl})`
            : "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80')",
        }}
      />

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/30" />

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-transparent" />

      {/* Content */}
      <div className="relative h-full min-h-[70vh] flex flex-col justify-end pb-24 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        {/* Top Actions */}
        <div className="absolute top-8 right-8 flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-3 rounded-full backdrop-blur-md transition-all ${
              isWishlisted
                ? "bg-rose-500 text-white"
                : "bg-white/20 text-white hover:bg-white/30"
            }`}
          >
            <Heart className={`w-5 h-5 ${isWishlisted ? "fill-white" : ""}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 transition-all"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-white/70 text-sm mb-4 flex items-center gap-2"
        >
          <span className="hover:text-amber-400 cursor-pointer transition-colors">
            Home
          </span>
          <span>/</span>
          <span className="hover:text-amber-400 cursor-pointer transition-colors">
            Tours
          </span>
          <span>/</span>
          <span className="text-amber-400">{title}</span>
        </motion.div>

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm rounded-full text-amber-300 text-sm font-medium mb-4 w-fit"
        >
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          Premium Experience
        </motion.div>

        {/* Tour Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 max-w-3xl leading-tight"
        >
          {title}
        </motion.h1>

        {/* Rating + Location */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-6 mb-8 flex-wrap"
        >
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(rating)
                      ? "text-amber-400 fill-amber-400"
                      : "text-white/30"
                  }`}
                />
              ))}
            </div>
            <span className="text-white font-medium">{rating.toFixed(1)}</span>
            <span className="text-white/60">({reviewCount} reviews)</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>{location}</span>
          </div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 mb-8"
        >
          {/* Duration Card */}
          <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide">
                Duration
              </p>
              <p className="text-white font-semibold">
                {duration} Days / {nights} Nights
              </p>
            </div>
          </div>

          {/* Group Size Card */}
          <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide">
                Group Size
              </p>
              <p className="text-white font-semibold">Max 12 People</p>
            </div>
          </div>

          {/* Next Departure */}
          <div className="flex items-center gap-3 px-5 py-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-wide">
                Next Departure
              </p>
              <p className="text-white font-semibold">Available Now</p>
            </div>
          </div>
        </motion.div>

        {/* Price + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          {/* Price */}
          <div>
            <p className="text-white/60 text-sm">Starting from</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-serif font-bold text-white">
                €{price.toLocaleString()}
              </span>
              <span className="text-white/60">/ person</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onFindPrice}
              className="group px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-full shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all flex items-center gap-2"
            >
              Find Your Price
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRequestInfo}
              className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full hover:bg-white/20 transition-all"
            >
              Request Info
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
