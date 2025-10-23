"use client";
import React from "react";
import {
  CheckCircle,
  Globe2,
  Users,
  Headphones,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    id: 1,
    icon: <Globe2 className="h-10 w-10 text-blue-800" />,
    title: "Authentic Experiences",
    description:
      "Explore Mongolia with local guides and immerse yourself in genuine nomadic culture.",
  },
  {
    id: 2,
    icon: <Users className="h-10 w-10 text-blue-800" />,
    title: "Small Group Tours",
    description:
      "Enjoy intimate group sizes for a more personal and comfortable travel experience.",
  },
  {
    id: 3,
    icon: <ShieldCheck className="h-10 w-10 text-blue-800" />,
    title: "Safe & Reliable",
    description:
      "Your safety is our top priority — from transport to accommodation.",
  },
  {
    id: 4,
    icon: <Headphones className="h-10 w-10 text-blue-800" />,
    title: "24/7 Support",
    description:
      "We’re always here to assist you before, during, and after your trip.",
  },
  {
    id: 5,
    icon: <CheckCircle className="h-10 w-10 text-blue-800" />,
    title: "Tailor-Made Packages",
    description:
      "Customize your tour itinerary to fit your style, time, and budget.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-20 bg-white">
      {/* Header */}
      <div className="flex flex-col items-center text-center px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-gray-800">
          Why <span className="text-blue-800">Choose Us?</span>
        </h2>
        <div className="w-24 h-0.5 bg-blue-800 mt-3"></div>
        <p className="text-gray-600 max-w-xl mt-4">
          We go beyond ordinary tours — offering authentic, safe, and
          unforgettable experiences across Mongolia.
        </p>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mt-16 px-6 md:px-16 lg:px-32">
        {features.map(({ id, icon, title, description }) => (
          <div
            key={id}
            className="bg-white shadow-md rounded-2xl p-8 flex flex-col items-center text-center hover:-translate-y-2 hover:shadow-lg transition duration-300"
          >
            <div className="mb-4">{icon}</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;
