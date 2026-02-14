import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type Params = { params: { slug: string } };

// GET single blog post by slug
export async function GET(req: Request, { params }: Params) {
  try {
    const session = await getSession();
    const isAdmin = Boolean(session?.isAdmin);

    const post = await prisma.blogPost.findUnique({
      where: { slug: params.slug },
    });

    if (!post || (!post.isPublished && !isAdmin)) {
      return NextResponse.json(
        { ok: false, error: "Post not found" },
        { status: 404 }
      );
    }

    if (post.isPublished && !isAdmin) {
      // Only count public reads as views.
      await prisma.blogPost.update({
        where: { slug: params.slug },
        data: { views: { increment: 1 } },
      });
    }

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
      slug: newSlug,
      excerpt,
      content,
      coverImage,
      featuredImage,
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
        coverImage: coverImage || featuredImage || null,
        author,
        category,
        tags,
        isPublished,
        publishedAt:
          isPublished
            ? existing.publishedAt || new Date()
            : null,
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
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

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
