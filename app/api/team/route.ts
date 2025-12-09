import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all team members
export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("GET /api/team error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch team members" },
      { status: 500 }
    );
  }
}

// POST create team member (admin)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, role, bio, image, email, phone, order } = body;

    const member = await prisma.teamMember.create({
      data: {
        name,
        role,
        bio,
        image,
        email,
        phone,
        order: order || 0,
      },
    });

    return NextResponse.json({ ok: true, data: member }, { status: 201 });
  } catch (error) {
    console.error("POST /api/team error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
