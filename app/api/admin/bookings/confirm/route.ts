import { NextResponse } from "next/server";
import { confirmBooking } from "@/lib/actions";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
    await confirmBooking(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("confirm route error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
