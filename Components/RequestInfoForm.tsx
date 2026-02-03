"use client";

import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Send,
  Sparkles,
} from "lucide-react";
import { trackGoogleAdsConversion } from "@/lib/gtag";

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
  hp: string;
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
    hp: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;

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

  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError("Invalid email address");
      return false;
    }
    if (formData.adults < 1) {
      setError("Must have at least 1 adult");
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
        hp: formData.hp,
      };

      const response = await fetch("/api/request-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit request");
      }

      // Track Google Ads conversion on successful info request
      trackGoogleAdsConversion();

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

      setTimeout(() => {
        setSuccess(false);
        if (onClose) onClose();
      }, 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Success Message */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-emerald-800 font-semibold text-sm">
                  Request Submitted!
                </h3>
                <p className="text-emerald-700 text-xs mt-0.5">
                  We&apos;ll contact you within 24 hours.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-4 bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200 rounded-xl flex items-start gap-3"
            >
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-rose-700 font-medium text-sm">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tour Badge */}
        {tourName && (
          <div className="flex items-center gap-2 px-3 py-2 bg-gold-500/10 border border-gold-300 rounded-lg">
            <Sparkles className="w-4 h-4 text-gold-500" />
            <span className="text-sm text-gold-700 font-medium">
              {tourName}
            </span>
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-1.5">
          <label
            htmlFor="fullName"
            className="flex items-center gap-2 text-sm font-semibold text-forest-700"
          >
            <User className="w-4 h-4 text-gold-500" />
            Full Name
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all placeholder:text-stone"
          />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="flex items-center gap-2 text-sm font-semibold text-forest-700"
          >
            <Mail className="w-4 h-4 text-gold-500" />
            Email
            <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="john@example.com"
            required
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all placeholder:text-stone"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label
            htmlFor="phone"
            className="flex items-center gap-2 text-sm font-semibold text-forest-700"
          >
            <Phone className="w-4 h-4 text-gold-500" />
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+976 8947-5188"
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all placeholder:text-stone"
          />
        </div>

        {/* Travelers Section */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label
              htmlFor="adults"
              className="flex items-center gap-2 text-sm font-semibold text-forest-700"
            >
              <Users className="w-4 h-4 text-gold-500" />
              Adults
              <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              id="adults"
              name="adults"
              min="1"
              value={formData.adults.toString()}
              onChange={handleInputChange}
              className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all text-center font-semibold"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="children"
              className="flex items-center gap-2 text-sm font-semibold text-forest-700"
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
              className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all text-center font-semibold"
            />
          </div>
        </div>

        {/* Preferred Date */}
        <div className="space-y-1.5">
          <label
            htmlFor="preferredStartDate"
            className="flex items-center gap-2 text-sm font-semibold text-forest-700"
          >
            <Calendar className="w-4 h-4 text-gold-500" />
            Preferred Date
          </label>
          <input
            type="date"
            id="preferredStartDate"
            name="preferredStartDate"
            value={formData.preferredStartDate}
            onChange={handleInputChange}
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all"
          />
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label
            htmlFor="message"
            className="flex items-center gap-2 text-sm font-semibold text-forest-700"
          >
            <MessageSquare className="w-4 h-4 text-gold-500" />
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Any special requests or questions..."
            rows={3}
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all placeholder:text-stone resize-none"
          />
          <p className="text-xs text-stone text-right">
            {formData.message.length}/1000
          </p>
        </div>

        {/* Marketing Consent */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5">
            <input
              type="checkbox"
              name="marketingConsent"
              checked={formData.marketingConsent}
              onChange={handleInputChange}
              className="sr-only peer"
            />
            <div className="w-5 h-5 border-2 border-sand rounded-md peer-checked:bg-gold-500 peer-checked:border-gold-500 transition-all flex items-center justify-center">
              {formData.marketingConsent && (
                <motion.svg
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-3 h-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </motion.svg>
              )}
            </div>
          </div>
          <span className="text-sm text-stone group-hover:text-charcoal transition-colors">
            I&apos;d like to receive exclusive offers and travel inspiration
          </span>
        </label>

        {/* Honeypot */}
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
          className="w-full py-3.5 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
              />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Submit Request
            </>
          )}
        </button>

        <p className="text-center text-xs text-stone">
          We respect your privacy. Your information is secure.
        </p>
      </form>
    </div>
  );
}
