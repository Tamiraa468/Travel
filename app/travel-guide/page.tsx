import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  FileText,
  Cloud,
  Plane,
  Shield,
  Car,
  Home,
  Utensils,
  Camera,
  Mountain,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Travel Guide",
  description:
    "Essential Mongolia travel guide: visa requirements, weather, transportation, accommodation, and tips for your perfect trip.",
  alternates: {
    canonical: "/travel-guide",
  },
  openGraph: {
    title: "Travel Guide - Maralgoo Dreamland",
    description: "Everything you need to know for your Mongolia trip.",
    url: "/travel-guide",
  },
};

const guideIcons: Record<string, any> = {
  visa: FileText,
  weather: Cloud,
  accessibility: Plane,
  vaccination: Shield,
  transportation: Car,
  accommodation: Home,
  food: Utensils,
  activities: Mountain,
  photography: Camera,
};

export default async function TravelGuidePage() {
  const pages = await prisma.contentPage.findMany({
    where: {
      section: "TRAVEL_GUIDE",
      isPublished: true,
    },
    orderBy: { order: "asc" },
  });

  // Group by category (using parentSlug)
  const beforeTravel = pages.filter(
    (p) => p.parentSlug === "before" || !p.parentSlug
  );
  const duringTravel = pages.filter((p) => p.parentSlug === "during");
  const activities = pages.filter((p) => p.parentSlug === "activities");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('/images/travel-guide-hero.jpg')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-900/80 to-forest-700/60" />
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Travel Guide
            </h1>
            <p className="text-xl md:text-2xl text-gold-300">
              Everything you need to know before and during your Mongolia trip
            </p>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-8 bg-ivory border-b border-sand">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "Visa Info", href: "#before", icon: FileText },
                { label: "Best Time", href: "#weather", icon: Cloud },
                { label: "Getting There", href: "#before", icon: Plane },
                { label: "Things to Do", href: "#activities", icon: Mountain },
              ].map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="flex items-center gap-2 px-4 py-2 bg-sand rounded-full hover:bg-gold-500/10 hover:text-gold-700 transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Before You Visit */}
        <section id="before" className="py-16 bg-sand">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-forest-900">
              <span className="w-10 h-10 bg-forest-900 text-white rounded-full flex items-center justify-center text-lg">
                1
              </span>
              Before You Visit Mongolia
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pages.length > 0 ? (
                pages.slice(0, 6).map((page) => {
                  const IconComponent = guideIcons[page.slug] || FileText;
                  return (
                    <Link
                      key={page.id}
                      href={`/travel-guide/${page.slug}`}
                      className="group bg-ivory p-6 rounded-xl border border-sand hover:border-gold-300 hover:shadow-md transition-all"
                    >
                      <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold-500/10 transition-colors">
                        <IconComponent className="w-6 h-6 text-forest-700" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-forest-700 transition-colors">
                        {page.title}
                      </h3>
                      {page.excerpt && (
                        <p className="text-charcoal text-sm line-clamp-2">
                          {page.excerpt}
                        </p>
                      )}
                    </Link>
                  );
                })
              ) : (
                <>
                  {[
                    {
                      title: "Visa Information",
                      description:
                        "Requirements and application process for Mongolia visa",
                      icon: FileText,
                    },
                    {
                      title: "Best Time to Travel",
                      description: "Weather patterns and seasonal highlights",
                      icon: Cloud,
                    },
                    {
                      title: "Getting There",
                      description:
                        "Flights, border crossings, and transportation options",
                      icon: Plane,
                    },
                    {
                      title: "Health & Safety",
                      description: "Vaccinations, insurance, and safety tips",
                      icon: Shield,
                    },
                    {
                      title: "What to Pack",
                      description:
                        "Essential items for your Mongolia adventure",
                      icon: Home,
                    },
                    {
                      title: "Currency & Money",
                      description:
                        "Mongolian Tugrik, ATMs, and payment methods",
                      icon: FileText,
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-ivory p-6 rounded-xl border border-sand"
                    >
                      <div className="w-12 h-12 bg-gold-500/10 rounded-xl flex items-center justify-center mb-4">
                        <item.icon className="w-6 h-6 text-forest-700" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">
                        {item.title}
                      </h3>
                      <p className="text-charcoal text-sm">
                        {item.description}
                      </p>
                      <span className="text-xs text-stone mt-2 block">
                        Content coming soon
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* While in Mongolia */}
        <section id="during" className="py-16 bg-ivory">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-forest-900">
              <span className="w-10 h-10 bg-forest-700 text-white rounded-full flex items-center justify-center text-lg">
                2
              </span>
              While You're in Mongolia
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Transportation",
                  description:
                    "Getting around: domestic flights, trains, cars, and horses",
                  icon: Car,
                },
                {
                  title: "Accommodation",
                  description: "Hotels, ger camps, and nomadic homestays",
                  icon: Home,
                },
                {
                  title: "Food & Drink",
                  description: "Traditional cuisine and dining experiences",
                  icon: Utensils,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-sand"
                >
                  <div className="w-12 h-12 bg-forest-500/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-forest-700" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-forest-900">
                    {item.title}
                  </h3>
                  <p className="text-charcoal text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Things to Do */}
        <section id="activities" className="py-16 bg-sand">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-forest-900">
              <span className="w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center text-lg">
                3
              </span>
              Things to Do in Mongolia
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                "Horseback Riding",
                "Camel Riding",
                "Hiking & Trekking",
                "Bird Watching",
                "Star Gazing",
                "Photography",
                "Festival Attending",
                "Visiting Nomads",
              ].map((activity, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gold-500/5 to-forest-500/5 p-4 rounded-xl text-center hover:shadow-md transition-shadow border border-sand"
                >
                  <span className="text-lg font-medium text-forest-900">
                    {activity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-forest-900">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Need Help Planning?</h2>
            <p className="text-xl text-gold-300 mb-8">
              Our travel experts are ready to help you plan your perfect
              Mongolia adventure
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="px-8 py-3 bg-white text-forest-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/tours"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Browse Tours
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
