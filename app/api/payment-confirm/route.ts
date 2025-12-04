/**
 * API Route: /api/payment-confirm
 *
 * Handles payment confirmations from Stripe webhooks and manual confirmations
 * - Validates payment amount against 30% advance requirement
 * - Updates booking status (CONFIRMED if >= 30% paid, UNCONFIRMED otherwise)
 * - Sends confirmation or reminder emails
 * - Returns JSON responses for success and errors
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import {
  sendBookingConfirmationEmail,
  sendPaymentReminderEmail,
} from "@/lib/email";

export const runtime = "nodejs";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

// Stripe webhook secret for verifying webhook signatures
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

// Base URL for payment links
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Check if payment meets the 30% advance requirement
 */
function meetsAdvanceRequirement(
  amountPaid: number,
  totalPrice: number
): boolean {
  const requiredAdvance = totalPrice * 0.3;
  return amountPaid >= requiredAdvance;
}

/**
 * Generate payment URLs for reminder emails
 */
async function generatePaymentUrls(
  requestId: string,
  remainingAmount: number,
  customerEmail: string,
  tourName: string
): Promise<{ stripeUrl?: string; paypalUrl?: string }> {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${tourName} - Additional Payment`,
              description: `Booking Reference: ${requestId}`,
            },
            unit_amount: Math.round(remainingAmount * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        requestId,
        type: "additional_payment",
      },
      success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&request_id=${requestId}`,
      cancel_url: `${BASE_URL}/payment/cancel?request_id=${requestId}`,
    });

    return { stripeUrl: session.url || undefined };
  } catch (error) {
    console.error("Failed to generate payment URL:", error);
    return {};
  }
}

/**
 * Process payment and update booking status
 */
async function processPayment(
  requestId: string,
  amountPaid: number,
  paymentMethod: string,
  providerId?: string
) {
  // Get current request info
  const requestInfo = await prisma.requestInfo.findUnique({
    where: { id: requestId },
  });

  if (!requestInfo) {
    throw new Error(`Request not found: ${requestId}`);
  }

  const totalAmountPaid = (requestInfo.amountPaid || 0) + amountPaid;
  const tourPrice = requestInfo.tourPrice || 0;
  const advanceRequired = requestInfo.advanceRequired || tourPrice * 0.3;

  // Determine if booking should be confirmed
  const isConfirmed = meetsAdvanceRequirement(totalAmountPaid, tourPrice);

  // Update request info with payment details
  const updatedRequest = await prisma.requestInfo.update({
    where: { id: requestId },
    data: {
      amountPaid: totalAmountPaid,
      paymentStatus:
        totalAmountPaid >= tourPrice
          ? "PAID"
          : totalAmountPaid > 0
          ? "PARTIAL"
          : "PENDING",
      bookingStatus: isConfirmed ? "CONFIRMED" : "UNCONFIRMED",
      paymentMethod: paymentMethod,
    },
  });

  // Send appropriate email
  if (isConfirmed) {
    // Send confirmation email
    await sendBookingConfirmationEmail({
      name: updatedRequest.fullName,
      email: updatedRequest.email,
      tourName: updatedRequest.tourName || "Tour Booking",
      tourPrice: tourPrice,
      amountPaid: totalAmountPaid,
      adults: updatedRequest.adults,
      children: updatedRequest.children,
      preferredStartDate: updatedRequest.preferredStartDate?.toISOString(),
      requestId: requestId,
      paymentMethod: paymentMethod,
    });
  } else {
    // Send reminder email with payment links
    const paymentUrls = await generatePaymentUrls(
      requestId,
      advanceRequired - totalAmountPaid,
      updatedRequest.email,
      updatedRequest.tourName || "Tour Booking"
    );

    await sendPaymentReminderEmail({
      name: updatedRequest.fullName,
      email: updatedRequest.email,
      tourName: updatedRequest.tourName || "Tour Booking",
      tourPrice: tourPrice,
      amountPaid: totalAmountPaid,
      advanceRequired: advanceRequired,
      requestId: requestId,
      stripePaymentUrl: paymentUrls.stripeUrl,
    });
  }

  return {
    success: true,
    requestId,
    totalAmountPaid,
    isConfirmed,
    bookingStatus: isConfirmed ? "CONFIRMED" : "UNCONFIRMED",
  };
}

/**
 * Handle Stripe webhook events
 */
async function handleStripeWebhook(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const requestId = session.metadata?.requestId;

      if (!requestId) {
        console.error("No requestId in session metadata");
        return NextResponse.json(
          { error: "Missing request ID" },
          { status: 400 }
        );
      }

      const amountPaid = (session.amount_total || 0) / 100; // Convert from cents

      try {
        const result = await processPayment(
          requestId,
          amountPaid,
          "stripe",
          session.id
        );

        console.log(`✓ Payment processed for ${requestId}:`, result);
        return NextResponse.json({ received: true, ...result });
      } catch (error) {
        console.error("Error processing payment:", error);
        return NextResponse.json(
          { error: "Failed to process payment" },
          { status: 500 }
        );
      }
    }

    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
      return NextResponse.json({ received: true });
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
      return NextResponse.json({ received: true });
  }
}

/**
 * POST handler - receives payment confirmations
 */
export async function POST(request: NextRequest) {
  // Check if this is a Stripe webhook
  const contentType = request.headers.get("content-type");
  const stripeSignature = request.headers.get("stripe-signature");

  if (stripeSignature) {
    return handleStripeWebhook(request);
  }

  // Handle manual payment confirmation (e.g., bank transfer)
  try {
    const body = await request.json();
    const { requestId, amountPaid, paymentMethod, providerId } = body;

    if (!requestId) {
      return NextResponse.json(
        { success: false, error: "Request ID is required" },
        { status: 400 }
      );
    }

    if (!amountPaid || amountPaid <= 0) {
      return NextResponse.json(
        { success: false, error: "Valid payment amount is required" },
        { status: 400 }
      );
    }

    const result = await processPayment(
      requestId,
      amountPaid,
      paymentMethod || "manual",
      providerId
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment confirmation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to confirm payment",
      },
      { status: 500 }
    );
  }
}

/**
 * GET handler - check payment status
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const requestId = searchParams.get("requestId");
  const sessionId = searchParams.get("session_id");

  if (!requestId && !sessionId) {
    return NextResponse.json(
      { error: "Request ID or Session ID is required" },
      { status: 400 }
    );
  }

  try {
    let whereClause: { id?: string; stripeSessionId?: string } = {};

    if (requestId) {
      whereClause.id = requestId;
    } else if (sessionId) {
      whereClause.stripeSessionId = sessionId;
    }

    const requestInfo = await prisma.requestInfo.findFirst({
      where: whereClause,
      select: {
        id: true,
        fullName: true,
        email: true,
        tourName: true,
        tourPrice: true,
        advanceRequired: true,
        amountPaid: true,
        paymentStatus: true,
        bookingStatus: true,
        paymentMethod: true,
        createdAt: true,
      },
    });

    if (!requestInfo) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const remainingAmount =
      (requestInfo.tourPrice || 0) - (requestInfo.amountPaid || 0);
    const paidPercentage = requestInfo.tourPrice
      ? Math.round(
          ((requestInfo.amountPaid || 0) / requestInfo.tourPrice) * 100
        )
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        ...requestInfo,
        remainingAmount,
        paidPercentage,
        isConfirmed: requestInfo.bookingStatus === "CONFIRMED",
      },
    });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment status" },
      { status: 500 }
    );
  }
}
