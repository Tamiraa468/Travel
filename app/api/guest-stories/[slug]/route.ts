import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET single guest story by slug
export async function GET(
  req: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const story = await prisma.guestStory.findUnique({
      where: { slug: params.slug },
    });

    if (!story || !story.isApproved || !story.isPublished) {
      return NextResponse.json(
        { ok: false, error: "Story not found" },
        { status: 404 },
      );
    }

    // Increment views
    await prisma.guestStory.update({
      where: { slug: params.slug },
      data: { views: { increment: 1 } },
    });

    return NextResponse.json(story);
  } catch (error) {
    console.error("GET /api/guest-stories/[slug] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch story" },
      { status: 500 },
    );
  }
}
