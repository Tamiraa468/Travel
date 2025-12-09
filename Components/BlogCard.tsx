"use client";

import Link from "next/link";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";

type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  coverImage?: string | null;
  author?: string | null;
  category: string;
  publishedAt?: Date | string | null;
  views: number;
};

type Props = {
  post: BlogPost;
};

const categoryColors: Record<string, string> = {
  NEWS: "bg-blue-100 text-blue-700",
  FESTIVAL: "bg-purple-100 text-purple-700",
  TRAVEL_GUIDE: "bg-green-100 text-green-700",
  CULTURE: "bg-orange-100 text-orange-700",
  ADVENTURE: "bg-red-100 text-red-700",
  TIPS: "bg-yellow-100 text-yellow-700",
};

export default function BlogCard({ post }: Props) {
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const categoryLabel = post.category.replace(/_/g, " ");

  return (
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        className="block relative aspect-[16/9] overflow-hidden"
      >
        {post.coverImage ? (
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
            <span className="text-white/70 text-lg font-medium">UTravel</span>
          </div>
        )}

        {/* Category Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[post.category] || "bg-gray-100 text-gray-700"
          }`}
        >
          {categoryLabel}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          {post.publishedAt && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.publishedAt)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            {post.views} views
          </span>
        </div>

        {/* Title */}
        <Link href={`/blog/${post.slug}`}>
          <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {post.excerpt}
          </p>
        )}

        {/* Read More */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
