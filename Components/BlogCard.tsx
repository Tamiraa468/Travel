"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, Eye, ArrowRight } from "lucide-react";
import { optimizeImage } from "@/lib/image";

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
  NEWS: "bg-forest-500/10 text-forest-700",
  FESTIVAL: "bg-gold-500/20 text-gold-700",
  TRAVEL_GUIDE: "bg-forest-500/10 text-forest-700",
  CULTURE: "bg-gold-500/20 text-gold-700",
  ADVENTURE: "bg-forest-700/10 text-forest-900",
  TIPS: "bg-gold-300/30 text-gold-700",
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
    <article className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-sand">
      {/* Image */}
      <Link
        href={`/blog/${post.slug}`}
        className="block relative aspect-[16/9] overflow-hidden"
      >
        {post.coverImage ? (
          <Image
            src={optimizeImage(post.coverImage, 600)}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-forest-500 to-forest-700 flex items-center justify-center">
            <span className="text-white/70 text-lg font-medium">Maralgoo</span>
          </div>
        )}

        {/* Category Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${
            categoryColors[post.category] || "bg-sand text-charcoal"
          }`}
        >
          {categoryLabel}
        </span>
      </Link>

      {/* Content */}
      <div className="p-5">
        {/* Meta */}
        <div className="flex items-center gap-4 text-xs text-stone mb-3">
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
          <h2 className="text-lg font-semibold text-forest-900 mb-2 line-clamp-2 group-hover:text-gold-500 transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-stone text-sm line-clamp-2 mb-4">{post.excerpt}</p>
        )}

        {/* Read More */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-forest-700 hover:text-gold-500 transition-colors"
        >
          Read More
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </article>
  );
}
