import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all categories
export async function GET() {
  try {
    const categories = await prisma.tourCategory.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { tours: true },
        },
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST create new category (admin)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, image, order } = body;

    const category = await prisma.tourCategory.create({
      data: {
        name,
        slug,
        description,
        image,
        order: order || 0,
      },
    });

    return NextResponse.json({ ok: true, data: category }, { status: 201 });
  } catch (error) {
    console.error("POST /api/categories error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
