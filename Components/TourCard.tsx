"use client";
import React from "react";
import Image from "next/image";
import { useTravelAgencyContext, Tour } from "../context/TravelAgencyContext";

type TourCardProps = {
  tour: Tour;
};

const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const { currency, router } = useTravelAgencyContext();

  return (
    <div
      onClick={() => {
        router?.push("/tours/" + tour.id);
        scrollTo(0, 0);
      }}
      className="flex flex-col items-start gap-1 max-w-[250px] w-full cursor-pointer"
    >
      <div className="group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden">
        {tour.image && (
          <Image
            src={tour.image}
            alt={tour.title}
            className="group-hover:scale-105 transition object-cover w-full h-full"
            width={400}
            height={400}
          />
        )}
        <button className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md">
          {/* Heart icon if you want */}
        </button>
      </div>

      <p className="md:text-base font-medium pt-2 w-full truncate">
        {tour.title}
      </p>
      <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">
        {tour.description}
      </p>

      <div className="flex items-center justify-between w-full mt-1">
        <p className="text-base font-medium">
          {currency} {tour.price}
        </p>
        <p className="text-xs text-gray-500">{tour.duration}</p>
      </div>

      <button className="mt-2 px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
        Book Now
      </button>
    </div>
  );
};

export default TourCard;
