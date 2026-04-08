import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET approved guest stories
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");
    const page = searchParams.get("page") || "1";

    const take = limit ? Math.min(Math.max(parseInt(limit), 1), 50) : 10;
    const currentPage = Math.max(parseInt(page), 1);
    const skip = (currentPage - 1) * take;

    const where = { isApproved: true, isPublished: true };

    const [stories, total] = await Promise.all([
      prisma.guestStory.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take,
        skip,
      }),
      prisma.guestStory.count({ where }),
    ]);

    return NextResponse.json({
      stories,
      pagination: {
        total,
        page: currentPage,
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error("GET /api/guest-stories error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch guest stories" },
      { status: 500 },
    );
  }
}

// POST submit a new guest story (public)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, country, title, content, rating, tourName, travelDate } = body;

    if (!name || !title || !content) {
      return NextResponse.json(
        { ok: false, error: "Name, title and content are required" },
        { status: 400 },
      );
    }

    if (title.length > 200) {
      return NextResponse.json(
        { ok: false, error: "Title must be under 200 characters" },
        { status: 400 },
      );
    }

    if (content.length > 10000) {
      return NextResponse.json(
        { ok: false, error: "Content must be under 10,000 characters" },
        { status: 400 },
      );
    }

    // Generate slug from title
    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .slice(0, 80) +
      "-" +
      Date.now().toString(36);

    const story = await prisma.guestStory.create({
      data: {
        name: name.slice(0, 100),
        email: email?.slice(0, 200) || null,
        country: country?.slice(0, 100) || null,
        title: title.slice(0, 200),
        slug,
        content: content.slice(0, 10000),
        rating: Math.min(5, Math.max(1, rating || 5)),
        tourName: tourName?.slice(0, 200) || null,
        travelDate: travelDate?.slice(0, 50) || null,
        isApproved: false,
        isPublished: false,
      },
    });

    return NextResponse.json(
      { ok: true, message: "Your story has been submitted and is pending review!" },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/guest-stories error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to submit story" },
      { status: 500 },
    );
  }
}
