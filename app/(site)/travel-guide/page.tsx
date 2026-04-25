import Image from "next/image";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { heroImages, SIZES } from "@/lib/images";
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
  Globe2,
  CheckCircle2,
  AlertCircle,
  Mail,
  BadgeCheck,
  Clock,
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
    (p) => p.parentSlug === "before" || !p.parentSlug,
  );
  const duringTravel = pages.filter((p) => p.parentSlug === "during");
  const activities = pages.filter((p) => p.parentSlug === "activities");

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center">
          <Image
            src={heroImages.travelGuide.src}
            alt={heroImages.travelGuide.alt}
            fill
            sizes={SIZES.hero}
            className="object-cover"
            priority
          />
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
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { label: "Visa Info", href: "#visa-info", icon: FileText },
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
          <div className="max-w-7xl mx-auto px-6">
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
          <div className="max-w-7xl mx-auto px-6">
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
          <div className="max-w-7xl mx-auto px-6">
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

        {/* Visa Information */}
        <section id="visa-info" className="py-16 bg-ivory">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <div className="w-14 h-14 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-forest-700" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-forest-900">
                Mongolia Visa Information for Travelers
              </h2>
              <p className="text-lg text-charcoal max-w-3xl mx-auto">
                Good news — most nationalities can visit Mongolia visa-free or
                with a simple e-visa.
              </p>
            </div>

            {/* Category badges */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              <div className="bg-sand rounded-xl p-5 border border-sand flex items-start gap-3">
                <Clock className="w-6 h-6 text-gold-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-forest-900">
                    Temporary Visa-Free
                  </div>
                  <div className="text-sm text-charcoal">
                    34 countries, valid until Jan 1, 2027
                  </div>
                </div>
              </div>
              <div className="bg-sand rounded-xl p-5 border border-sand flex items-start gap-3">
                <BadgeCheck className="w-6 h-6 text-forest-700 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-forest-900">
                    Permanent Agreements
                  </div>
                  <div className="text-sm text-charcoal">
                    20 countries, no expiry
                  </div>
                </div>
              </div>
              <div className="bg-sand rounded-xl p-5 border border-sand flex items-start gap-3">
                <Globe2 className="w-6 h-6 text-gold-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="font-semibold text-forest-900">E-Visa</div>
                  <div className="text-sm text-charcoal">
                    98 countries via evisa.mn
                  </div>
                </div>
              </div>
            </div>

            {/* 1. Temporary Visa-Free */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-sand mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 bg-gold-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </span>
                <h3 className="text-2xl font-bold text-forest-900">
                  Visa-Free Countries (Temporary)
                </h3>
              </div>
              <p className="text-charcoal mb-2">
                Valid until <strong>January 1, 2027</strong> — 34 countries
                exempt from visa for tourism stays up to <strong>30 days</strong>.
              </p>

              <h4 className="text-lg font-semibold text-forest-700 mt-6 mb-3">
                Europe (32)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {[
                  "Austria", "Belgium", "Bulgaria", "Croatia",
                  "Cyprus", "Czech Republic", "Denmark", "Estonia",
                  "Finland", "France", "Greece", "Hungary",
                  "Iceland", "Ireland", "Italy", "Latvia",
                  "Liechtenstein", "Lithuania", "Luxembourg", "Malta",
                  "Monaco", "Netherlands", "Norway", "Poland",
                  "Portugal", "Romania", "Slovakia", "Slovenia",
                  "Spain", "Sweden", "Switzerland", "United Kingdom",
                ].map((c) => (
                  <div
                    key={c}
                    className="bg-sand rounded-lg px-3 py-2 text-sm text-charcoal flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0" />
                    {c}
                  </div>
                ))}
              </div>

              <h4 className="text-lg font-semibold text-forest-700 mb-3">
                Asia-Pacific (2)
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                {["Australia", "New Zealand"].map((c) => (
                  <div
                    key={c}
                    className="bg-sand rounded-lg px-3 py-2 text-sm text-charcoal flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-forest-700 flex-shrink-0" />
                    {c}
                  </div>
                ))}
              </div>

              <p className="text-sm text-stone italic">
                Note: This is a temporary exemption under Mongolia&apos;s
                tourism promotion program. It has been renewed annually since
                2023 and is currently confirmed through January 1, 2027.
              </p>
            </div>

            {/* 2. Permanent Visa-Free */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-sand mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 bg-forest-700 text-white rounded-full flex items-center justify-center font-bold">
                  2
                </span>
                <h3 className="text-2xl font-bold text-forest-900">
                  Permanent Visa-Free Agreements
                </h3>
              </div>
              <p className="text-charcoal mb-6">
                These countries have <strong>permanent bilateral agreements</strong>{" "}
                — no expiry date.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full border border-sand rounded-lg overflow-hidden text-sm">
                  <thead className="bg-sand">
                    <tr>
                      <th className="text-left px-4 py-3 text-forest-900">
                        Country
                      </th>
                      <th className="text-left px-4 py-3 text-forest-900">
                        Max Stay
                      </th>
                      <th className="text-left px-4 py-3 text-forest-900">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { country: "United States", stay: "90 days", notes: "Permanent agreement" },
                      { country: "Canada", stay: "90 days", notes: "Permanent agreement" },
                      { country: "Germany", stay: "30 days", notes: "Permanent (not part of the temporary 34-country list)" },
                      { country: "Turkey", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Russia", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Belarus", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Japan", stay: "30 days", notes: "Permanent agreement" },
                      { country: "South Korea", stay: "90 days", notes: 'Extended under "Visit Mongolia Year" until Dec 31, 2026' },
                      { country: "Kazakhstan", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Kyrgyzstan", stay: "30 days", notes: "Permanent agreement" },
                      { country: "China", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Israel", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Brazil", stay: "90 days", notes: "Permanent agreement" },
                      { country: "Chile", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Philippines", stay: "21 days", notes: "Permanent agreement" },
                      { country: "Singapore", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Malaysia", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Thailand", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Indonesia", stay: "30 days", notes: "Permanent agreement" },
                      { country: "Hong Kong", stay: "14 days", notes: "Permanent agreement" },
                    ].map((r) => (
                      <tr key={r.country} className="border-t border-sand">
                        <td className="px-4 py-2 font-medium text-charcoal">
                          {r.country}
                        </td>
                        <td className="px-4 py-2 text-forest-700 font-semibold">
                          {r.stay}
                        </td>
                        <td className="px-4 py-2 text-charcoal">{r.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 3. E-Visa */}
            <div className="bg-forest-900 text-white rounded-xl p-6 md:p-8 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-10 h-10 bg-gold-500 text-forest-900 rounded-full flex items-center justify-center font-bold">
                  3
                </span>
                <h3 className="text-2xl font-bold">
                  E-Visa (for countries not listed above)
                </h3>
              </div>
              <ul className="space-y-2 text-gold-100 mb-6">
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <span>Available for citizens of <strong className="text-white">98 countries</strong></span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <span>Apply online at <strong className="text-white">evisa.mn</strong></span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <span>Processing time: <strong className="text-white">within 72 hours</strong></span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <span>No need to submit passport in person</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle2 className="w-5 h-5 text-gold-300 flex-shrink-0 mt-0.5" />
                  <span>Digital or printed e-visa must be presented at border</span>
                </li>
              </ul>

              <h4 className="text-lg font-bold mb-3">Visa Types Available</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="text-gold-300 font-bold text-lg mb-1">K1</div>
                  <div className="text-sm">Tourist visa</div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="text-gold-300 font-bold text-lg mb-1">K4</div>
                  <div className="text-sm">
                    Sports, cultural events, film and content creation
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <div className="text-gold-300 font-bold text-lg mb-1">K6</div>
                  <div className="text-sm">Transit visa (up to 10 days)</div>
                </div>
              </div>
            </div>

            {/* 4. Important Entry Rules */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </span>
                <h3 className="text-2xl font-bold text-forest-900">
                  Important Entry Rules
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-6 border-l-4 border-forest-700 shadow-sm">
                  <h4 className="font-bold text-forest-900 mb-2">
                    Passport Validity
                  </h4>
                  <p className="text-sm text-charcoal">
                    Must be valid for at least <strong>6 months</strong> from
                    date of entry.
                  </p>
                </div>

                <div className="bg-white rounded-xl p-6 border-l-4 border-forest-700 shadow-sm">
                  <h4 className="font-bold text-forest-900 mb-2">
                    30-Day Registration Rule
                  </h4>
                  <p className="text-sm text-charcoal">
                    Stays over 30 days require registration with the Mongolia
                    Immigration Agency in Ulaanbaatar within the first{" "}
                    <strong>7 days of arrival</strong>.
                  </p>
                </div>

                <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500 shadow-sm">
                  <h4 className="font-bold text-forest-900 mb-2">
                    Penalty for Non-Registration
                  </h4>
                  <p className="text-sm text-charcoal">
                    Travelers who fail to register and stay over 30 days will be
                    stopped at departure, temporarily denied exit, and fined.
                  </p>
                </div>

                <div className="bg-gold-50 rounded-xl p-6 border-l-4 border-gold-500 shadow-sm">
                  <h4 className="font-bold text-forest-900 mb-2">
                    Always Verify
                  </h4>
                  <p className="text-sm text-charcoal">
                    Visa policies can change. Check with your nearest Mongolian
                    embassy or visit <strong>consul.mn</strong> before traveling.
                  </p>
                </div>
              </div>
            </div>

            {/* Small CTA */}
            <div className="bg-gradient-to-br from-forest-700 to-forest-900 rounded-xl p-6 md:p-8 text-white text-center">
              <h3 className="text-xl md:text-2xl font-bold mb-3">
                Not sure about your visa status?
              </h3>
              <p className="text-gold-200 mb-6">
                Contact us and we&apos;ll help you figure it out.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <a
                  href="mailto:info@maralgoodreamland.com"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-forest-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  info@maralgoodreamland.com
                </a>
                <Link
                  href="/visa"
                  className="inline-flex items-center gap-2 text-white hover:text-gold-300 transition-colors font-medium"
                >
                  Read our complete visa guide →
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-forest-900">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
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
