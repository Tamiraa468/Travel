import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import BlogCard from "@/Components/BlogCard";
import prisma from "@/lib/prisma";
import Link from "next/link";

type Props = {
  searchParams?: { category?: string; page?: string };
};

const categoryLabels: Record<string, string> = {
  NEWS: "News",
  FESTIVAL: "Festivals",
  TRAVEL_GUIDE: "Travel Guides",
  CULTURE: "Culture",
  ADVENTURE: "Adventure",
  TIPS: "Tips",
};

export default async function BlogPage({ searchParams }: Props) {
  const category = searchParams?.category;
  const page = parseInt(searchParams?.page || "1");
  const limit = 9;

  const where: any = { isPublished: true };
  if (category) {
    where.category = category;
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.blogPost.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Get category counts
  const categories = await prisma.blogPost.groupBy({
    by: ["category"],
    where: { isPublished: true },
    _count: true,
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 py-20">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-200">
                Travel News & Stories
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Discover Mongolia through our travel guides, festival updates, and
              adventure stories
            </p>
          </div>
        </section>

        {/* Category Filter */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Link
              href="/blog"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                !category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Posts ({total})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.category}
                href={`/blog?category=${cat.category}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  category === cat.category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {categoryLabels[cat.category] || cat.category} ({cat._count})
              </Link>
            ))}
          </div>
        </div>

        {/* Blog Grid */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          {posts.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-12">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <Link
                        key={pageNum}
                        href={`/blog?${
                          category ? `category=${category}&` : ""
                        }page=${pageNum}`}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {pageNum}
                      </Link>
                    )
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No blog posts found.</p>
              <Link
                href="/blog"
                className="inline-block mt-4 text-blue-600 hover:underline"
              >
                View all posts
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
