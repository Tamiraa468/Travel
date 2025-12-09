import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: { id: string } };

// PUT update testimonial (admin - approve/feature)
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const {
      name,
      country,
      rating,
      text,
      tourName,
      travelDate,
      isApproved,
      isFeatured,
    } = body;

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: {
        name,
        country,
        rating,
        text,
        tourName,
        travelDate,
        isApproved,
        isFeatured,
      },
    });

    return NextResponse.json({ ok: true, data: testimonial });
  } catch (error) {
    console.error("PUT /api/testimonials/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE testimonial
export async function DELETE(req: Request, { params }: Params) {
  try {
    await prisma.testimonial.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/testimonials/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
