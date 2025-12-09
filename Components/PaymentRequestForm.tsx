/**
 * ==========================================
 * PAYMENT REQUEST FORM COMPONENT
 * ==========================================
 *
 * This component allows customers to:
 * 1. Fill in their details (name, email, tour info)
 * 2. Submit the form
 * 3. Receive a Stripe payment link via email
 *
 * Can be used on any page or as a modal.
 */

"use client";

import { useState } from "react";
import { Loader2, CheckCircle, Mail, CreditCard } from "lucide-react";

interface PaymentRequestFormProps {
  // Pre-fill tour information (optional)
  defaultTourName?: string;
  defaultTourId?: string;
  defaultPrice?: number;
  onSuccess?: (data: any) => void;
}

export default function PaymentRequestForm({
  defaultTourName = "",
  defaultTourId = "",
  defaultPrice = 0,
  onSuccess,
}: PaymentRequestFormProps) {
  // ==========================================
  // FORM STATE
  // ==========================================
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    tourName: defaultTourName,
    tourId: defaultTourId,
    totalPrice: defaultPrice,
    adults: 1,
    children: 0,
    preferredStartDate: "",
    message: "",
    payAdvanceOnly: true, // Default to 30% advance payment
    directPay: false, // If true, redirect to Stripe immediately
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  // ==========================================
  // CALCULATE AMOUNTS
  // ==========================================
  const advanceAmount = formData.totalPrice * 0.3; // 30%
  const amountToPay = formData.payAdvanceOnly
    ? advanceAmount
    : formData.totalPrice;

  // ==========================================
  // HANDLE INPUT CHANGES
  // ==========================================
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Call our API to create Stripe payment session
      const response = await fetch("/api/stripe/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      // If directPay is true, redirect to Stripe immediately
      if (formData.directPay && data.data?.paymentUrl) {
        window.location.href = data.data.paymentUrl;
        return;
      }

      // Otherwise, show success message (email sent)
      setSuccess(true);
      setPaymentData(data.data);

      if (onSuccess) {
        onSuccess(data.data);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUCCESS STATE
  // ==========================================
  if (success && paymentData) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md mx-auto text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Link Sent! 📧
        </h2>

        <p className="text-gray-600 mb-6">
          We've sent a secure payment link to <strong>{formData.email}</strong>
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount to Pay</span>
            <span className="font-bold text-green-600">
              ${paymentData.amountToPay.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Reference</span>
            <span className="font-mono text-gray-700">
              {paymentData.requestId.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {/* Option to pay directly */}
          <a
            href={paymentData.paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
          >
            <CreditCard className="inline-block w-5 h-5 mr-2" />
            Pay Now
          </a>

          {/* Check email reminder */}
          <div className="flex items-center justify-center text-gray-500 text-sm">
            <Mail className="w-4 h-4 mr-2" />
            Or check your email for the payment link
          </div>
        </div>

        <button
          onClick={() => {
            setSuccess(false);
            setPaymentData(null);
            setFormData({
              ...formData,
              fullName: "",
              email: "",
              phone: "",
              message: "",
              directPay: false,
            });
          }}
          className="mt-6 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Request another payment
        </button>
      </div>
    );
  }

  // ==========================================
  // FORM UI
  // ==========================================
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-lg mx-auto"
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Request Payment Link 💳
      </h2>
      <p className="text-gray-600 mb-6">
        Fill in your details and we'll send you a secure payment link via email.
      </p>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Customer Details */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-gray-800 border-b pb-2">
          👤 Your Details
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="john@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="+1 234 567 8900"
          />
        </div>
      </div>

      {/* Tour Details */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-gray-800 border-b pb-2">
          🏔️ Tour Details
        </h3>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tour Name *
          </label>
          <input
            type="text"
            name="tourName"
            value={formData.tourName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Gobi Desert Adventure"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Tour Price (USD) *
          </label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice || ""}
            onChange={handleChange}
            required
            min="1"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="2500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adults
            </label>
            <input
              type="number"
              name="adults"
              value={formData.adults}
              onChange={handleChange}
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Children
            </label>
            <input
              type="number"
              name="children"
              value={formData.children}
              onChange={handleChange}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Preferred Start Date
          </label>
          <input
            type="date"
            name="preferredStartDate"
            value={formData.preferredStartDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Any special requests or questions..."
          />
        </div>
      </div>

      {/* Payment Options */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-gray-800 border-b pb-2">
          💰 Payment Option
        </h3>

        <div className="space-y-3">
          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="payAdvanceOnly"
              checked={formData.payAdvanceOnly}
              onChange={() =>
                setFormData((prev) => ({ ...prev, payAdvanceOnly: true }))
              }
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">
                30% Advance Payment (Recommended)
              </div>
              <div className="text-sm text-gray-500">
                Pay ${advanceAmount.toFixed(2)} now to secure your booking
              </div>
            </div>
          </label>

          <label className="flex items-start p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition">
            <input
              type="radio"
              name="payAdvanceOnly"
              checked={!formData.payAdvanceOnly}
              onChange={() =>
                setFormData((prev) => ({ ...prev, payAdvanceOnly: false }))
              }
              className="mt-1 mr-3"
            />
            <div>
              <div className="font-medium text-gray-900">Full Payment</div>
              <div className="text-sm text-gray-500">
                Pay ${formData.totalPrice.toFixed(2)} in full
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Summary */}
      {formData.totalPrice > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600">Amount to Pay</div>
              <div className="text-2xl font-bold text-purple-700">
                ${amountToPay.toFixed(2)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Total Tour Price</div>
              <div className="text-lg text-gray-700">
                ${formData.totalPrice.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Buttons */}
      <div className="space-y-3">
        {/* Pay Now Button - Direct to Stripe */}
        <button
          type="submit"
          disabled={loading || !formData.totalPrice}
          onClick={() => setFormData((prev) => ({ ...prev, directPay: true }))}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              💳 Pay with Card - ${amountToPay.toFixed(2)}
            </>
          )}
        </button>

        <div className="text-center text-gray-400 text-sm">or</div>

        {/* Send Link to Email Button */}
        <button
          type="submit"
          disabled={loading || !formData.totalPrice}
          onClick={() => setFormData((prev) => ({ ...prev, directPay: false }))}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Creating Payment Link...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              Send Payment Link to Email
            </>
          )}
        </button>
      </div>

      {/* Payment Methods Info */}
      <div className="mt-4 text-center text-sm text-gray-500">
        <p>Secure payment via Stripe</p>
        <div className="mt-2 flex justify-center gap-2">
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">Visa</span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
            Mastercard
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
            Apple Pay
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded text-xs">
            Google Pay
          </span>
        </div>
      </div>
    </form>
  );
}
