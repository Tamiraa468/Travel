import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";

const AboutUs = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-center mb-12">About Us</h1>

            {/* Company Introduction */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">
                Welcome to UTravel
              </h2>
              <p className="text-gray-600 mb-4">
                Founded in 2023, UTravel has been at the forefront of providing
                exceptional travel experiences in Mongolia. We specialize in
                creating unforgettable journeys that showcase the beauty,
                culture, and traditions of our country.
              </p>
              <p className="text-gray-600">
                Our team of experienced travel professionals is dedicated to
                ensuring that every aspect of your journey is carefully planned
                and executed to perfection.
              </p>
            </div>

            {/* Our Mission */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="text-gray-600">
                Our mission is to provide authentic, sustainable, and memorable
                travel experiences that connect visitors with the true spirit of
                Mongolia while supporting local communities and preserving our
                natural environment.
              </p>
            </div>

            {/* Why Choose Us */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-xl font-semibold mb-2">
                    Local Expertise
                  </h3>
                  <p className="text-gray-600">
                    Our deep knowledge of Mongolia ensures you experience the
                    best our country has to offer.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-xl font-semibold mb-2">
                    Personalized Service
                  </h3>
                  <p className="text-gray-600">
                    We tailor each journey to meet your specific interests and
                    preferences.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-xl font-semibold mb-2">
                    Quality Assurance
                  </h3>
                  <p className="text-gray-600">
                    We maintain high standards in all our services, from
                    accommodation to transportation.
                  </p>
                </div>
                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                  <h3 className="text-xl font-semibold mb-2">
                    Sustainable Tourism
                  </h3>
                  <p className="text-gray-600">
                    We prioritize eco-friendly practices and support local
                    communities.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Team */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
              <p className="text-gray-600 mb-6">
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
