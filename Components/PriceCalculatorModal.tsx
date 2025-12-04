/**
 * PriceCalculatorModal Component
 *
 * A fully accessible modal for calculating custom tour prices based on:
 * - Number of adults and children
 * - Preferred travel date
 * - Base tour price from props
 *
 * Features:
 * - Keyboard accessible (ESC to close)
 * - Backdrop click to close
 * - Smooth animations (fade + slide)
 * - ARIA attributes for screen readers
 * - Prevents body scroll when open
 */

"use client";

import { useEffect, useRef, useState } from "react";

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

  /**
   * Calculate price based on travelers and base price
   * Simple formula: basePrice * adults + (basePrice * 0.5 * children)
   */
  const calculatePrice = () => {
    setIsCalculating(true);

    // Simulate API call or calculation
    setTimeout(() => {
      const adultCost = basePrice * adults;
      const childrenCost = basePrice * 0.5 * children;
      const total = adultCost + childrenCost;

      setCalculatedPrice(total);
      setIsCalculating(false);
    }, 500);
  };

  /**
   * Handle ESC key press to close modal
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  /**
   * Close modal when clicking outside (backdrop)
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        ref={modalRef}
        className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6 transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {/* Modal Content */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-linear-to-r from-blue-50 to-indigo-50">
            <h2 id="modal-title" className="text-2xl font-bold text-gray-900">
              Calculate Price
            </h2>
            {/* Close Button */}
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 -mr-2"
              aria-label="Close price calculator"
              type="button"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Tour Name */}
            <div id="modal-description" className="text-sm text-gray-600">
              <p>
                <strong>Tour:</strong> {tourName}
              </p>
              <p>
                <strong>Base Price:</strong> ${basePrice.toFixed(2)} per person
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Adults Selector */}
            <div className="space-y-2">
              <label
                htmlFor="adults"
                className="block text-sm font-semibold text-gray-700"
              >
                Number of Adults *
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-gray-700 flex items-center justify-center"
                  type="button"
                  aria-label="Decrease adults"
                >
                  −
                </button>

                <input
                  id="adults"
                  type="number"
                  min="1"
                  value={adults}
                  onChange={(e) =>
                    setAdults(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  onClick={() => setAdults(adults + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-gray-700 flex items-center justify-center"
                  type="button"
                  aria-label="Increase adults"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children Selector */}
            <div className="space-y-2">
              <label
                htmlFor="children"
                className="block text-sm font-semibold text-gray-700"
              >
                Number of Children
                <span className="text-xs text-gray-500 font-normal ml-2">
                  (50% of adult price)
                </span>
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-gray-700 flex items-center justify-center"
                  type="button"
                  aria-label="Decrease children"
                >
                  −
                </button>

                <input
                  id="children"
                  type="number"
                  min="0"
                  value={children}
                  onChange={(e) =>
                    setChildren(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg text-center font-semibold focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />

                <button
                  onClick={() => setChildren(children + 1)}
                  className="w-10 h-10 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-gray-700 flex items-center justify-center"
                  type="button"
                  aria-label="Increase children"
                >
                  +
                </button>
              </div>
            </div>

            {/* Date Selector */}
            <div className="space-y-2">
              <label
                htmlFor="date"
                className="block text-sm font-semibold text-gray-700"
              >
                Preferred Travel Date
                <span className="text-xs text-gray-500 font-normal ml-2">
                  (Optional)
                </span>
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Price Display */}
            <div className="bg-linear-to-br from-blue-50 to-indigo-50 p-4 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Travelers:</strong> {adults} adult(s), {children}{" "}
                child(ren)
              </p>

              {calculatedPrice !== null ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    Estimated Total Price:
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    ${calculatedPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    Per person: $
                    {(calculatedPrice / (adults + children)).toFixed(2)}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500">
                    Click "Calculate" to see the estimated price
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Calculate Button */}
            <button
              onClick={calculatePrice}
              disabled={isCalculating}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                isCalculating
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800"
              }`}
              type="button"
            >
              {isCalculating ? "Calculating..." : "Calculate Price"}
            </button>

            {/* Close Button (Alt) */}
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              type="button"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
