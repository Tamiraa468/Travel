/**
 * Example page showing how to integrate RequestInfoForm component
 * This page demonstrates using the form in a real tour context
 */

import RequestInfoForm from "@/Components/RequestInfoForm";

export default function RequestInfoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Request Tour Information
          </h1>
          <p className="text-xl text-gray-700">
            Tell us about your dream tour and we'll send you personalized
            recommendations
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-xl p-8">
          <RequestInfoForm />
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r">
          <h3 className="font-semibold text-blue-900 mb-2">
            What happens next?
          </h3>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>✓ We'll send you a confirmation email within minutes</li>
            <li>
              ✓ Our team will review your preferences and create a custom
              itinerary
            </li>
            <li>
              ✓ You'll receive detailed pricing and options within 24 hours
            </li>
            <li>✓ We're here to answer any questions and help you book!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
