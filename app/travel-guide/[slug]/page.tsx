import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: { slug: string };
};

export default async function TravelGuideSubPage({ params }: Props) {
  const page = await prisma.contentPage.findFirst({
    where: {
      slug: params.slug,
      section: "TRAVEL_GUIDE",
      isPublished: true,
    },
  });

  if (!page) {
    notFound();
  }

  // Get other pages in this section for sidebar
  const relatedPages = await prisma.contentPage.findMany({
    where: {
      section: "TRAVEL_GUIDE",
      isPublished: true,
      id: { not: page.id },
    },
    orderBy: { order: "asc" },
    take: 8,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow bg-sand">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-ivory rounded-xl shadow-sm p-8">
                {/* Back Link */}
                <Link
                  href="/travel-guide"
                  className="inline-flex items-center gap-2 text-forest-700 hover:text-gold-700 mb-6"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Travel Guide
                </Link>

                {page.coverImage && (
                  <img
                    src={page.coverImage}
                    alt={page.title}
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}

                <h1 className="text-3xl font-bold text-forest-900 mb-6">
                  {page.title}
                </h1>

                <div className="prose prose-lg max-w-none">
                  <div
                    dangerouslySetInnerHTML={{ __html: page.content }}
                    className="text-charcoal leading-relaxed whitespace-pre-wrap"
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Related Pages */}
                {relatedPages.length > 0 && (
                  <div className="bg-ivory rounded-xl shadow-sm p-6">
                    <h3 className="font-semibold mb-4 text-forest-900">
                      More Travel Info
                    </h3>
                    <ul className="space-y-3">
                      {relatedPages.map((relatedPage) => (
                        <li key={relatedPage.id}>
                          <Link
                            href={`/travel-guide/${relatedPage.slug}`}
                            className="text-charcoal hover:text-forest-700 transition-colors block py-1"
                          >
                            {relatedPage.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Need Help CTA */}
                <div className="bg-gold-500/10 rounded-xl p-6">
                  <h3 className="font-semibold mb-2 text-forest-900">
                    Need More Information?
                  </h3>
                  <p className="text-sm text-charcoal mb-4">
                    Our team is here to answer all your questions about
                    traveling to Mongolia.
                  </p>
                  <Link
                    href="/contact"
                    className="block text-center px-4 py-2 bg-forest-900 text-white rounded-lg hover:bg-forest-700 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>

                {/* Browse Tours */}
                <div className="bg-gradient-to-br from-forest-500/10 to-gold-500/10 rounded-xl p-6">
                  <h3 className="font-semibold mb-2 text-forest-900">
                    Ready to Explore?
                  </h3>
                  <p className="text-sm text-charcoal mb-4">
                    Browse our carefully crafted tours to experience Mongolia.
                  </p>
                  <Link
                    href="/tours"
                    className="block text-center px-4 py-2 bg-forest-700 text-white rounded-lg hover:bg-forest-900 transition-colors"
                  >
                    Browse Tours
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
