/**
 * API Route: /api/inquiry
 *
 * ============================================
 * INQUIRY-FIRST SALES MODEL
 * ============================================
 *
 * PHILOSOPHY:
 * This platform sells CONVERSATIONS, not instant bookings.
 * Human trust and customization are the core value proposition.
 *
 * WHAT THIS ENDPOINT DOES:
 * - Saves inquiry as a LEAD only (no booking/payment records)
 * - Status starts at "NEW" in the pipeline
 * - Sends auto-reply email to customer (no payment links!)
 * - Sends internal notification to sales team
 * - Returns success message (no checkout redirect)
 *
 * WHAT THIS ENDPOINT DOES NOT DO:
 * - Create Booking records
 * - Create Payment records
 * - Trigger Stripe checkout
 * - Calculate prices or deposits
 *
 * Human agents close deals via email/WhatsApp after personalized quotation.
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { inquirySchema } from "@/lib/validation";
import {
  sendInquiryAutoReplyEmail,
  sendInquiryNotificationToAdmin,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Honeypot validation - reject bot submissions silently
    if (body.hp && body.hp.trim() !== "") {
      console.warn("🤖 Honeypot triggered - likely bot submission");
      // Return fake success to confuse bots
      return NextResponse.json(
        { success: true, message: "Thank you for your inquiry!" },
        { status: 200 }
      );
    }

    // Validate request body
    const validatedData = inquirySchema.parse(body);

    // Get tour name if tourId provided
    let tourName = validatedData.tourName || null;
    if (validatedData.tourId && !tourName) {
      const tour = await prisma.tour.findUnique({
        where: { id: validatedData.tourId },
        select: { title: true },
      });
      if (tour) {
        tourName = tour.title;
      }
    }

    // Create inquiry record (LEAD ONLY - no booking/payment)
    const inquiry = await prisma.inquiry.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email.toLowerCase(),
        phone: validatedData.phone || null,
        country: validatedData.country || null,
        travelMonth: validatedData.travelMonth || null,
        groupSize: validatedData.groupSize || null,
        budgetRange: validatedData.budgetRange || null,
        message: validatedData.message || null,
        tourId: validatedData.tourId || null,
        tourName: tourName,
        leadStatus: "NEW",
        marketingConsent: validatedData.marketingConsent,
        source: validatedData.source || "website",
      },
    });

    console.log(`✅ New inquiry created: ${inquiry.id} from ${inquiry.email}`);

    // Send auto-reply email to customer
    // NOTE: This email has NO payment links - just a warm "thank you"
    try {
      await sendInquiryAutoReplyEmail({
        name: validatedData.fullName,
        email: validatedData.email,
        tourName: tourName || undefined,
        inquiryId: inquiry.id,
      });
      console.log(`📧 Auto-reply sent to ${validatedData.email}`);
    } catch (emailError) {
      console.error("Failed to send auto-reply email:", emailError);
      // Don't fail the request if email fails
    }

    // Send internal notification to sales team
    try {
      await sendInquiryNotificationToAdmin({
        inquiryId: inquiry.id,
        name: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        country: validatedData.country,
        travelMonth: validatedData.travelMonth,
        groupSize: validatedData.groupSize,
        budgetRange: validatedData.budgetRange,
        message: validatedData.message,
        tourName: tourName || undefined,
      });
      console.log(`📧 Admin notification sent for inquiry ${inquiry.id}`);
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
    }

    // Return success - NO payment URLs, NO checkout redirect
    return NextResponse.json(
      {
        success: true,
        id: inquiry.id,
        message:
          "Thank you! A local travel expert will contact you within 24 hours.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Inquiry submission error:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        {
          success: false,
          error: "Please check your information and try again.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// GET: Fetch inquiries (admin only - will add auth check)
export async function GET(request: NextRequest) {
  // This should be admin-only - implement proper auth check
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  try {
    const inquiries = await prisma.inquiry.findMany({
      where: status ? { leadStatus: status as any } : undefined,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}
