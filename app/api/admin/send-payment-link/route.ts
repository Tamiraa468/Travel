/**
 * API Route: /api/admin/send-payment-link
 *
 * ============================================
 * ADMIN-ONLY PAYMENT LINK GENERATION
 * ============================================
 *
 * This endpoint is used by sales agents to:
 * 1. Generate a Stripe payment link for a specific inquiry
 * 2. Send the payment link to the customer via email
 * 3. Update the inquiry status to "WON" (pending payment)
 *
 * IMPORTANT: Stripe Checkout is NEVER triggered from the frontend.
 * Only admin can initiate payment collection after:
 * - Personalizing the tour itinerary
 * - Negotiating the price via email/WhatsApp
 * - Confirming the customer is ready to pay
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendPaymentLinkSchema } from "@/lib/validation";
import { sendInquiryPaymentLinkEmail } from "@/lib/email";
import Stripe from "stripe";

export const runtime = "nodejs";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

const BASE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://travel-9jis.vercel.app"
).replace(/\/+$/, "");

export async function POST(request: NextRequest) {
  try {
    // Auth check - ADMIN ONLY
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = sendPaymentLinkSchema.parse(body);

    // Fetch the inquiry
    const inquiry = await prisma.inquiry.findUnique({
      where: { id: validatedData.inquiryId },
    });

    if (!inquiry) {
      return NextResponse.json(
        { success: false, error: "Inquiry not found" },
        { status: 404 }
      );
    }

    let paymentUrl: string | null = null;
    let paymentRef: string | null = null;

    if (validatedData.paymentMethod === "stripe") {
      // Create Stripe Checkout Session
      if (!process.env.STRIPE_SECRET_KEY) {
        return NextResponse.json(
          { success: false, error: "Stripe is not configured" },
          { status: 500 }
        );
      }

      const stripeSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: inquiry.email,
        line_items: [
          {
            price_data: {
              currency: validatedData.currency.toLowerCase(),
              product_data: {
                name: inquiry.tourName
                  ? `${inquiry.tourName} - Custom Tour Payment`
                  : "Mongolia Tour - Custom Payment",
                description: `Booking for ${
                  inquiry.fullName
                } | Ref: ${inquiry.id.slice(-8).toUpperCase()}`,
              },
              unit_amount: Math.round(validatedData.amount * 100), // Stripe uses cents
            },
            quantity: 1,
          },
        ],
        metadata: {
          inquiryId: inquiry.id,
          type: "inquiry_payment",
          generatedBy: session.email,
        },
        success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&inquiry_id=${inquiry.id}`,
        cancel_url: `${BASE_URL}/payment/cancel?inquiry_id=${inquiry.id}`,
      });

      paymentUrl = stripeSession.url;
      paymentRef = stripeSession.id;

      // Update inquiry with Stripe session info
      await prisma.inquiry.update({
        where: { id: inquiry.id },
        data: {
          stripeSessionId: stripeSession.id,
          stripePaymentUrl: stripeSession.url,
          quotedPrice: validatedData.amount,
          quoteCurrency: validatedData.currency,
          leadStatus: "WON", // Move to WON status
          paymentMethod: "stripe",
          lastContactAt: new Date(),
        },
      });
    } else if (validatedData.paymentMethod === "bank_transfer") {
      // Generate bank transfer reference
      paymentRef = `UTM-${Date.now().toString(36).toUpperCase()}-${inquiry.id
        .slice(-4)
        .toUpperCase()}`;

      // Update inquiry with bank transfer info
      await prisma.inquiry.update({
        where: { id: inquiry.id },
        data: {
          bankTransferRef: paymentRef,
          quotedPrice: validatedData.amount,
          quoteCurrency: validatedData.currency,
          leadStatus: "WON",
          paymentMethod: "bank_transfer",
          lastContactAt: new Date(),
        },
      });
    }

    // Send payment link email to customer
    try {
      await sendInquiryPaymentLinkEmail({
        name: inquiry.fullName,
        email: inquiry.email,
        tourName: inquiry.tourName || "Mongolia Custom Tour",
        amount: validatedData.amount,
        currency: validatedData.currency,
        paymentMethod: validatedData.paymentMethod,
        stripePaymentUrl: paymentUrl || undefined,
        bankTransferRef:
          validatedData.paymentMethod === "bank_transfer"
            ? paymentRef || undefined
            : undefined,
        inquiryId: inquiry.id,
      });
      console.log(`💳 Payment link sent to ${inquiry.email}`);
    } catch (emailError) {
      console.error("Failed to send payment link email:", emailError);
      // Don't fail - payment link was created successfully
    }

    return NextResponse.json({
      success: true,
      message: `Payment link sent to ${inquiry.email}`,
      data: {
        inquiryId: inquiry.id,
        paymentMethod: validatedData.paymentMethod,
        amount: validatedData.amount,
        currency: validatedData.currency,
        paymentUrl: paymentUrl,
        paymentRef: paymentRef,
      },
    });
  } catch (error) {
    console.error("Send payment link error:", error);

    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { success: false, error: "Invalid request data" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate payment link" },
      { status: 500 }
    );
  }
}
