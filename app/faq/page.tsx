import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import FAQAccordion from "@/Components/FAQAccordion";
import prisma from "@/lib/prisma";
import { HelpCircle } from "lucide-react";

export default async function FAQPage() {
  const result = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });

  // Group by category
  const grouped = result.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, typeof result>);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-600 to-indigo-700 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-white">
            <HelpCircle className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Find answers to common questions about our tours, booking process,
              and traveling in Mongolia
            </p>
          </div>
        </section>

        {/* FAQ Content */}
        <section className="max-w-4xl mx-auto px-4 py-16">
          {result.length > 0 ? (
            <FAQAccordion
              faqs={result}
              grouped={grouped}
              showCategories={true}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-4">
                No FAQs available at the moment.
              </p>
              <p className="text-gray-400">
                Please contact us directly if you have any questions.
              </p>
            </div>
          )}
        </section>

        {/* Contact CTA */}
        <section className="bg-gray-50 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
            <p className="text-gray-600 mb-6">
              Our team is here to help you plan your perfect Mongolia adventure.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
