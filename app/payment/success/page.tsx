/**
 * Payment Success Page
 * Displayed after successful Stripe/PayPal payment
 */

"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface PaymentStatus {
  success: boolean;
  data?: {
    id: string;
    fullName: string;
    tourName: string;
    tourPrice: number;
    amountPaid: number;
    remainingAmount: number;
    paidPercentage: number;
    isConfirmed: boolean;
    bookingStatus: string;
  };
  error?: string;
}

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const requestId = searchParams.get("request_id");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    async function checkPaymentStatus() {
      if (!requestId && !sessionId) {
        setStatus({ success: false, error: "Missing payment reference" });
        setLoading(false);
        return;
      }

      try {
        const params = new URLSearchParams();
        if (requestId) params.set("requestId", requestId);
        if (sessionId) params.set("session_id", sessionId);

        const response = await fetch(`/api/payment-confirm?${params}`);
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        setStatus({ success: false, error: "Failed to check payment status" });
      } finally {
        setLoading(false);
      }
    }

    checkPaymentStatus();
  }, [requestId, sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!status?.success || !status?.data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">
            {status?.error ||
              "We couldn't verify your payment. Please contact support."}
          </p>
          <Link
            href="/"
            className="inline-block bg-forest-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-forest-700 transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const { data } = status;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-gray-600">
            Thank you for your payment, {data.fullName}
          </p>
        </div>

        {/* Booking Status */}
        <div
          className={`rounded-xl p-4 mb-6 text-center ${
            data.isConfirmed
              ? "bg-green-50 border-2 border-green-200"
              : "bg-yellow-50 border-2 border-yellow-200"
          }`}
        >
          <p
            className={`text-lg font-semibold ${
              data.isConfirmed ? "text-green-700" : "text-yellow-700"
            }`}
          >
            {data.isConfirmed
              ? "🎉 Your Booking is CONFIRMED!"
              : "⏳ Booking Pending - Additional Payment Required"}
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-gray-900 mb-3">Booking Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Reference:</span>
              <span className="font-mono font-semibold">{data.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tour:</span>
              <span className="font-semibold">{data.tourName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Price:</span>
              <span className="font-semibold">
                $
                {data.tourPrice?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-green-50 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-green-800 mb-3">Payment Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-green-700">Amount Paid:</span>
              <span className="font-bold text-green-800">
                $
                {data.amountPaid?.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}{" "}
                ({data.paidPercentage}%)
              </span>
            </div>
            {data.remainingAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-orange-600">Remaining Balance:</span>
                <span className="font-semibold text-orange-700">
                  $
                  {data.remainingAmount?.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gold-500/10 rounded-xl p-4 mb-6">
          <h2 className="font-semibold text-blue-800 mb-2">What's Next?</h2>
          <ul className="text-sm text-gold-700 space-y-1">
            <li>✓ Check your email for confirmation details</li>
            <li>✓ Our team will contact you within 24 hours</li>
            {data.remainingAmount > 0 && (
              <li>✓ Pay remaining balance 14 days before tour</li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 text-center bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition"
          >
            Return Home
          </Link>
          <Link
            href="/tours"
            className="flex-1 text-center bg-forest-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-forest-700 transition"
          >
            Browse Tours
          </Link>
        </div>
      </div>
    </div>
  );
}
