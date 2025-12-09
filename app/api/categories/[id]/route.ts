import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: { id: string } };

// GET single category with tours
export async function GET(req: Request, { params }: Params) {
  try {
    const category = await prisma.tourCategory.findUnique({
      where: { id: params.id },
      include: {
        tours: {
          where: { isActive: true },
          include: { category: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { ok: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("GET /api/categories/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT update category
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const { name, slug, description, image, order, isActive } = body;

    const category = await prisma.tourCategory.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        image,
        order,
        isActive,
      },
    });

    return NextResponse.json({ ok: true, data: category });
  } catch (error) {
    console.error("PUT /api/categories/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE category
export async function DELETE(req: Request, { params }: Params) {
  try {
    await prisma.tourCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/categories/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
