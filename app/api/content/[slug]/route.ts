import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: { slug: string } };

// GET single content page
export async function GET(req: Request, { params }: Params) {
  try {
    const page = await prisma.contentPage.findUnique({
      where: { slug: params.slug },
    });

    if (!page) {
      return NextResponse.json(
        { ok: false, error: "Page not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error("GET /api/content/[slug] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch content page" },
      { status: 500 }
    );
  }
}

// PUT update content page
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const {
      title,
      slug: newSlug,
      content,
      excerpt,
      coverImage,
      section,
      parentSlug,
      order,
      isPublished,
      metaTitle,
      metaDescription,
    } = body;

    const page = await prisma.contentPage.update({
      where: { slug: params.slug },
      data: {
        title,
        slug: newSlug || params.slug,
        content,
        excerpt,
        coverImage,
        section,
        parentSlug,
        order,
        isPublished,
        metaTitle,
        metaDescription,
      },
    });

    return NextResponse.json({ ok: true, data: page });
  } catch (error) {
    console.error("PUT /api/content/[slug] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update content page" },
      { status: 500 }
    );
  }
}

// DELETE content page
export async function DELETE(req: Request, { params }: Params) {
  try {
    await prisma.contentPage.delete({
      where: { slug: params.slug },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/content/[slug] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete content page" },
      { status: 500 }
    );
  }
}
