/**
 * ==========================================
 * PAYMENT REQUEST PAGE
 * ==========================================
 *
 * This page allows customers to request a payment link.
 * They fill in their details and receive a Stripe checkout link via email.
 *
 * URL: /payment/request
 */

import PaymentRequestForm from "@/Components/PaymentRequestForm";
import Link from "next/link";

export default function PaymentRequestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-purple-700">
            🏔️ UTravel Mongolia
          </Link>
          <Link
            href="/tours"
            className="text-gray-600 hover:text-purple-700 transition"
          >
            View Tours →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left Side - Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Secure Your Mongolia Adventure 🇲🇳
              </h1>
              <p className="text-xl text-gray-600">
                Complete your booking with our secure payment system. We'll send
                you a payment link via email.
              </p>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h2 className="text-xl font-semibold mb-4">How It Works</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <div className="font-medium">Fill in your details</div>
                    <div className="text-gray-500 text-sm">
                      Enter your name, email, and tour information
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <div className="font-medium">Receive payment link</div>
                    <div className="text-gray-500 text-sm">
                      We'll email you a secure Stripe checkout link
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <div className="font-medium">Pay securely</div>
                    <div className="text-gray-500 text-sm">
                      Use Visa, Mastercard, Apple Pay, or Google Pay
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <div className="font-medium">Booking confirmed!</div>
                    <div className="text-gray-500 text-sm">
                      Receive instant confirmation email
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-green-600">🔒</span>
                <span className="text-sm font-medium">SSL Secured</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-blue-600">💳</span>
                <span className="text-sm font-medium">Powered by Stripe</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                <span className="text-purple-600">✅</span>
                <span className="text-sm font-medium">
                  Instant Confirmation
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold mb-3">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Contact us if you have any questions about your booking.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span>📧</span>
                  <a
                    href="mailto:udelgombotamira@gmail.com"
                    className="text-purple-600 hover:underline"
                  >
                    udelgombotamira@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span>💬</span>
                  <span className="text-gray-600">
                    WhatsApp: +976 XXXX XXXX
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div>
            <PaymentRequestForm />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 UTravel Mongolia. Secure payments powered by Stripe.
          </p>
        </div>
      </footer>
    </div>
  );
}
