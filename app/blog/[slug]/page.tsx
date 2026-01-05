import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Eye, ArrowLeft, Tag } from "lucide-react";

type Props = {
  params: { slug: string };
};

export default async function BlogPostPage({ params }: Props) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // Increment view count
  await prisma.blogPost.update({
    where: { slug: params.slug },
    data: { views: { increment: 1 } },
  });

  // Get related posts
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      isPublished: true,
      category: post.category,
      id: { not: post.id },
    },
    take: 3,
    orderBy: { publishedAt: "desc" },
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="relative h-[50vh] bg-forest-900">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-900/70 to-transparent" />
          </div>
        )}

        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-forest-700 hover:text-gold-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-forest-900 mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-charcoal mb-8 pb-8 border-b border-sand">
            {post.publishedAt && (
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {post.author && (
              <span className="flex items-center gap-2">
                <User className="w-5 h-5" />
                {post.author}
              </span>
            )}
            <span className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {post.views} views
            </span>
            <span className="px-3 py-1 bg-gold-500/10 text-gold-700 rounded-full text-sm">
              {post.category.replace(/_/g, " ")}
            </span>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className="text-charcoal leading-relaxed whitespace-pre-wrap"
            />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t border-sand">
              <div className="flex items-center gap-3 flex-wrap">
                <Tag className="w-5 h-5 text-stone" />
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-sand text-charcoal rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="bg-sand py-12">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-8 text-forest-900">
                Related Posts
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="bg-ivory rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-sand hover:border-gold-300"
                  >
                    {relatedPost.coverImage && (
                      <img
                        src={relatedPost.coverImage}
                        alt={relatedPost.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-forest-900 line-clamp-2">
                        {relatedPost.title}
                      </h3>
                    </div>
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
