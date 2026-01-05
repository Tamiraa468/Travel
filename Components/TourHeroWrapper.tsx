"use client";

/**
 * TourHeroWrapper Component
 *
 * ============================================
 * INQUIRY-FIRST SALES MODEL
 * ============================================
 *
 * Updated to use InquiryForm instead of RequestInfoForm.
 * Modal titles and messaging reflect inquiry-first philosophy.
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import TourHeroSection from "./TourHeroSection";
import PriceCalculatorModal from "./PriceCalculatorModal";
import InquiryForm from "./InquiryForm";

interface TourHeroWrapperProps {
  title: string;
  rating: number;
  reviewCount: number;
  duration: number;
  nights: number;
  price: number;
  imageUrl?: string;
  tourId: string;
  tourName: string;
}

export default function TourHeroWrapper({
  title,
  rating,
  reviewCount,
  duration,
  nights,
  price,
  imageUrl,
  tourId,
  tourName,
}: TourHeroWrapperProps) {
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  return (
    <>
      <TourHeroSection
        title={title}
        rating={rating}
        reviewCount={reviewCount}
        duration={duration}
        nights={nights}
        price={price}
        imageUrl={imageUrl}
        onFindPrice={() => setShowPriceModal(true)}
        onRequestInfo={() => setShowInquiryModal(true)}
      />

      {/* Price Calculator Modal */}
      <PriceCalculatorModal
        isOpen={showPriceModal}
        basePrice={price}
        tourName={tourName}
        onClose={() => setShowPriceModal(false)}
      />

      {/* Inquiry Modal - Updated for inquiry-first model */}
      <AnimatePresence>
        {showInquiryModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-forest-900/60 backdrop-blur-sm z-40"
              onClick={() => setShowInquiryModal(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6"
              onClick={() => setShowInquiryModal(false)}
            >
              <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header - Updated messaging */}
                <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-5">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gold-500/20 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-gold-300" />
                      </div>
                      <div>
                        <h2 className="text-xl font-serif font-bold text-white">
                          Customize Your Trip
                        </h2>
                        <p className="text-stone text-sm">
                          Get a free personalized itinerary
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowInquiryModal(false)}
                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
                  <InquiryForm
                    tourId={tourId}
                    tourName={tourName}
                    onClose={() => setShowInquiryModal(false)}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
