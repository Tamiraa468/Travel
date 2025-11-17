import { NextResponse } from "next/server";

// Lightweight placeholder for sending emails (server route).
// Replace with real provider integration (SendGrid, SES, Postmark, etc.)

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, subject, html } = body;

    // TODO: integrate with real email provider
    console.log("Sending email to:", to, subject);

    return NextResponse.json({
      ok: true,
      message: "Email queued (placeholder)",
    });
  } catch (error) {
    console.error("POST /api/email error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to send email" },
      { status: 500 }
    );
  }
}
