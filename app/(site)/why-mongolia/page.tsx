import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Globe2,
  MapPin,
  Users,
  Mountain,
  Landmark,
  Utensils,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Mongolia",
  description:
    "Discover why Mongolia is a must-visit destination. Learn about the land of nomads, rich history, stunning landscapes, and unique culture.",
  alternates: {
    canonical: "/why-mongolia",
  },
  openGraph: {
    title: "Why Mongolia - Maralgoo Dreamland",
    description: "Discover the land of nomads, adventure, and rich history.",
    url: "/why-mongolia",
  },
};

const sectionIcons: Record<string, any> = {
  geography: Globe2,
  climate: Mountain,
  history: Landmark,
  people: Users,
  culture: Users,
  food: Utensils,
};

export default async function WhyMongoliaPage() {
  const pages = await prisma.contentPage.findMany({
    where: {
      section: "WHY_MONGOLIA",
      isPublished: true,
    },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('/images/mongolia-hero.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/80 to-forest-700/50" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Why Mongolia?
            </h1>
            <p className="text-xl md:text-2xl text-gold-300">
              The land of nomads, adventure, and rich history offers
              unparalleled freedom and inspiration for every traveler
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 bg-ivory">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6 text-forest-900">
              Welcome to the Land of the Blue Sky
            </h2>
            <p className="text-lg text-charcoal leading-relaxed">
              Mongolia, with its majestic snow-capped mountains, pristine
              nature, and vibrant cultural heritage, offers authentic,
              life-changing experiences. Immerse yourself in colorful festivals,
              experience the traditional nomadic lifestyle, and gain a deeper
              understanding of this mystical culture. The warmth, hospitality,
              and kindness of the Mongolian people will ensure a vacation that's
              not only unique but truly unforgettable.
            </p>
          </div>
        </section>

        {/* Quick Facts */}
        <section className="py-12 bg-gold-500/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { label: "Population", value: "3.4 Million" },
                { label: "Area", value: "1.56M km²" },
                { label: "Capital", value: "Ulaanbaatar" },
                { label: "Languages", value: "Mongolian" },
              ].map((fact, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm text-center"
                >
                  <div className="text-2xl font-bold text-forest-700 mb-1">
                    {fact.value}
                  </div>
                  <div className="text-charcoal">{fact.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Pages Grid */}
        <section className="py-16 bg-sand">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-forest-900">
              Discover Mongolia
            </h2>

            {pages.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pages.map((page) => {
                  const IconComponent = sectionIcons[page.slug] || MapPin;
                  return (
                    <Link
                      key={page.id}
                      href={`/why-mongolia/${page.slug}`}
                      className="group bg-ivory rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-sand hover:border-gold-300"
                    >
                      {page.coverImage ? (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={page.coverImage}
                            alt={page.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
                          <IconComponent className="w-16 h-16 text-white/70" />
                        </div>
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2 group-hover:text-forest-700 transition-colors">
                          {page.title}
                        </h3>
                        {page.excerpt && (
                          <p className="text-charcoal line-clamp-2">
                            {page.excerpt}
                          </p>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-charcoal mb-4">Content coming soon!</p>
                <p className="text-stone">
                  We're working on bringing you detailed information about
                  Mongolia.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Highlights */}
        <section className="py-16 bg-ivory">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-forest-900">
              Experience Mongolia
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Nomadic Culture",
                  description:
                    "Live with nomadic families and experience their traditional lifestyle firsthand.",
                  icon: "🏕️",
                },
                {
                  title: "Vast Landscapes",
                  description:
                    "From the Gobi Desert to pristine lakes and snow-capped mountains.",
                  icon: "🏔️",
                },
                {
                  title: "Unique Wildlife",
                  description:
                    "Spot snow leopards, wild horses, and the rare Gobi bear.",
                  icon: "🐎",
                },
                {
                  title: "Rich History",
                  description:
                    "Walk in the footsteps of Chinggis Khan and discover ancient monasteries.",
                  icon: "🏛️",
                },
                {
                  title: "Traditional Festivals",
                  description:
                    "Experience Naadam, Eagle Festival, and Tsagaan Sar celebrations.",
                  icon: "🎪",
                },
                {
                  title: "Adventure Activities",
                  description:
                    "Horse trekking, camel riding, hiking, and off-road expeditions.",
                  icon: "🎯",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-sand"
                >
                  <span className="text-4xl mb-4 block">{item.icon}</span>
                  <h3 className="text-lg font-semibold mb-2 text-forest-900">
                    {item.title}
                  </h3>
                  <p className="text-charcoal text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-forest-900">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Experience Mongolia?
            </h2>
            <p className="text-xl text-gold-300 mb-8">
              Start planning your adventure today
            </p>
            <Link
              href="/tours"
              className="inline-block px-8 py-3 bg-white text-forest-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Browse Our Tours
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
