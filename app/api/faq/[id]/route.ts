import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

type Params = { params: { id: string } };

// PUT update FAQ
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();
    const { question, answer, category, order, isActive } = body;

    const faq = await prisma.fAQ.update({
      where: { id: params.id },
      data: {
        question,
        answer,
        category,
        order,
        isActive,
      },
    });

    return NextResponse.json({ ok: true, data: faq });
  } catch (error) {
    console.error("PUT /api/faq/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// DELETE FAQ
export async function DELETE(req: Request, { params }: Params) {
  try {
    await prisma.fAQ.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/faq/[id] error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
