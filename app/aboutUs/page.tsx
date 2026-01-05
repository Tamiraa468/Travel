import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const AboutUs = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow bg-sand">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-12 text-forest-900">
              About Us
            </h1>

            {/* Company Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-forest-900">
                Welcome to{" "}
                <span className="font-playfair">Maralgoo Dreamland</span>
              </h2>
              <p className="text-charcoal mb-4">
                Founded in Ulaanbaatar, Maralgoo Dreamland has been at the
                forefront of providing exceptional luxury travel experiences in
                Mongolia. We specialize in creating unforgettable journeys that
                showcase the beauty, culture, and traditions of our country.
              </p>
              <p className="text-charcoal">
                Our team of experienced travel professionals is dedicated to
                ensuring that every aspect of your journey is carefully planned
                and executed to perfection.
              </p>
            </div>

            {/* Our Mission */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-forest-900">
                Our Mission
              </h2>
              <p className="text-charcoal">
                Our mission is to provide authentic, sustainable, and memorable
                travel experiences that connect visitors with the true spirit of
                Mongolia while supporting local communities and preserving our
                natural environment.
              </p>
            </div>

            {/* Why Choose Us */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4 text-forest-900">
                Why Choose Us
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-ivory rounded-lg shadow-md hover:shadow-lg hover:border-gold-300 border border-sand transition-all duration-200">
                  <h3 className="text-xl font-semibold mb-2 text-forest-900">
                    Local Expertise
                  </h3>
                  <p className="text-charcoal">
                    Our deep knowledge of Mongolia ensures you experience the
                    best our country has to offer.
                  </p>
                </div>
                <div className="p-4 bg-ivory rounded-lg shadow-md hover:shadow-lg hover:border-gold-300 border border-sand transition-all duration-200">
                  <h3 className="text-xl font-semibold mb-2 text-forest-900">
                    Personalized Service
                  </h3>
                  <p className="text-charcoal">
                    We tailor each journey to meet your specific interests and
                    preferences.
                  </p>
                </div>
                <div className="p-4 bg-ivory rounded-lg shadow-md hover:shadow-lg hover:border-gold-300 border border-sand transition-all duration-200">
                  <h3 className="text-xl font-semibold mb-2 text-forest-900">
                    Quality Assurance
                  </h3>
                  <p className="text-charcoal">
                    We maintain high standards in all our services, from
                    accommodation to transportation.
                  </p>
                </div>
                <div className="p-4 bg-ivory rounded-lg shadow-md hover:shadow-lg hover:border-gold-300 border border-sand transition-all duration-200">
                  <h3 className="text-xl font-semibold mb-2 text-forest-900">
                    Sustainable Tourism
                  </h3>
                  <p className="text-charcoal">
                    We prioritize eco-friendly practices and support local
                    communities.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Team */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-forest-900">
                Our Team
              </h2>
              <p className="text-charcoal mb-6">
                Our team consists of passionate travel enthusiasts with
                extensive experience in the tourism industry. Each member brings
                unique expertise and dedication to creating exceptional travel
                experiences.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
