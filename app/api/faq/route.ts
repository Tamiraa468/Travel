import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET all FAQs
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const where: any = { isActive: true };
    if (category) {
      where.category = category;
    }

    const faqs = await prisma.fAQ.findMany({
      where,
      orderBy: [{ category: "asc" }, { order: "asc" }],
    });

    // Group by category
    const grouped = faqs.reduce((acc: any, faq) => {
      if (!acc[faq.category]) {
        acc[faq.category] = [];
      }
      acc[faq.category].push(faq);
      return acc;
    }, {});

    return NextResponse.json({ faqs, grouped });
  } catch (error) {
    console.error("GET /api/faq error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST create FAQ (admin)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { question, answer, category, order } = body;

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category: category || "GENERAL",
        order: order || 0,
      },
    });

    return NextResponse.json({ ok: true, data: faq }, { status: 201 });
  } catch (error) {
    console.error("POST /api/faq error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}
