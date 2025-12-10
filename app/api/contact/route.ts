import * as nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { sanitizeString, sanitizeEmail } from "@/lib/security";

// Rate limiting: simple in-memory store
const contactRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 3; // Max 3 contact submissions per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  let requests = contactRequests.get(ip) || [];
  requests = requests.filter((t) => t > now - RATE_LIMIT_WINDOW);
  if (requests.length >= RATE_LIMIT_MAX) return true;
  requests.push(now);
  contactRequests.set(ip, requests);
  return false;
}

export async function POST(req: Request) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a minute." },
        { status: 429 }
      );
    }

    const body = await req.json();

    // Sanitize all inputs to prevent XSS and email injection
    const name = sanitizeString(body.name || "").slice(0, 100);
    const email = sanitizeEmail(body.email || "");
    const message = sanitizeString(body.message || "").slice(0, 2000);

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    const smtpUser = process.env.SMTP_USER || "udelgombotamira@gmail.com";
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: process.env.EMAIL_PASSWORD,
      },
      secure: true,
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Use reply-to instead of from to prevent email spoofing
    const mailOptions = {
      from: smtpUser,
      replyTo: email,
      to: smtpUser,
      subject: `Contact Form: ${name.slice(0, 50)}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to send email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
