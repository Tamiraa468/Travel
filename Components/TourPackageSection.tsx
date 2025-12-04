/**
 * TourPackageSection Component
 *
 * Client-side wrapper for BoxPackageInfo card.
 * Handles interactivity and state management.
 */

"use client";

import { useState } from "react";
import BoxPackageInfo from "./BoxPackageInfo";
import RequestInfoForm from "./RequestInfoForm";

interface TourPackageSectionProps {
  price: number;
  tourId: string;
  tourName?: string;
}

export default function TourPackageSection({
  price,
  tourId,
  tourName = "Tour",
}: TourPackageSectionProps) {
  const [showForm, setShowForm] = useState(false);

  const handleRequestInfo = () => {
    setShowForm(true);
  };

  return (
    <>
      {/* Price Card */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BoxPackageInfo price={price} onRequestInfo={handleRequestInfo} />
      </div>

      {/* Modal Backdrop */}
      {showForm && (
        <div
          className="fixed inset-0 z-40 bg-opacity-50 transition-opacity duration-300"
          onClick={() => setShowForm(false)}
          aria-hidden="true"
        />
      )}

      {/* Modal Dialog */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6">
          <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-blue-50">
              <h2 className="text-2xl font-bold text-gray-900">
                Request Information
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close modal"
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

            {/* Modal Body */}
            <div className="p-6">
              <RequestInfoForm
                tourId={tourId}
                tourName={tourName}
                onClose={() => setShowForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
