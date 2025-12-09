import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import TeamSection from "@/Components/TeamSection";
import prisma from "@/lib/prisma";
import { Building2, Target, Heart, Award } from "lucide-react";

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
        <section className="relative h-[50vh] min-h-[400px] flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
          <div className="absolute inset-0 bg-[url('/images/about-hero.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-200">
                About UTravel
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto">
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
                  <Building2 className="w-8 h-8 text-blue-600" />
                  Our Story
                </h2>
                <div className="space-y-4 text-gray-600 leading-relaxed">
                  <p>
                    Founded in Ulaanbaatar, UTravel Mongolia is led by a
                    passionate team of Mongolian travel professionals. Our
                    founders and staff bring years of expertise in the tourism
                    industry, having worked extensively in this field before
                    establishing UTravel.
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
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/images/about-team.jpg"
                    alt="UTravel Team"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg">
                  <div className="text-4xl font-bold">5+</div>
                  <div className="text-blue-100">Years of Experience</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To provide authentic, immersive travel experiences that
                  connect visitors with Mongolia's stunning landscapes, rich
                  culture, and warm-hearted people while supporting local
                  communities.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                  <Heart className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Values</h3>
                <p className="text-gray-600">
                  We believe in responsible tourism that empowers communities
                  and protects the environment. Every journey we craft respects
                  and preserves Mongolia's natural beauty and cultural heritage.
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm">
                <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Our Promise</h3>
                <p className="text-gray-600">
                  24/7 support throughout your journey, expertly crafted
                  itineraries, and authentic connections with Mongolian people
                  and their culture. Your satisfaction is our highest priority.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose UTravel?
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
                  className="text-center p-6 border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        {teamMembers.length > 0 && <TeamSection members={teamMembers} />}

        {/* CTA Section */}
        <section className="py-16 bg-blue-600">
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Explore Mongolia?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Let us help you plan your perfect adventure in the Land of the
              Blue Sky
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/tours"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
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
