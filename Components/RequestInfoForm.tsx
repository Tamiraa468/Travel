/**
 * RequestInfoForm Component
 *
 * A controlled form component for capturing tour information requests
 * Features:
 * - Client-side validation
 * - Honeypot field to reject bots
 * - Loading, success, and error states
 * - Responsive TailwindCSS styling
 * - Auto-reset on successful submission
 */

"use client";

import { useState, FormEvent } from "react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  preferredStartDate: string;
  adults: number;
  children: number;
  message: string;
  tourName?: string;
  tourId?: string;
  marketingConsent: boolean;
  hp: string; // Honeypot field
}

interface RequestInfoFormProps {
  tourId?: string;
  tourName?: string;
  className?: string;
  onClose?: () => void;
}

export default function RequestInfoForm({
  tourId,
  tourName,
  className = "",
  onClose,
}: RequestInfoFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    preferredStartDate: "",
    adults: 1,
    children: 0,
    message: "",
    tourName: tourName || "",
    tourId: tourId || "",
    marketingConsent: false,
    hp: "", // Hidden honeypot field
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handle form input changes
   */
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as any;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      const numValue = value === "" ? 0 : parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  /**
   * Client-side validation
   */
  const validateForm = (): boolean => {
    // Check required fields
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email address");
      return false;
    }

    if (formData.adults < 1) {
      setError("Must have at least 1 adult");
      return false;
    }

    if (formData.children < 0) {
      setError("Children count cannot be negative");
      return false;
    }

    if (formData.message.length > 1000) {
      setError("Message must be 1000 characters or less");
      return false;
    }

    return true;
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare request data
      const requestData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim() || undefined,
        preferredStartDate: formData.preferredStartDate || undefined,
        adults: formData.adults,
        children: formData.children,
        message: formData.message.trim() || undefined,
        tourName: formData.tourName || undefined,
        tourId: formData.tourId || undefined,
        marketingConsent: formData.marketingConsent,
        hp: formData.hp, // Include honeypot field
      };

      // Send POST request
      const response = await fetch("/api/request-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request");
      }

      // Success
      setSuccess(true);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        preferredStartDate: "",
        adults: 1,
        children: 0,
        message: "",
        tourName: tourName || "",
        tourId: tourId || "",
        marketingConsent: false,
        hp: "",
      });

      // Auto-hide success message after 3 seconds, then close modal
      setTimeout(() => {
        setSuccess(false);
        if (onClose) {
          onClose();
        }
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="text-green-800 font-semibold mb-1 text-sm">
              ✓ Request Submitted Successfully
            </h3>
            <p className="text-green-700 text-xs">
              We will contact you within 24 hours.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium text-sm">{error}</p>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-xs font-semibold text-gray-700 mb-1"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-gray-700 mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            required
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="block text-xs font-semibold text-gray-700 mb-1"
          >
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Travelers Section - Compact */}
        <div className="grid grid-cols-2 gap-2">
          {/* Adults */}
          <div>
            <label
              htmlFor="adults"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Adults *
            </label>
            <input
              type="number"
              id="adults"
              name="adults"
              min="1"
              value={formData.adults.toString()}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Children */}
          <div>
            <label
              htmlFor="children"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Children
            </label>
            <input
              type="number"
              id="children"
              name="children"
              min="0"
              value={formData.children.toString()}
              onChange={handleInputChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Preferred Start Date */}
        <div>
          <label
            htmlFor="preferredStartDate"
            className="block text-xs font-semibold text-gray-700 mb-1"
          >
            Preferred Date
          </label>
          <input
            type="date"
            id="preferredStartDate"
            name="preferredStartDate"
            value={formData.preferredStartDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Message - Smaller */}
        <div>
          <label
            htmlFor="message"
            className="block text-xs font-semibold text-gray-700 mb-1"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Special requests..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
          <p className="text-xs text-gray-500 mt-0.5">
            {formData.message.length}/1000
          </p>
        </div>

        {/* Marketing Consent */}
        <div className="flex items-start">
          <input
            type="checkbox"
            id="marketingConsent"
            name="marketingConsent"
            checked={formData.marketingConsent}
            onChange={handleInputChange}
            className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 border-gray-300 cursor-pointer"
          />
          <label
            htmlFor="marketingConsent"
            className="ml-2 text-xs text-gray-700 cursor-pointer"
          >
            Receive updates about special offers
          </label>
        </div>

        {/* Honeypot Field (hidden from users) */}
        <input
          type="text"
          name="hp"
          value={formData.hp}
          onChange={handleInputChange}
          style={{ display: "none" }}
          tabIndex={-1}
          autoComplete="off"
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg font-semibold text-white text-sm transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
          }`}
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>
    </div>
  );
}
