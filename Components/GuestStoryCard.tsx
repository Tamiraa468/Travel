"use client";

import Link from "next/link";
import { Star, MapPin, Calendar, Eye } from "lucide-react";

type GuestStory = {
  id: string;
  name: string;
  country?: string | null;
  title: string;
  slug: string;
  content: string;
  rating: number;
  tourName?: string | null;
  travelDate?: string | null;
  views: number;
  createdAt: Date | string;
};

export default function GuestStoryCard({ story }: { story: GuestStory }) {
  const excerpt =
    story.content.length > 150
      ? story.content.slice(0, 150) + "..."
      : story.content;

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-sand p-5">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-forest-100 text-forest-700 rounded-full flex items-center justify-center font-bold text-lg">
            {story.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 className="font-medium text-forest-900">{story.name}</h4>
            {story.country && (
              <span className="flex items-center gap-1 text-xs text-stone">
                <MapPin className="w-3 h-3" />
                {story.country}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < story.rating
                  ? "text-gold-500 fill-gold-500"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <Link href={`/blog/stories/${story.slug}`}>
        <h3 className="text-lg font-semibold text-forest-900 mb-2 hover:text-gold-500 transition-colors line-clamp-2">
          {story.title}
        </h3>
      </Link>

      {/* Excerpt */}
      <p className="text-stone text-sm mb-4 line-clamp-3">{excerpt}</p>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-stone border-t border-sand pt-3">
        {story.tourName && (
          <span className="bg-gold-100 text-gold-700 px-2 py-0.5 rounded-full">
            {story.tourName}
          </span>
        )}
        {story.travelDate && (
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {story.travelDate}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Eye className="w-3 h-3" />
          {story.views}
        </span>
      </div>
    </article>
  );
}
