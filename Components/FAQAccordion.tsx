"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

type Props = {
  faqs: FAQItem[];
  grouped?: Record<string, FAQItem[]>;
  showCategories?: boolean;
};

const categoryLabels: Record<string, string> = {
  GENERAL: "General Questions",
  BOOKING: "Booking & Reservations",
  PAYMENT: "Payment & Pricing",
  TRAVEL: "Travel Information",
  VISA: "Visa & Documentation",
  ACCOMMODATION: "Accommodation",
  TRANSPORTATION: "Transportation",
};

export default function FAQAccordion({
  faqs,
  grouped,
  showCategories = true,
}: Props) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  // Use grouped if provided, otherwise group by category
  const groupedFaqs =
    grouped ||
    faqs.reduce((acc, faq) => {
      if (!acc[faq.category]) acc[faq.category] = [];
      acc[faq.category].push(faq);
      return acc;
    }, {} as Record<string, FAQItem[]>);

  const categories = Object.keys(groupedFaqs);

  // Filter FAQs based on active category
  const displayFaqs = activeCategory ? groupedFaqs[activeCategory] || [] : faqs;

  return (
    <div>
      {/* Category Tabs */}
      {showCategories && categories.length > 1 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {categoryLabels[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {/* FAQ Items */}
      <div className="space-y-3">
        {displayFaqs.map((faq) => (
          <div
            key={faq.id}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white"
          >
            <button
              onClick={() => toggle(faq.id)}
              className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <span className="font-medium text-gray-900">
                  {faq.question}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                  openId === faq.id ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openId === faq.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4 pt-0">
                    <div className="pl-8 text-gray-600 whitespace-pre-line">
                      {faq.answer}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {displayFaqs.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No FAQs found in this category.
        </p>
      )}
    </div>
  );
}
