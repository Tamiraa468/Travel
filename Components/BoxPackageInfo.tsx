/**
 * BoxPackageInfo Component
 *
 * Tour detail card with prominent pricing and request info button.
 *
 * Features:
 * - Large, bold price display
 * - Single "Request Info" button
 * - Clean, minimal card design
 * - Tailwind CSS styling
 */

"use client";

interface BoxPackageInfoProps {
  price: number;
  onRequestInfo: () => void;
}

export default function BoxPackageInfo({
  price,
  onRequestInfo,
}: BoxPackageInfoProps) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 p-8">
      {/* Price Section */}
      <div className="mb-8 text-center">
        <p className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
          Starting From
        </p>
        <p className="text-6xl font-bold text-blue-600">${price.toFixed(0)}</p>
        <p className="text-gray-600 mt-2">per person</p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mb-8" />

      {/* Request Info Button */}
      <button
        onClick={onRequestInfo}
        className="w-full bg-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-all duration-200 transform hover:scale-105 active:scale-95 text-lg"
        type="button"
        aria-label="Request information about this tour"
      >
        Request Info
      </button>
    </div>
  );
}
