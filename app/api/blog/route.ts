import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET all published blog posts
export async function GET(req: Request) {
  try {
    const session = await getSession();
    const isAdmin = Boolean(session?.isAdmin);

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page") || "1";

    const where: any = {};
    if (!isAdmin) {
      where.isPublished = true;
    }
    if (category) {
      where.category = category;
    }

    const take = limit ? Number.parseInt(limit, 10) : 10;
    const safeTake = Number.isNaN(take) ? 10 : Math.min(Math.max(take, 1), 100);
    const currentPage = Number.parseInt(page, 10);
    const safePage = Number.isNaN(currentPage) ? 1 : Math.max(currentPage, 1);
    const skip = (safePage - 1) * safeTake;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: isAdmin ? { updatedAt: "desc" } : { publishedAt: "desc" },
        take: safeTake,
        skip,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page: safePage,
        limit: safeTake,
        totalPages: Math.ceil(total / safeTake),
      },
    });
  } catch (error) {
    console.error("GET /api/blog error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

// POST create new blog post (admin)
export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      featuredImage,
      author,
      category,
      tags,
      isPublished,
    } = body;

    if (!title || !slug || !content) {
      return NextResponse.json(
        { ok: false, error: "Title, slug and content are required" },
        { status: 400 }
      );
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage: coverImage || featuredImage || null,
        author,
        category: category || "NEWS",
        tags: tags || [],
        isPublished: isPublished || false,
        publishedAt: isPublished ? new Date() : null,
      },
    });

    return NextResponse.json({ ok: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("POST /api/blog error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
