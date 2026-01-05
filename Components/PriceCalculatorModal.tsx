"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Baby,
  Calendar,
  Calculator,
  Sparkles,
  Minus,
  Plus,
  CheckCircle,
} from "lucide-react";

export interface PriceCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  basePrice: number;
  tourName?: string;
}

export default function PriceCalculatorModal({
  isOpen,
  onClose,
  basePrice,
  tourName = "Tour",
}: PriceCalculatorModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePrice = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const adultCost = basePrice * adults;
      const childrenCost = basePrice * 0.5 * children;
      const total = adultCost + childrenCost;
      setCalculatedPrice(total);
      setIsCalculating(false);
    }, 500);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-forest-900/60 backdrop-blur-sm"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
            onClick={handleBackdropClick}
          >
            <div
              ref={modalRef}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-gold-300" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-white">
                        Calculate Price
                      </h2>
                      <p className="text-stone text-sm">
                        Get your custom quote
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Tour Info */}
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-slate-50 rounded-xl border border-gold-300">
                  <Sparkles className="w-5 h-5 text-gold-500" />
                  <div>
                    <p className="text-sm text-stone">Selected Tour</p>
                    <p className="font-semibold text-forest-900">{tourName}</p>
                  </div>
                </div>

                {/* Adults Selector */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
                    <Users className="w-4 h-4 text-gold-500" />
                    Adults
                    <span className="text-stone font-normal">
                      €{basePrice}/person
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-12 h-12 rounded-xl border-2 border-sand hover:border-gold-500 hover:bg-gold-500/10 transition-all flex items-center justify-center text-stone hover:text-gold-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-bold text-forest-900">
                        {adults}
                      </span>
                    </div>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="w-12 h-12 rounded-xl border-2 border-sand hover:border-gold-500 hover:bg-gold-500/10 transition-all flex items-center justify-center text-stone hover:text-gold-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Children Selector */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
                    <Baby className="w-4 h-4 text-gold-500" />
                    Children
                    <span className="text-stone font-normal">50% off</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-12 h-12 rounded-xl border-2 border-sand hover:border-gold-500 hover:bg-gold-500/10 transition-all flex items-center justify-center text-stone hover:text-gold-500"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-bold text-forest-900">
                        {children}
                      </span>
                    </div>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="w-12 h-12 rounded-xl border-2 border-sand hover:border-gold-500 hover:bg-gold-500/10 transition-all flex items-center justify-center text-stone hover:text-gold-500"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Date Selector */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
                    <Calendar className="w-4 h-4 text-gold-500" />
                    Preferred Date
                    <span className="text-stone font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all text-forest-700"
                  />
                </div>

                {/* Price Display */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-stone text-sm">Travelers</span>
                    <span className="text-white font-medium">
                      {adults} adult{adults > 1 ? "s" : ""}, {children} child
                      {children !== 1 ? "ren" : ""}
                    </span>
                  </div>

                  <div className="h-px bg-forest-700 mb-4" />

                  {calculatedPrice !== null ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <p className="text-stone text-sm mb-1">
                        Estimated Total
                      </p>
                      <p className="text-4xl font-serif font-bold text-gold-300">
                        €{calculatedPrice.toLocaleString()}
                      </p>
                      <p className="text-stone text-xs mt-2">
                        ~€
                        {Math.round(
                          calculatedPrice / (adults + children)
                        ).toLocaleString()}{" "}
                        per person
                      </p>
                    </motion.div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-stone text-sm">
                        Click calculate to see your quote
                      </p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-forest-700 bg-sand hover:bg-sand transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={calculatePrice}
                    disabled={isCalculating}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCalculating ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Calculating...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Calculate
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
