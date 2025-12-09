import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: { slug: string };
};

export default async function WhyMongoliaSubPage({ params }: Props) {
  const page = await prisma.contentPage.findFirst({
    where: {
      slug: params.slug,
      section: "WHY_MONGOLIA",
      isPublished: true,
    },
  });

  if (!page) {
    notFound();
  }

  // Get other pages in this section for sidebar
  const relatedPages = await prisma.contentPage.findMany({
    where: {
      section: "WHY_MONGOLIA",
      isPublished: true,
      id: { not: page.id },
    },
    orderBy: { order: "asc" },
    take: 5,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Cover Image */}
        {page.coverImage && (
          <div className="relative h-[40vh] bg-gray-900">
            <img
              src={page.coverImage}
              alt={page.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  {page.title}
                </h1>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Back Link */}
              <Link
                href="/why-mongolia"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Why Mongolia
              </Link>

              {!page.coverImage && (
                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                  {page.title}
                </h1>
              )}

              <div className="prose prose-lg max-w-none">
                <div
                  dangerouslySetInnerHTML={{ __html: page.content }}
                  className="text-gray-700 leading-relaxed whitespace-pre-wrap"
                />
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Related Pages */}
                {relatedPages.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="font-semibold mb-4">Explore More</h3>
                    <ul className="space-y-3">
                      {relatedPages.map((relatedPage) => (
                        <li key={relatedPage.id}>
                          <Link
                            href={`/why-mongolia/${relatedPage.slug}`}
                            className="text-gray-600 hover:text-blue-600 transition-colors"
                          >
                            {relatedPage.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h3 className="font-semibold mb-2">Ready to Visit?</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Explore our carefully crafted tours to experience Mongolia.
                  </p>
                  <Link
                    href="/tours"
                    className="block text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
