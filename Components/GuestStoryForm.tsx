"use client";

import { useState } from "react";
import { Star, Send, CheckCircle } from "lucide-react";

export default function GuestStoryForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    country: "",
    title: "",
    content: "",
    rating: 5,
    tourName: "",
    travelDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.title.trim() || !form.content.trim()) {
      setError("Please fill in your name, title, and story.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/guest-stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Failed to submit. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-forest-50 border border-forest-200 rounded-2xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-forest-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-forest-900 mb-2">
          Thank you for sharing your story!
        </h3>
        <p className="text-stone">
          Your story has been submitted and will appear after review by our team.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-sand p-6 md:p-8">
      <h3 className="text-2xl font-bold text-forest-900 mb-2">
        Share Your Mongolia Story
      </h3>
      <p className="text-stone mb-6">
        Traveled to Mongolia? Share your experience and inspire other travelers!
      </p>

      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Smith"
            maxLength={100}
            className="w-full px-4 py-2.5 rounded-lg border border-sand focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none transition-colors"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Email <span className="text-stone text-xs">(optional, not displayed)</span>
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john@example.com"
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-lg border border-sand focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none transition-colors"
          />
        </div>

        {/* Country */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Country
          </label>
          <input
            type="text"
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
            placeholder="United States"
            maxLength={100}
            className="w-full px-4 py-2.5 rounded-lg border border-sand focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none transition-colors"
          />
        </div>

        {/* Tour Name */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Tour Name
          </label>
          <input
            type="text"
            value={form.tourName}
            onChange={(e) => setForm({ ...form, tourName: e.target.value })}
            placeholder="Gobi Desert Adventure"
            maxLength={200}
            className="w-full px-4 py-2.5 rounded-lg border border-sand focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none transition-colors"
          />
        </div>

        {/* Travel Date */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            When did you travel?
          </label>
          <input
            type="text"
            value={form.travelDate}
            onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
            placeholder="July 2025"
            maxLength={50}
            className="w-full px-4 py-2.5 rounded-lg border border-sand focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none transition-colors"
          />
        </div>

        {/* Rating */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Rating
          </label>
          <div className="flex items-center gap-1 pt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                className="focus:outline-none"
              >
                <Star
                  className={`w-7 h-7 transition-colors ${
                    star <= form.rating
                      ? "text-gold-500 fill-gold-500"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-charcoal mb-1">
          Story Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="My Unforgettable Journey Through the Gobi Desert"
          maxLength={200}
          className="w-full px-4 py-2.5 rounded-lg border border-sand focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none transition-colors"
        />
      </div>

      {/* Content */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-charcoal mb-1">
          Your Story <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          placeholder="Tell us about your experience in Mongolia — the places you visited, the people you met, and the moments that made your trip special..."
          maxLength={10000}
          rows={8}
          className="w-full px-4 py-2.5 rounded-lg border border-sand focus:border-forest-500 focus:ring-1 focus:ring-forest-500 outline-none transition-colors resize-y"
        />
        <p className="text-xs text-stone mt-1">{form.content.length}/10,000 characters</p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center gap-2 px-6 py-3 bg-forest-900 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Your Story
          </>
        )}
      </button>
    </form>
  );
}
