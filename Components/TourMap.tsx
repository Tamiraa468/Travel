"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";

type Props = {
  mapEmbed?: string;
  mapImage?: string;
  title?: string;
};

export default function TourMap({
  mapEmbed,
  mapImage,
  title = "Tour Route Map",
}: Props) {
  // If neither mapImage nor mapEmbed is provided, don't render anything
  if (!mapImage && !mapEmbed) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="w-full">
        {/* Priority: Show mapImage if available, otherwise show mapEmbed */}
        {mapImage ? (
          <div className="relative w-full">
            <img
              src={mapImage}
              alt={title}
              className="w-full h-auto object-contain"
            />
          </div>
        ) : mapEmbed ? (
          <div className="aspect-video w-full">
            {mapEmbed.includes("<iframe") ? (
              <div
                className="w-full h-full"
                dangerouslySetInnerHTML={{ __html: mapEmbed }}
              />
            ) : (
              <iframe
                src={mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
