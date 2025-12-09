import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all published blog posts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const page = searchParams.get("page") || "1";

    const where: any = { isPublished: true };
    if (category) {
      where.category = category;
    }

    const take = limit ? parseInt(limit) : 10;
    const skip = (parseInt(page) - 1) * take;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        take,
        skip,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take),
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
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags,
      isPublished,
    } = body;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        coverImage,
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
