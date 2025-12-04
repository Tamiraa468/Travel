/**
 * API Route: /api/request-info
 *
 * Handles tour information requests and booking workflow
 * - Validates request body using Zod
 * - Rejects bots using honeypot field
 * - Inserts data into Prisma database
 * - Calculates tour price and 30% advance payment
 * - Sends payment information email with Stripe/PayPal links
 * - Returns success response with request ID and payment URLs
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requestInfoSchema } from "@/lib/validation";
import {
  sendPaymentInfoEmail,
  sendInternalNotificationEmail,
} from "@/lib/email";
import Stripe from "stripe";

export const runtime = "nodejs";

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-10-29.clover",
});

// Base URL for payment redirects
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

/**
 * Calculate total tour price based on adults, children, and base price
 */
function calculateTourPrice(
  basePrice: number,
  adults: number,
  children: number
): number {
  const adultPrice = basePrice;
  const childPrice = basePrice * 0.7; // 30% discount for children
  return adults * adultPrice + children * childPrice;
}

/**
 * Create Stripe Checkout Session for advance payment
 */
async function createStripeCheckoutSession(
  requestId: string,
  tourName: string,
  advanceAmount: number,
  customerEmail: string
): Promise<string | null> {
  // Skip if no Stripe key or amount is 0
  if (!process.env.STRIPE_SECRET_KEY || advanceAmount <= 0) {
    console.log("Skipping Stripe session: no key or zero amount");
    return null;
  }

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
              name: `${tourName} - 30% Advance Payment`,
              description: `Booking Reference: ${requestId}`,
            },
            unit_amount: Math.round(advanceAmount * 100), // Stripe uses cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        requestId,
        type: "advance_payment",
      },
      success_url: `${BASE_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&request_id=${requestId}`,
      cancel_url: `${BASE_URL}/payment/cancel?request_id=${requestId}`,
    });

    // Update the request with Stripe session ID
    await prisma.requestInfo.update({
      where: { id: requestId },
      data: { stripeSessionId: session.id },
    });

    return session.url;
  } catch (error) {
    console.error("Failed to create Stripe checkout session:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Honeypot validation - if honeypot field is filled, reject (likely a bot)
    if (body.hp && body.hp.trim() !== "") {
      console.warn("Honeypot field detected - likely bot submission");
      // Return success to confuse bots, but don't actually process
      return NextResponse.json(
        { success: true, id: "BLOCKED" },
        { status: 200 }
      );
    }

    // Validate request body with Zod schema
    const validatedData = requestInfoSchema.parse(body);

    // Get tour price from database if tourId is provided, otherwise use provided price
    let tourPrice = body.tourPrice || 0;
    let tourName = validatedData.tourName || "Tour Booking";

    if (validatedData.tourId) {
      const tour = await prisma.tour.findUnique({
        where: { id: validatedData.tourId },
        select: { priceFrom: true, title: true },
      });
      if (tour) {
        tourPrice = tour.priceFrom;
        tourName = tour.title;
      }
    }

    // Calculate total price and advance payment
    const totalPrice = calculateTourPrice(
      tourPrice,
      validatedData.adults,
      validatedData.children
    );
    const advanceRequired = totalPrice * 0.3; // 30% advance

    // Convert empty strings to null/undefined for optional fields
    const cleanedData = {
      fullName: validatedData.fullName,
      email: validatedData.email,
      phone: validatedData.phone || null,
      preferredStartDate: validatedData.preferredStartDate
        ? new Date(validatedData.preferredStartDate)
        : null,
      adults: validatedData.adults,
      children: validatedData.children,
      message: validatedData.message || null,
      tourId: validatedData.tourId || null,
      tourName: tourName,
      tourPrice: totalPrice,
      advanceRequired: advanceRequired,
      amountPaid: 0,
      paymentStatus: "PENDING" as const,
      bookingStatus: "UNCONFIRMED" as const,
      marketingConsent: validatedData.marketingConsent,
    };

    // Insert request into database
    const requestInfo = await prisma.requestInfo.create({
      data: cleanedData,
    });

    // Create Stripe checkout session
    const stripePaymentUrl = await createStripeCheckoutSession(
      requestInfo.id,
      tourName,
      advanceRequired,
      validatedData.email
    );

    // Generate PayPal payment URL (basic redirect - would need PayPal SDK for full integration)
    const paypalPaymentUrl = `https://www.paypal.com/checkoutnow?token=${requestInfo.id}`;

    // Send payment information email to user
    try {
      await sendPaymentInfoEmail({
        name: validatedData.fullName,
        email: validatedData.email,
        tourName: tourName,
        tourPrice: totalPrice,
        advanceAmount: advanceRequired,
        adults: validatedData.adults,
        children: validatedData.children,
        preferredStartDate: validatedData.preferredStartDate,
        requestId: requestInfo.id,
        stripePaymentUrl: stripePaymentUrl || undefined,
        paypalPaymentUrl: undefined, // Enable when PayPal is configured
      });
    } catch (emailError) {
      console.error("Failed to send payment info email:", emailError);
      // Don't fail the request if email fails, but log it
    }

    // Send internal notification email
    try {
      await sendInternalNotificationEmail({
        name: validatedData.fullName,
        email: validatedData.email,
        phone: validatedData.phone,
        tourName: tourName,
        adults: validatedData.adults,
        children: validatedData.children,
        message: validatedData.message,
        preferredStartDate: validatedData.preferredStartDate,
        marketingConsent: validatedData.marketingConsent,
      });
    } catch (emailError) {
      console.error("Failed to send internal notification:", emailError);
    }

    // Return success response with request ID and payment info
    return NextResponse.json(
      {
        success: true,
        id: requestInfo.id,
        message:
          "Your request has been received. Please check your email for payment instructions.",
        payment: {
          totalPrice: totalPrice,
          advanceRequired: advanceRequired,
          stripePaymentUrl: stripePaymentUrl,
          // paypalPaymentUrl: paypalPaymentUrl, // Enable when configured
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Request info submission error:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Validation errors
    if (error instanceof Error && error.message.includes("validation")) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
        },
        { status: 400 }
      );
    }

    // Database errors
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This email has already submitted a request. Please wait for our response.",
        },
        { status: 409 }
      );
    }

    // Generic server error
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "An error occurred processing your request. Please try again.",
      },
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
