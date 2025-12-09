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
            className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm"
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
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                      <Calculator className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-bold text-white">
                        Calculate Price
                      </h2>
                      <p className="text-slate-400 text-sm">
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
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-50 to-slate-50 rounded-xl border border-amber-100">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="text-sm text-slate-600">Selected Tour</p>
                    <p className="font-semibold text-slate-800">{tourName}</p>
                  </div>
                </div>

                {/* Adults Selector */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Users className="w-4 h-4 text-amber-500" />
                    Adults
                    <span className="text-slate-400 font-normal">
                      €{basePrice}/person
                    </span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-12 h-12 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-center text-slate-600 hover:text-amber-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-bold text-slate-800">
                        {adults}
                      </span>
                    </div>
                    <button
                      onClick={() => setAdults(adults + 1)}
                      className="w-12 h-12 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-center text-slate-600 hover:text-amber-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Children Selector */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Baby className="w-4 h-4 text-amber-500" />
                    Children
                    <span className="text-slate-400 font-normal">50% off</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-12 h-12 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-center text-slate-600 hover:text-amber-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <div className="flex-1 text-center">
                      <span className="text-2xl font-bold text-slate-800">
                        {children}
                      </span>
                    </div>
                    <button
                      onClick={() => setChildren(children + 1)}
                      className="w-12 h-12 rounded-xl border-2 border-slate-200 hover:border-amber-400 hover:bg-amber-50 transition-all flex items-center justify-center text-slate-600 hover:text-amber-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Date Selector */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    Preferred Date
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all text-slate-700"
                  />
                </div>

                {/* Price Display */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-400 text-sm">Travelers</span>
                    <span className="text-white font-medium">
                      {adults} adult{adults > 1 ? "s" : ""}, {children} child
                      {children !== 1 ? "ren" : ""}
                    </span>
                  </div>

                  <div className="h-px bg-slate-700 mb-4" />

                  {calculatedPrice !== null ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center"
                    >
                      <p className="text-slate-400 text-sm mb-1">
                        Estimated Total
                      </p>
                      <p className="text-4xl font-serif font-bold text-amber-400">
                        €{calculatedPrice.toLocaleString()}
                      </p>
                      <p className="text-slate-400 text-xs mt-2">
                        ~€
                        {Math.round(
                          calculatedPrice / (adults + children)
                        ).toLocaleString()}{" "}
                        per person
                      </p>
                    </motion.div>
                  ) : (
                    <div className="text-center py-3">
                      <p className="text-slate-400 text-sm">
                        Click calculate to see your quote
                      </p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
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
