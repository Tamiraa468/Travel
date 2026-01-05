"use client";

import { useState } from "react";
import {
  ChevronDown,
  MapPin,
  Utensils,
  Home,
  Star,
  Compass,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type ItineraryDay = {
  id: string;
  dayNumber: number;
  title: string;
  description: string;
  meals?: string | null;
  accommodation?: string | null;
  highlights?: string[];
};

type Props = {
  itinerary: ItineraryDay[];
};

export default function ItineraryAccordion({ itinerary }: Props) {
  const [openDay, setOpenDay] = useState<number | null>(1);

  if (!itinerary || itinerary.length === 0) {
    return null;
  }

  const sortedItinerary = [...itinerary].sort(
    (a, b) => a.dayNumber - b.dayNumber
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
          <Compass className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-forest-900">
          Day-by-Day Itinerary
        </h2>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 via-amber-300 to-slate-200 hidden md:block" />

        <div className="space-y-4">
          {sortedItinerary.map((day, index) => (
            <motion.div
              key={day.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="relative"
            >
              {/* Day Circle - Desktop */}
              <div className="absolute left-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold flex items-center justify-center text-sm shadow-lg shadow-amber-500/30 z-10 hidden md:flex">
                {day.dayNumber}
              </div>

              {/* Card */}
              <div className="md:ml-16 bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                {/* Accordion Header */}
                <button
                  onClick={() =>
                    setOpenDay(openDay === day.dayNumber ? null : day.dayNumber)
                  }
                  className={`w-full px-6 py-5 flex items-center justify-between text-left transition-all ${
                    openDay === day.dayNumber
                      ? "bg-gradient-to-r from-amber-50 to-slate-50 border-b border-slate-100"
                      : "bg-white hover:bg-sand"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Day Number - Mobile */}
                    <span className="flex md:hidden items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-white font-bold text-sm shadow-md">
                      {day.dayNumber}
                    </span>
                    <div>
                      <h3 className="font-serif font-semibold text-forest-900 text-lg">
                        Day {day.dayNumber}: {day.title}
                      </h3>
                      {day.meals && (
                        <span className="text-xs text-stone flex items-center gap-1 mt-1">
                          <Utensils className="w-3 h-3" />
                          {day.meals}
                        </span>
                      )}
                    </div>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      openDay === day.dayNumber
                        ? "bg-gold-500/20"
                        : "bg-sand"
                    }`}
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openDay === day.dayNumber
                          ? "rotate-180 text-gold-500"
                          : "text-stone"
                      }`}
                    />
                  </div>
                </button>

                {/* Accordion Content */}
                <AnimatePresence>
                  {openDay === day.dayNumber && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 py-6 bg-white">
                        <p className="text-stone leading-relaxed whitespace-pre-line">
                          {day.description}
                        </p>

                        {/* Info Pills */}
                        <div className="flex flex-wrap gap-3 mt-6">
                          {day.meals && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium border border-green-100">
                              <Utensils className="w-4 h-4" />
                              <span>{day.meals}</span>
                            </div>
                          )}
                          {day.accommodation && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium border border-purple-100">
                              <Home className="w-4 h-4" />
                              <span>{day.accommodation}</span>
                            </div>
                          )}
                        </div>

                        {/* Day Highlights */}
                        {day.highlights && day.highlights.length > 0 && (
                          <div className="mt-6 p-4 bg-gold-500/10 rounded-xl border border-gold-300">
                            <h4 className="text-sm font-semibold text-forest-900 mb-3 flex items-center gap-2">
                              <Star className="w-4 h-4 text-gold-500" />
                              Day Highlights
                            </h4>
                            <ul className="space-y-2">
                              {day.highlights.map((highlight, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-2 text-sm text-stone"
                                >
                                  <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
                                  {highlight}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
