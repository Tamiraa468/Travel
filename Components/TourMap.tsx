"use client";

import { MapPin } from "lucide-react";

type Props = {
  mapEmbed: string;
  title?: string;
};

export default function TourMap({ mapEmbed, title = "Tour Route Map" }: Props) {
  if (!mapEmbed) {
    return null;
  }

  // Check if it's an iframe string or just a URL
  const isIframe = mapEmbed.includes("<iframe");

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>

      <div className="aspect-video w-full">
        {isIframe ? (
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
    </div>
  );
}
