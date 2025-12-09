import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET approved testimonials
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    const where: any = { isApproved: true };
    if (featured === "true") {
      where.isFeatured = true;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("GET /api/testimonials error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST submit new testimonial (public)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, country, rating, text, tourName, travelDate } = body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        country,
        rating: Math.min(5, Math.max(1, rating || 5)),
        text,
        tourName,
        travelDate,
        isApproved: false, // Requires admin approval
      },
    });

    return NextResponse.json({ ok: true, data: testimonial }, { status: 201 });
  } catch (error) {
    console.error("POST /api/testimonials error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to submit testimonial" },
      { status: 500 }
    );
  }
}
