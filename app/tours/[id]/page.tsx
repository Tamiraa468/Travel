"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTravelAgencyContext, Tour } from "@/context/TravelAgencyContext";
import Navbar from "../../../Components/Navbar";
import Footer from "../../../Components/Footer";
import Image from "next/image";
import RecommendedTours from "../../../Components/RecommendedTours";
import Loading from "../../../Components/Loading";
import { assets } from "../../../assets/assets";

const TourPage: React.FC = () => {
  const { id } = useParams();
  const { tours } = useTravelAgencyContext();
  const [tourData, setTourData] = useState<Tour | null>(null);
  const [mainImage, setMainImage] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "itinerary" | "included"
  >("overview");
  const router = useRouter();

  useEffect(() => {
    const tour = tours.find((t) => t.id === id);
    if (tour) {
      setTourData(tour);
      // Get the image from assets based on tour id
      const tourImageKey = tour.id.split(
        "-"
      )[0] as keyof typeof assets.tourImages; // e.g., 'gobi' from 'gobi-001'
      if (tourImageKey in assets.tourImages) {
        setMainImage(assets.tourImages[tourImageKey]);
      }
    }
  }, [id, tours]);

  if (!tourData) return <Loading />;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-grow bg-gray-50">
        {/* Hero Section with Main Image */}
        <div className="relative min-h-[80vh] w-full overflow-hidden bg-slate-900">
          {mainImage && (
            <Image
              src={mainImage}
              alt={tourData.title}
              fill
              sizes="100vw"
              className="object-cover object-center opacity-70"
              priority
              quality={90}
            />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center p-4">
            <div className="container mx-auto px-4">
              {/* Tour Category Badge */}
              <div className="flex justify-center mb-6">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                  Adventure Tour
                </span>
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold text-white text-center mb-6 max-w-4xl mx-auto leading-tight">
                {tourData.title}
              </h1>

              {/* Tour Brief Info */}
              <div className="flex flex-wrap justify-center items-center gap-6 text-white mt-8">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-lg">{tourData.duration}</span>
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-lg">{tourData.location}</span>
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-lg">${tourData.price}</span>
                </div>
              </div>

              {/* Quick Highlights */}
              {tourData.highlights && tourData.highlights.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-3xl mx-auto">
                  {tourData.highlights.slice(0, 3).map((highlight, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2"
                    >
                      <svg
                        className="w-5 h-5 text-blue-400 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-white text-sm">{highlight}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA Button - navigate to dedicated payment page */}
              <div className="flex justify-center mt-10">
                <button
                  onClick={() =>
                    router.push(
                      `/payment?tourId=${encodeURIComponent(
                        tourData.id
                      )}&amount=${Math.round(Number(tourData.price) * 100)}`
                    )
                  }
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium transition-colors duration-300 transform hover:scale-105"
                >
                  Book This Tour
                </button>
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-white animate-bounce">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
            <span className="text-sm mt-2">Scroll to explore</span>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Gallery */}
              {Array.isArray(tourData.image) && (
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Gallery</h2>
                  <div className="grid grid-cols-4 gap-4">
                    {tourData.image.map((img, index) => (
                      <div
                        key={index}
                        onClick={() => setMainImage(img)}
                        className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10 transition-transform hover:scale-105"
                      >
                        <Image
                          src={img}
                          alt={`${tourData.title} - Image ${index + 1}`}
                          className="w-full h-auto object-cover"
                          width={300}
                          height={200}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`flex-1 py-4 px-6 text-center font-medium ${
                      activeTab === "overview"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("itinerary")}
                    className={`flex-1 py-4 px-6 text-center font-medium ${
                      activeTab === "itinerary"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    Itinerary
                  </button>
                  <button
                    onClick={() => setActiveTab("included")}
                    className={`flex-1 py-4 px-6 text-center font-medium ${
                      activeTab === "included"
                        ? "bg-blue-600 text-white"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    What's Included
                  </button>
                </div>

                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-4">
                      <p className="text-gray-600 whitespace-pre-line">
                        {tourData.description}
                      </p>
                      <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-3">
                          Highlights
                        </h3>
                        <ul className="space-y-2">
                          {tourData.highlights?.map((highlight, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-6 w-6 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {activeTab === "itinerary" && (
                    <div className="space-y-6">
                      {tourData.itinerary?.map((day) => (
                        <div
                          key={day.day}
                          className="border-b border-gray-200 pb-4 last:border-0"
                        >
                          <h3 className="text-xl font-semibold mb-2">
                            Day {day.day}: {day.title}
                          </h3>
                          <p className="text-gray-600">{day.description}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "included" && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          What's Included
                        </h3>
                        <ul className="space-y-2">
                          {tourData.included?.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-5 w-5 text-green-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-3">
                          Not Included
                        </h3>
                        <ul className="space-y-2">
                          {tourData.notIncluded?.map((item, index) => (
                            <li key={index} className="flex items-start">
                              <svg
                                className="h-5 w-5 text-red-500 mr-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">
                    ${tourData.price}
                  </h3>
                  <p className="text-gray-600">per person</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{tourData.duration}</span>
                  </div>
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-500 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>{tourData.location}</span>
                  </div>
                </div>

                <button
                  onClick={() =>
                    router.push(
                      `/payment?tourId=${encodeURIComponent(
                        tourData.id
                      )}&amount=${Math.round(Number(tourData.price) * 100)}`
                    )
                  }
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Recommended Tours */}
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-semibold mb-8">Recommended Tours</h2>
          <RecommendedTours />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TourPage;
