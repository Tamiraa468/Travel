"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

function ThankYouContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const source = searchParams.get("source");
    if (source !== "site") {
      router.replace("/");
    } else {
      setIsValid(true);
    }
  }, [searchParams, router]);

  // While checking validity or redirecting
  if (isValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-sand">
        <p className="text-charcoal">Redirecting...</p>
      </div>
    );
  }

  // Valid access - show thank you content
  return (
    <div className="min-h-screen bg-linear-to-br from-sand to-ivory flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-linear-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-emerald-500/30">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>

        {/* Thank You Message */}
        <h1 className="text-3xl sm:text-4xl font-bold text-forest-900 mb-4">
          Thank You!
        </h1>
        <p className="text-lg text-charcoal mb-6">
          Your inquiry has been received successfully.
        </p>

        {/* What happens next */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-sand mb-8 text-left">
          <h2 className="font-semibold text-forest-800 mb-4">
            What happens next?
          </h2>
          <ul className="space-y-3 text-charcoal text-sm">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                A local Mongolian travel expert will personally review your
                request
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                You&apos;ll receive a customized itinerary within 24 hours
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                We&apos;ll answer all your questions and tailor everything to
                your preferences
              </span>
            </li>
          </ul>
        </div>

        {/* Contact Options */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/97689475188"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-full transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Chat on WhatsApp
          </a>
          <Link
            href="/tours"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-forest-700 hover:bg-forest-800 text-white font-semibold rounded-full transition-colors"
          >
            Explore More Tours
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Home link */}
        <p className="mt-8 text-stone text-sm">
          <Link href="/" className="hover:text-forest-700 underline">
            Return to Homepage
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-sand">
          <p className="text-charcoal">Loading...</p>
        </div>
      }
    >
      <ThankYouContent />
    </Suspense>
  );
}
