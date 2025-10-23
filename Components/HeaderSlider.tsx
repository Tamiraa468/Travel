"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { assets } from "../assets/assets";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Experience Mongolia Like Never Before",
      offer: "Adventure Awaits",
      buttonText1: "Book Now",
      buttonText2: "Learn More",
      imgSrc: assets.sliderImages[0],
    },
    {
      id: 2,
      title: "Discover the Gobi Desert",
      offer: "Limited Seats Available",
      buttonText1: "Explore Tours",
      buttonText2: "View Gallery",
      imgSrc: assets.sliderImages[1],
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 5000); // 5s per slide
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index: number) => setCurrentSlide(index);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Slides */}
      {sliderData.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.imgSrc}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay text */}
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 flex flex-col justify-center items-start px-8 md:px-32 text-white">
            <p className="text-lg md:text-xl mb-2">{slide.offer}</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-lg">
              {slide.title}
            </h1>
            <div className="flex gap-4">
              <button className="bg-orange-600 px-6 py-3 rounded-full font-medium hover:bg-orange-500 transition">
                {slide.buttonText1}
              </button>
              <button className="bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition">
                {slide.buttonText2}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-white/50"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
