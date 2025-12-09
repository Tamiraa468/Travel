import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: { slug: string } };

// GET single blog post by slug
export async function GET(req: Request, { params }: Params) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (!post) {
      return NextResponse.json(
        { ok: false, error: "Post not found" },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.blogPost.update({
      where: { slug: params.slug },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error("GET /api/blog/[slug] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

// PUT update blog post
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const {
      title,
      slug: newSlug,
      excerpt,
      content,
      coverImage,
      author,
      category,
      tags,
      isPublished,
    } = body;

    // Find by current slug
    const existing = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Post not found" },
        { status: 404 }
      );
    }

    const post = await prisma.blogPost.update({
      where: { slug: params.slug },
      data: {
        title,
        slug: newSlug || params.slug,
        excerpt,
        content,
        coverImage,
        author,
        category,
        tags,
        isPublished,
        publishedAt:
          isPublished && !existing.publishedAt
            ? new Date()
            : existing.publishedAt,
      },
    });

    return NextResponse.json({ ok: true, data: post });
  } catch (error) {
    console.error("PUT /api/blog/[slug] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

// DELETE blog post
export async function DELETE(req: Request, { params }: Params) {
  try {
    await prisma.blogPost.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/blog/[slug] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}
