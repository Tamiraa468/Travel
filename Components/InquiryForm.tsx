"use client";

/**
 * InquiryForm Component
 *
 * ============================================
 * INQUIRY-FIRST SALES MODEL
 * ============================================
 *
 * This form collects high-quality leads, NOT bookings.
 * Philosophy: Human trust and customization are the core value.
 *
 * Key behaviors:
 * - Submits to /api/inquiry (NOT /api/request-info)
 * - NO payment calculation or display
 * - NO checkout redirect
 * - Shows success message encouraging conversation
 * - Emphasizes personalization and human contact
 */

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Globe,
  Calendar,
  Users,
  Wallet,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Sparkles,
  MessageCircle,
  Shield,
  Clock,
} from "lucide-react";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  travelMonth: string;
  groupSize: string;
  budgetRange: string;
  message: string;
  tourName?: string;
  tourId?: string;
  marketingConsent: boolean;
  hp: string; // Honeypot
}

interface InquiryFormProps {
  tourId?: string;
  tourName?: string;
  className?: string;
  onClose?: () => void;
  variant?: "default" | "compact" | "hero";
}

const TRAVEL_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
  "Flexible / Not sure yet",
];

const GROUP_SIZES = [
  "Solo traveler",
  "2 people",
  "3-4 people",
  "5-6 people",
  "7-10 people",
  "10+ people (group tour)",
];

const BUDGET_RANGES = [
  "Budget-friendly (< $2,000/person)",
  "Mid-range ($2,000 - $4,000/person)",
  "Premium ($4,000 - $6,000/person)",
  "Luxury ($6,000+/person)",
  "Not sure yet - help me decide",
];

export default function InquiryForm({
  tourId,
  tourName,
  className = "",
  onClose,
  variant = "default",
}: InquiryFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    travelMonth: "",
    groupSize: "",
    budgetRange: "",
    message: "",
    tourName: tourName || "",
    tourId: tourId || "",
    marketingConsent: false,
    hp: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError("Please enter your name");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim() || undefined,
          country: formData.country.trim() || undefined,
          travelMonth: formData.travelMonth || undefined,
          groupSize: formData.groupSize || undefined,
          budgetRange: formData.budgetRange || undefined,
          message: formData.message.trim() || undefined,
          tourName: formData.tourName || undefined,
          tourId: formData.tourId || undefined,
          marketingConsent: formData.marketingConsent,
          hp: formData.hp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Something went wrong");
      }

      setSuccess(true);

      // Reset form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        travelMonth: "",
        groupSize: "",
        budgetRange: "",
        message: "",
        tourName: tourName || "",
        tourId: tourId || "",
        marketingConsent: false,
        hp: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Success state - emphasize human contact
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`text-center py-8 px-6 ${className}`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.1 }}
          className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/30"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>

        <h3 className="text-2xl font-serif font-bold text-forest-900 mb-3">
          Request Received! 🎉
        </h3>

        <p className="text-stone mb-6">
          A local Mongolian travel expert will personally craft your itinerary
          and reach out within 24 hours.
        </p>

        <div className="bg-gold-500/10 border border-gold-300 rounded-xl p-4 mb-6">
          <p className="text-gold-700 text-sm flex items-center justify-center gap-2">
            <Shield className="w-4 h-4" />
            <span>
              <strong>No payment required</strong> until you&apos;re 100% happy
              with your trip plan
            </span>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="https://wa.me/97689475188"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            WhatsApp Us Now
          </a>

          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-3 bg-sand hover:bg-stone/20 text-forest-700 font-semibold rounded-full transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
              <p className="text-rose-700 text-sm">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tour Badge */}
        {tourName && (
          <div className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gold-500/10 to-gold-300/20 border border-gold-300 rounded-xl">
            <Sparkles className="w-5 h-5 text-gold-500" />
            <span className="text-sm text-gold-700 font-medium">
              {tourName}
            </span>
          </div>
        )}

        {/* Trust Indicators */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 bg-sand rounded-lg">
            <Shield className="w-4 h-4 text-green-500 mx-auto mb-1" />
            <span className="text-xs text-stone">No Payment</span>
          </div>
          <div className="p-2 bg-sand rounded-lg">
            <Sparkles className="w-4 h-4 text-gold-500 mx-auto mb-1" />
            <span className="text-xs text-stone">100% Custom</span>
          </div>
          <div className="p-2 bg-sand rounded-lg">
            <Clock className="w-4 h-4 text-forest-500 mx-auto mb-1" />
            <span className="text-xs text-stone">Reply in 24h</span>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
            <User className="w-4 h-4 text-gold-500" />
            Your Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="John Smith"
            required
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
            <Mail className="w-4 h-4 text-gold-500" />
            Email <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            required
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
          />
        </div>

        {/* Phone & Country Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
              <Phone className="w-4 h-4 text-gold-500" />
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 234 567 890"
              className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
              <Globe className="w-4 h-4 text-gold-500" />
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="USA"
              className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
            />
          </div>
        </div>

        {/* Travel Month */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
            <Calendar className="w-4 h-4 text-gold-500" />
            When do you want to travel?
          </label>
          <select
            name="travelMonth"
            value={formData.travelMonth}
            onChange={handleInputChange}
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all bg-white"
          >
            <option value="">Select a month...</option>
            {TRAVEL_MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Group Size & Budget Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
              <Users className="w-4 h-4 text-gold-500" />
              Group Size
            </label>
            <select
              name="groupSize"
              value={formData.groupSize}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all bg-white"
            >
              <option value="">Select...</option>
              {GROUP_SIZES.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
              <Wallet className="w-4 h-4 text-gold-500" />
              Budget
            </label>
            <select
              name="budgetRange"
              value={formData.budgetRange}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all bg-white"
            >
              <option value="">Select...</option>
              {BUDGET_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
            <MessageSquare className="w-4 h-4 text-gold-500" />
            Tell us about your dream trip
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="What are you most excited to see? Any special interests like photography, horseback riding, or nomadic culture? Any dietary requirements?"
            rows={4}
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all resize-none"
          />
        </div>

        {/* Marketing Consent */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="marketingConsent"
            checked={formData.marketingConsent}
            onChange={handleInputChange}
            className="mt-1 w-4 h-4 rounded border-sand text-gold-500 focus:ring-gold-500"
          />
          <span className="text-sm text-stone">
            Send me travel tips and exclusive offers (optional)
          </span>
        </label>

        {/* Honeypot - hidden from users */}
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
          className="w-full py-4 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Sending...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Get My Free Itinerary
            </>
          )}
        </button>

        {/* Trust Footer */}
        <p className="text-center text-xs text-stone">
          ✓ No payment required • ✓ 100% customizable • ✓ Reply within 24h
        </p>
      </form>
    </div>
  );
}
