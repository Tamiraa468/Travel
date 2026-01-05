/**
 * Payment Cancel Page
 * Displayed when user cancels the Stripe/PayPal payment
 */

"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaymentCancelPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get("request_id");

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-orange-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. Don't worry - no charges were made to
          your account.
        </p>

        {requestId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              Your booking reference:{" "}
              <span className="font-mono font-semibold">{requestId}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              You can use this reference to complete your payment later
            </p>
          </div>
        )}

        <div className="bg-gold-500/10 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-800 mb-2">
            Want to complete your booking?
          </h3>
          <ul className="text-sm text-gold-700 space-y-1">
            <li>• Check your email for payment instructions</li>
            <li>• Use the payment link to try again</li>
            <li>• Contact us for bank transfer details</li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Return Home
          </Link>
          <Link
            href="/tours"
            className="flex-1 bg-forest-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-forest-700 transition"
          >
            Browse Tours
          </Link>
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Need help?{" "}
          <Link href="/contact" className="text-forest-700 hover:underline">
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
