"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Users,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

type Props = { tourId: string; tourDateId: string; price: number };

export default function BookingForm({ tourId, tourDateId, price }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId,
          tourDateId,
          quantity,
          customer: { firstName, lastName, email },
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setMessage("Booking created — proceed to payment.");
        setIsSuccess(true);
      } else {
        setMessage("Failed to create booking");
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error creating booking");
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Name Fields */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
            <User className="w-4 h-4 text-gold-500" />
            First Name
          </label>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all placeholder:text-stone"
          />
        </div>
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
            Last Name
          </label>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all placeholder:text-stone"
          />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
          <Mail className="w-4 h-4 text-gold-500" />
          Email Address
        </label>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john@example.com"
          className="w-full px-4 py-3 text-sm border-2 border-sand rounded-xl focus:ring-2 focus:ring-gold-500 focus:border-gold-500 transition-all placeholder:text-stone"
        />
      </div>

      {/* Quantity */}
      <div className="space-y-1.5">
        <label className="flex items-center gap-2 text-sm font-semibold text-forest-700">
          <Users className="w-4 h-4 text-gold-500" />
          Number of Travelers
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-12 h-12 rounded-xl border-2 border-sand hover:border-gold-500 hover:bg-gold-500/10 transition-all flex items-center justify-center text-stone hover:text-gold-500 font-bold text-lg"
          >
            −
          </button>
          <div className="flex-1 text-center">
            <span className="text-2xl font-bold text-forest-900">
              {quantity}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="w-12 h-12 rounded-xl border-2 border-sand hover:border-gold-500 hover:bg-gold-500/10 transition-all flex items-center justify-center text-stone hover:text-gold-500 font-bold text-lg"
          >
            +
          </button>
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-2">
          <span className="text-stone text-sm">Price per person</span>
          <span className="text-white">${price.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-stone text-sm">Travelers</span>
          <span className="text-white">{quantity}</span>
        </div>
        <div className="h-px bg-forest-700 my-3" />
        <div className="flex items-center justify-between">
          <span className="text-white font-semibold">Total</span>
          <span className="text-2xl font-serif font-bold text-gold-300">
            ${(price * quantity).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl flex items-start gap-3 ${
            isSuccess
              ? "bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200"
              : "bg-gradient-to-r from-rose-50 to-red-50 border border-rose-200"
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              isSuccess ? "bg-emerald-500" : "bg-rose-500"
            }`}
          >
            {isSuccess ? (
              <CheckCircle className="w-4 h-4 text-white" />
            ) : (
              <AlertCircle className="w-4 h-4 text-white" />
            )}
          </div>
          <p
            className={`text-sm font-medium ${
              isSuccess ? "text-emerald-700" : "text-rose-700"
            }`}
          >
            {message}
          </p>
        </motion.div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 shadow-lg shadow-amber-500/30 hover:shadow-xl hover:shadow-amber-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            Book Now
          </>
        )}
      </button>

      <p className="text-center text-xs text-stone">
        Secure payment • Instant confirmation
      </p>
    </form>
  );
}
