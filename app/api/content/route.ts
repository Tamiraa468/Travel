import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET content pages
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const section = searchParams.get("section");

    const where: any = { isPublished: true };
    if (section) {
      where.section = section;
    }

    const pages = await prisma.contentPage.findMany({
      where,
      orderBy: { order: "asc" },
    });

    return NextResponse.json(pages);
  } catch (error) {
    console.error("GET /api/content error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch content pages" },
      { status: 500 }
    );
  }
}

// POST create content page (admin)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      content,
      excerpt,
      coverImage,
      section,
      parentSlug,
      order,
      metaTitle,
      metaDescription,
    } = body;

    const page = await prisma.contentPage.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        coverImage,
        section,
        parentSlug,
        order: order || 0,
        metaTitle,
        metaDescription,
      },
    });

    return NextResponse.json({ ok: true, data: page }, { status: 201 });
  } catch (error) {
    console.error("POST /api/content error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create content page" },
      { status: 500 }
    );
  }
}
