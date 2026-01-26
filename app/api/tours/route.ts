import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";
// Increase body size limit for this route
export const maxDuration = 60;

export async function GET() {
  try {
    const tours = await prisma.tour.findMany({
      include: { dates: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tours);
  } catch (error) {
    console.error("GET /api/tours error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch tours" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Auth check - only admins can create tours
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json(
        { ok: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { title, slug, description, price, duration, images = [] } = body;
    const tour = await prisma.tour.create({
      data: {
        title,
        slug,
        description,
        price: Number(price),
        duration: Number(duration),
        images,
      },
    });
    return NextResponse.json({ ok: true, data: tour }, { status: 201 });
  } catch (error) {
    console.error("POST /api/tours error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create tour" },
      { status: 500 },
    );
  }
}
