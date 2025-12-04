"use client";

import { useState } from "react";
import TourHeroSection from "./TourHeroSection";
import PriceCalculatorModal from "./PriceCalculatorModal";
import RequestInfoForm from "./RequestInfoForm";

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
  const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);

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
        onRequestInfo={() => setShowRequestInfoModal(true)}
      />

      {/* Price Calculator Modal */}
      <PriceCalculatorModal
        isOpen={showPriceModal}
        basePrice={price}
        tourName={tourName}
        onClose={() => setShowPriceModal(false)}
      />

      {/* Request Info Modal */}
      {showRequestInfoModal && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          onClick={() => setShowRequestInfoModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="font-semibold text-lg">Request Information</h2>
              <button
                onClick={() => setShowRequestInfoModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <RequestInfoForm
                tourId={tourId}
                tourName={tourName}
                onClose={() => setShowRequestInfoModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
