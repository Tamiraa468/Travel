import Image from "next/image";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { heroImages, normalizeImageUrl, SIZES } from "@/lib/images";
import {
  Globe2,
  MapPin,
  Users,
  Mountain,
  Landmark,
  Utensils,
  FileText,
  CheckCircle2,
  AlertCircle,
  Mail,
  Tent,
  PawPrint,
  PartyPopper,
  Compass,
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
          <Image
            src={heroImages.whyMongolia.src}
            alt={heroImages.whyMongolia.alt}
            fill
            sizes={SIZES.hero}
            className="object-cover"
            priority
          />
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
          <div className="max-w-4xl mx-auto px-6 text-center">
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
          <div className="max-w-7xl mx-auto px-6">
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
          <div className="max-w-7xl mx-auto px-6">
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
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={normalizeImageUrl(page.coverImage)}
                            alt={page.title}
                            fill
                            sizes={SIZES.card}
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
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
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-12 text-forest-900">
              Experience Mongolia
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Nomadic Culture",
                  description:
                    "Live with nomadic families and experience their traditional lifestyle firsthand.",
                  Icon: Tent,
                },
                {
                  title: "Vast Landscapes",
                  description:
                    "From the Gobi Desert to pristine lakes and snow-capped mountains.",
                  Icon: Mountain,
                },
                {
                  title: "Unique Wildlife",
                  description:
                    "Spot snow leopards, wild horses, and the rare Gobi bear.",
                  Icon: PawPrint,
                },
                {
                  title: "Rich History",
                  description:
                    "Walk in the footsteps of Chinggis Khan and discover ancient monasteries.",
                  Icon: Landmark,
                },
                {
                  title: "Traditional Festivals",
                  description:
                    "Experience Naadam, Eagle Festival, and Tsagaan Sar celebrations.",
                  Icon: PartyPopper,
                },
                {
                  title: "Adventure Activities",
                  description:
                    "Horse trekking, camel riding, hiking, and off-road expeditions.",
                  Icon: Compass,
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-sand"
                >
                  <item.Icon className="w-10 h-10 mb-4 text-gold-500" />
                  <h3 className="text-lg font-semibold mb-2 text-forest-900">
                    {item.title}
                  </h3>
                  <p className="text-charcoal text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visa Information */}
        <section className="py-16 bg-sand">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <FileText className="w-14 h-14 mx-auto mb-4 text-forest-700" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-forest-900">
                Mongolia Visa Information for Travelers
              </h2>
              <p className="text-lg text-charcoal max-w-3xl mx-auto">
                Planning your journey to the Land of the Eternal Blue Sky?
                Understanding Mongolia&apos;s visa requirements is the first step
                toward a smooth adventure. Below you&apos;ll find the most
                up-to-date visa information for 2026, organized by region and
                visa type.
              </p>
            </div>

            {/* Visa-Free Entry intro */}
            <h3 className="text-2xl md:text-3xl font-bold text-forest-900 mb-3 flex items-center gap-3">
              <Globe2 className="w-7 h-7 text-gold-500" />
              Visa-Free Entry to Mongolia
            </h3>
            <p className="text-charcoal mb-8">
              Mongolia currently offers visa-free entry to citizens of many
              countries under either <strong>temporary exemptions</strong>{" "}
              (valid until January 1, 2027) or{" "}
              <strong>permanent bilateral agreements</strong>.
            </p>

            {/* Temporary Visa-Free */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-sand mb-10">
              <h4 className="text-xl md:text-2xl font-bold text-forest-900 mb-2">
                Temporary Visa-Free Countries (Valid Until January 1, 2027)
              </h4>
              <p className="text-charcoal mb-6">
                Citizens of the following <strong>34 countries</strong> may
                enter Mongolia for up to <strong>30 days</strong> without a
                visa:
              </p>

              <h5 className="text-lg font-semibold text-forest-700 mb-3">
                Europe
              </h5>
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

              <h5 className="text-lg font-semibold text-forest-700 mb-3">
                Oceania
              </h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
            </div>

            {/* Permanent Visa-Free */}
            <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-sand mb-10">
              <h4 className="text-xl md:text-2xl font-bold text-forest-900 mb-2">
                Permanent Visa-Free Agreements (No Expiry Date)
              </h4>
              <p className="text-charcoal mb-6">
                These countries enjoy <strong>permanent</strong> visa-free
                access to Mongolia under bilateral agreements.
              </p>

              {/* Americas */}
              <h5 className="text-lg font-semibold text-forest-700 mb-3">
                Americas
              </h5>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border border-sand rounded-lg overflow-hidden">
                  <thead className="bg-sand">
                    <tr>
                      <th className="text-left px-4 py-2 text-forest-900">
                        Country
                      </th>
                      <th className="text-left px-4 py-2 text-forest-900">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { country: "United States", duration: "Up to 90 days" },
                      { country: "Canada", duration: "Up to 90 days" },
                      { country: "Brazil", duration: "Varies" },
                      { country: "Chile", duration: "Varies" },
                    ].map((r) => (
                      <tr key={r.country} className="border-t border-sand">
                        <td className="px-4 py-2 font-medium text-charcoal">
                          {r.country}
                        </td>
                        <td className="px-4 py-2 text-charcoal">
                          {r.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Europe & Eurasia */}
              <h5 className="text-lg font-semibold text-forest-700 mb-3">
                Europe &amp; Eurasia
              </h5>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border border-sand rounded-lg overflow-hidden">
                  <thead className="bg-sand">
                    <tr>
                      <th className="text-left px-4 py-2 text-forest-900">
                        Country
                      </th>
                      <th className="text-left px-4 py-2 text-forest-900">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { country: "Germany", duration: "Up to 30 days (permanent)" },
                      { country: "Turkey", duration: "Up to 30 days" },
                      { country: "Russia", duration: "Up to 30 days" },
                      { country: "Belarus", duration: "Up to 30 days" },
                      { country: "Kazakhstan", duration: "Varies" },
                      { country: "Kyrgyzstan", duration: "Varies" },
                    ].map((r) => (
                      <tr key={r.country} className="border-t border-sand">
                        <td className="px-4 py-2 font-medium text-charcoal">
                          {r.country}
                        </td>
                        <td className="px-4 py-2 text-charcoal">
                          {r.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Asia-Pacific */}
              <h5 className="text-lg font-semibold text-forest-700 mb-3">
                Asia-Pacific
              </h5>
              <div className="overflow-x-auto mb-6">
                <table className="w-full border border-sand rounded-lg overflow-hidden">
                  <thead className="bg-sand">
                    <tr>
                      <th className="text-left px-4 py-2 text-forest-900">
                        Country
                      </th>
                      <th className="text-left px-4 py-2 text-forest-900">
                        Duration
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { country: "Japan", duration: "Up to 30 days" },
                      {
                        country: "South Korea",
                        duration:
                          'Up to 90 days (extended under "Visit Mongolia Year" until Dec 31, 2026)',
                      },
                      { country: "China", duration: "14–30 days (varies)" },
                      { country: "Hong Kong", duration: "14–30 days (varies)" },
                      { country: "Singapore", duration: "14–30 days (varies)" },
                      { country: "Malaysia", duration: "14–30 days (varies)" },
                      { country: "Thailand", duration: "14–30 days (varies)" },
                      { country: "Indonesia", duration: "14–30 days (varies)" },
                      { country: "Philippines", duration: "14–30 days (varies)" },
                    ].map((r) => (
                      <tr key={r.country} className="border-t border-sand">
                        <td className="px-4 py-2 font-medium text-charcoal">
                          {r.country}
                        </td>
                        <td className="px-4 py-2 text-charcoal">
                          {r.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Middle East */}
              <h5 className="text-lg font-semibold text-forest-700 mb-3">
                Middle East
              </h5>
              <div className="bg-sand rounded-lg px-4 py-3 text-charcoal inline-block">
                <strong>Israel</strong> — duration varies
              </div>
            </div>

            {/* E-Visa */}
            <div className="bg-forest-900 text-white rounded-xl p-8 mb-10">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Mongolia E-Visa (evisa.mn)
              </h3>
              <p className="text-gold-200 mb-6">
                If your country is not listed above, you may still qualify for
                Mongolia&apos;s convenient electronic visa system, available to
                citizens of <strong>98 countries</strong>.
              </p>

              <h4 className="text-xl font-bold mb-4">Key E-Visa Details</h4>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                  <div className="text-sm text-gold-200 mb-1">
                    Official Portal
                  </div>
                  <div className="text-xl font-bold">evisa.mn</div>
                </div>
                <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                  <div className="text-sm text-gold-200 mb-1">
                    Processing Time
                  </div>
                  <div className="text-xl font-bold">Within 72 hours</div>
                </div>
                <div className="bg-white/10 rounded-lg p-5 border border-white/20">
                  <div className="text-sm text-gold-200 mb-1">Application</div>
                  <div className="text-xl font-bold">Fully online</div>
                </div>
              </div>

              <h4 className="text-xl font-bold mb-4">Common E-Visa Types</h4>
              <div className="overflow-x-auto">
                <table className="w-full bg-white/10 rounded-lg overflow-hidden">
                  <thead className="bg-white/20">
                    <tr>
                      <th className="text-left px-4 py-3">Code</th>
                      <th className="text-left px-4 py-3">Purpose</th>
                      <th className="text-left px-4 py-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        code: "K1",
                        purpose: "Tourist visa",
                        notes: "For leisure travel and sightseeing",
                      },
                      {
                        code: "K4",
                        purpose: "Sports & cultural events",
                        notes: "For athletes, performers, and cultural visitors",
                      },
                      {
                        code: "K6",
                        purpose: "Transit visa",
                        notes: "Valid for up to 10 days",
                      },
                    ].map((v) => (
                      <tr key={v.code} className="border-t border-white/10">
                        <td className="px-4 py-3 font-bold text-gold-300">
                          {v.code}
                        </td>
                        <td className="px-4 py-3">{v.purpose}</td>
                        <td className="px-4 py-3 text-gold-100">{v.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Important Rules */}
            <h3 className="text-2xl md:text-3xl font-bold text-forest-900 mb-6 flex items-center gap-3">
              <AlertCircle className="w-7 h-7 text-gold-500" />
              Important Entry Rules &amp; Regulations
            </h3>
            <p className="text-charcoal mb-6">
              Please review these essential requirements before traveling:
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-white rounded-xl p-6 border-l-4 border-forest-700 shadow-sm">
                <h4 className="text-lg font-bold text-forest-900 mb-2">
                  Passport Validity
                </h4>
                <p className="text-charcoal">
                  Your passport <strong>must be valid for at least 6 months</strong>{" "}
                  from your date of entry into Mongolia.
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 border-l-4 border-forest-700 shadow-sm">
                <h4 className="text-lg font-bold text-forest-900 mb-2">
                  Registration for Long Stays
                </h4>
                <p className="text-charcoal mb-2">
                  If you plan to stay in Mongolia for{" "}
                  <strong>more than 30 days</strong>, you are required to:
                </p>
                <ul className="list-disc list-inside text-charcoal space-y-1">
                  <li>
                    Register with the{" "}
                    <strong>Mongolia Immigration Agency</strong>
                  </li>
                  <li>
                    Complete registration <strong>within 7 days</strong> of your
                    arrival
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 rounded-xl p-6 border-l-4 border-red-500 shadow-sm">
                <h4 className="text-lg font-bold text-forest-900 mb-2">
                  Consequences of Non-Registration
                </h4>
                <p className="text-charcoal mb-2">
                  Failure to register for stays over 30 days will result in:
                </p>
                <ul className="list-disc list-inside text-charcoal space-y-1">
                  <li>
                    <strong>Denial of exit</strong> at the border
                  </li>
                  <li>
                    <strong>Fines imposed</strong> at departure
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gold-50 border-l-4 border-gold-500 rounded-r-xl p-6 mb-10">
              <p className="text-charcoal">
                <strong>Please Note:</strong> Visa policies and bilateral
                agreements are subject to change. We strongly recommend verifying
                current requirements with your{" "}
                <strong>nearest Mongolian embassy or consulate</strong> before
                booking international flights.
              </p>
            </div>

            {/* Visa CTA */}
            <div className="bg-gradient-to-br from-gold-500 to-gold-600 rounded-xl p-8 md:p-10 text-white text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Explore Mongolia?
              </h3>
              <p className="text-lg mb-8 max-w-2xl mx-auto">
                With easier-than-ever entry requirements, there has never been a
                better time to discover Mongolia&apos;s vast steppes, the
                majestic Gobi Desert, nomadic culture, and ancient Silk Road
                heritage. Our experienced team is here to craft an unforgettable
                journey tailored just for you — from visa guidance to hand-picked
                itineraries.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/tours"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-forest-900 font-semibold rounded-lg hover:bg-sand transition-colors"
                >
                  Book Your Mongolia Tour
                </Link>
                <a
                  href="mailto:info@maralgoodreamland.com"
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-forest-900 text-white font-semibold rounded-lg hover:bg-forest-700 transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  info@maralgoodreamland.com
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-forest-900">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
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
