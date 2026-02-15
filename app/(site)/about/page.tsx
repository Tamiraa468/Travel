import Image from "next/image";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import TeamSection from "@/Components/TeamSection";
import prisma from "@/lib/prisma";
import { heroImages, tourImages, SIZES } from "@/lib/images";
import { Building2, Target, Heart, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Maralgoo Dreamland - your trusted partner for authentic Mongolia adventures since 2020. Meet our passionate team of local travel experts.",
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    title: "About Maralgoo Dreamland",
    description:
      "Your trusted partner for authentic Mongolia adventures since 2020.",
    url: "/about",
  },
};

export default async function AboutPage() {
  const teamMembers = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-gradient-to-b from-forest-900 via-forest-700 to-forest-900">
          <Image
            src={heroImages.about.src}
            alt={heroImages.about.alt}
            fill
            sizes={SIZES.hero}
            className="object-cover opacity-20"
            priority
          />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gold-300 to-gold-300">
                About Maralgoo Dreamland
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-stone max-w-3xl mx-auto">
              Your trusted partner for authentic Mongolia adventures since 2020
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                  <Building2 className="w-8 h-8 text-forest-700" />
                  Our Story
                </h2>
                <div className="space-y-4 text-charcoal leading-relaxed">
                  <p>
                    Founded in Ulaanbaatar, Maralgoo Dreamland is led by a
                    passionate team of Mongolian travel professionals. Our
                    founders and staff bring years of expertise in the tourism
                    industry, having worked extensively in this field before
                    establishing Maralgoo Dreamland.
                  </p>
                  <p>
                    With a team of tour managers, expert tour guides, chefs,
                    local horse wranglers, and skilled drivers—each with 10-15
                    years of tour experience—we are committed to delivering
                    exceptional travel experiences.
                  </p>
                  <p>
                    Since our establishment, we have been dedicated to helping
                    travelers from around the world explore the beauty and
                    adventure of Mongolia, crafting unforgettable experiences
                    with expertise and passion.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <Image
                    src={tourImages.gobi.src}
                    alt="Maralgoo Dreamland Team"
                    fill
                    sizes={SIZES.half}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-forest-900 text-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl font-bold">5+</div>
                  <div className="text-gold-300">Years of Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 bg-sand">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-ivory p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-forest-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-forest-900">
                  Our Mission
                </h3>
                <p className="text-charcoal">
                  To provide authentic, immersive travel experiences that
                  connect visitors with Mongolia's stunning landscapes, rich
                  culture, and warm-hearted people while supporting local
                  communities.
                </p>
              </div>

              <div className="bg-ivory p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-forest-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-7 h-7 text-forest-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-forest-900">
                  Our Values
                </h3>
                <p className="text-charcoal">
                  We believe in responsible tourism that empowers communities
                  and protects the environment. Every journey we craft respects
                  and preserves Mongolia's natural beauty and cultural heritage.
                </p>
              </div>

              <div className="bg-ivory p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-gold-500/10 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-gold-700" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-forest-900">
                  Our Promise
                </h3>
                <p className="text-charcoal">
                  24/7 support throughout your journey, expertly crafted
                  itineraries, and authentic connections with Mongolian people
                  and their culture. Your satisfaction is our highest priority.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-ivory">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-forest-900">
              Why Choose Maralgoo Dreamland?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Expertly Crafted Itineraries",
                  description:
                    "Showcasing Mongolia's must-see destinations and hidden gems.",
                },
                {
                  title: "Responsible Tourism",
                  description:
                    "Tours that empower communities and protect the environment.",
                },
                {
                  title: "Unmatched Expertise",
                  description:
                    "Years of designing seamless, high-quality travel experiences.",
                },
                {
                  title: "Authentic Connections",
                  description:
                    "Opportunities to meet Mongolian people and engage with their culture.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="text-center p-6 border border-sand bg-white rounded-xl hover:border-gold-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-forest-900 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2 text-forest-900">
                    {item.title}
                  </h3>
                  <p className="text-charcoal text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        {teamMembers.length > 0 && <TeamSection members={teamMembers} />}

        {/* CTA Section */}
        <section className="py-16 bg-forest-900">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Explore Mongolia?
            </h2>
            <p className="text-xl text-gold-300 mb-8">
              Let us help you plan your perfect adventure in the Land of the
              Blue Sky
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/tours"
                className="px-8 py-3 bg-white text-forest-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                View Tours
              </a>
              <a
                href="/contact"
                className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
