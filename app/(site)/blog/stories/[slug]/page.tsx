import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, MapPin, Star, ArrowLeft, Eye } from "lucide-react";
import type { Metadata } from "next";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const story = await prisma.guestStory.findUnique({
    where: { slug: params.slug },
    select: { title: true, name: true, country: true },
  });

  if (!story) return { title: "Story Not Found" };

  return {
    title: `${story.title} - Traveler Story`,
    description: `Read ${story.name}${story.country ? ` from ${story.country}` : ""}'s travel story about Mongolia.`,
  };
}

export default async function GuestStoryPage({ params }: Props) {
  const story = await prisma.guestStory.findUnique({
    where: { slug: params.slug },
  });

  if (!story || !story.isApproved || !story.isPublished) {
    notFound();
  }

  // Increment views
  await prisma.guestStory.update({
    where: { slug: params.slug },
    data: { views: { increment: 1 } },
  });

  // Get more stories
  const moreStories = await prisma.guestStory.findMany({
    where: {
      isApproved: true,
      isPublished: true,
      id: { not: story.id },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-b from-forest-900 via-forest-700 to-forest-900 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <span className="inline-block px-3 py-1 bg-gold-500/20 text-gold-300 rounded-full text-sm mb-4">
              Traveler Story
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4">
              {story.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/70 text-sm flex-wrap">
              <span className="font-medium text-white">{story.name}</span>
              {story.country && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {story.country}
                </span>
              )}
              {story.travelDate && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {story.travelDate}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {story.views} views
              </span>
            </div>
            {/* Rating */}
            <div className="flex items-center justify-center gap-1 mt-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < story.rating
                      ? "text-gold-400 fill-gold-400"
                      : "text-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        <article className="max-w-4xl mx-auto px-4 py-12">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-forest-700 hover:text-gold-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {story.tourName && (
            <div className="bg-gold-50 border border-gold-200 rounded-lg px-4 py-3 mb-8">
              <span className="text-sm text-gold-700 font-medium">
                Tour: {story.tourName}
              </span>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            <div className="text-charcoal leading-relaxed whitespace-pre-wrap">
              {story.content}
            </div>
          </div>
        </article>

        {/* More Stories */}
        {moreStories.length > 0 && (
          <section className="bg-sand py-12">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-forest-900">
                More Traveler Stories
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {moreStories.map((s) => (
                  <Link
                    key={s.id}
                    href={`/blog/stories/${s.slug}`}
                    className="bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow border border-sand"
                  >
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < s.rating
                              ? "text-gold-500 fill-gold-500"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>
                    <h3 className="font-semibold text-forest-900 line-clamp-2 mb-1">
                      {s.title}
                    </h3>
                    <p className="text-sm text-stone">
                      {s.name}
                      {s.country ? ` — ${s.country}` : ""}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
