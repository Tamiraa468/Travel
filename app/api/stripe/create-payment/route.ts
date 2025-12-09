/**
 * ==========================================
 * STRIPE PAYMENT LINK CREATION API
 * ==========================================
 *
 * This API creates a Stripe Checkout Session and returns a payment link.
 * The link is sent to the customer's email automatically.
 *
 * Flow:
 * 1. Customer submits tour request form
 * 2. This API creates a Stripe Checkout Session
 * 3. Payment link is emailed to customer
 * 4. Customer clicks link → pays via Stripe
 * 5. Webhook confirms payment → database updated
 *
 * Endpoint: POST /api/stripe/create-payment
 */

import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendPaymentLinkEmail } from "@/lib/email";
import {
  sanitizeString,
  sanitizeEmail,
  sanitizePhone,
  checkRateLimit,
  getClientIp,
} from "@/lib/security";

// ==========================================
// STRIPE CONFIGURATION
// ==========================================
// Initialize Stripe with your secret key (server-side only!)
if (!process.env.STRIPE_SECRET_KEY) {
  console.error("❌ STRIPE_SECRET_KEY is not set!");
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Base URL for redirects (changes between dev and production)
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// ==========================================
// API HANDLER
// ==========================================
export async function POST(request: Request) {
  try {
    // Security: Rate limiting
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`stripe-payment:${clientIp}`, 5, 60000); // 5 requests per minute

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: "Too many payment requests. Please try again later." },
        { status: 429 }
      );
    }

    // Step 1: Parse the request body
    const body = await request.json();

    const {
      fullName, // Customer's full name
      email, // Customer's email (payment link sent here)
      phone, // Customer's phone (optional)
      tourName, // Name of the tour
      tourId, // Tour ID (optional)
      totalPrice, // Total tour price in USD
      adults = 1, // Number of adults
      children = 0, // Number of children
      preferredStartDate, // When they want to start
      message, // Additional notes
      payAdvanceOnly = true, // Pay 30% advance or full amount
    } = body;

    // ==========================================
    // SECURITY: SANITIZE INPUTS
    // ==========================================
    const sanitizedFullName = sanitizeString(fullName || "");
    const sanitizedEmail = sanitizeEmail(email || "");
    const sanitizedPhone = sanitizePhone(phone || "");
    const sanitizedTourName = sanitizeString(tourName || "");
    const sanitizedMessage = sanitizeString(message || "");

    // ==========================================
    // VALIDATION
    // ==========================================
    if (!sanitizedFullName || !sanitizedEmail || !totalPrice) {
      return NextResponse.json(
        { error: "Missing required fields: fullName, email, totalPrice" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Validate totalPrice is a positive number
    const sanitizedTotalPrice = Math.abs(Number(totalPrice) || 0);
    if (sanitizedTotalPrice <= 0 || sanitizedTotalPrice > 100000) {
      return NextResponse.json(
        { error: "Invalid price. Must be between $1 and $100,000" },
        { status: 400 }
      );
    }

    // ==========================================
    // CALCULATE PAYMENT AMOUNT
    // ==========================================
    // Option 1: Pay 30% advance (default for tours)
    // Option 2: Pay full amount
    const advancePercentage = 0.3; // 30% advance
    const amountToPay = payAdvanceOnly
      ? Math.round(sanitizedTotalPrice * advancePercentage)
      : sanitizedTotalPrice;

    // Stripe requires amount in cents (smallest currency unit)
    const amountInCents = Math.round(amountToPay * 100);

    // ==========================================
    // SAVE TO DATABASE (RequestInfo)
    // ==========================================
    // Create a booking request in the database BEFORE creating payment
    const requestInfo = await prisma.requestInfo.create({
      data: {
        fullName: sanitizedFullName,
        email: sanitizedEmail,
        phone: sanitizedPhone || null,
        tourId: tourId || null,
        tourName: sanitizedTourName || "Custom Tour",
        tourPrice: sanitizedTotalPrice,
        advanceRequired: Math.round(sanitizedTotalPrice * advancePercentage),
        amountPaid: 0, // Will be updated after payment
        paymentStatus: "PENDING",
        bookingStatus: "UNCONFIRMED",
        paymentMethod: "stripe",
        adults: Math.min(Math.max(1, Number(adults) || 1), 50), // Sanitize: 1-50 adults
        children: Math.min(Math.max(0, Number(children) || 0), 50), // Sanitize: 0-50 children
        preferredStartDate: preferredStartDate
          ? new Date(preferredStartDate)
          : null,
        message: sanitizedMessage || null,
      },
    });

    console.log("✅ Created booking request:", requestInfo.id);

    // ==========================================
    // CREATE STRIPE CHECKOUT SESSION
    // ==========================================
    // This creates a secure payment page hosted by Stripe
    const session = await stripe.checkout.sessions.create({
      // Payment methods: Card (Visa, Mastercard), Apple Pay, Google Pay
      payment_method_types: ["card"],

      // Enable additional payment methods automatically
      // payment_method_options: {
      //   card: {
      //     request_three_d_secure: "automatic",
      //   },
      // },

      // Line items (what customer is paying for)
      line_items: [
        {
          price_data: {
            currency: "usd", // US Dollars
            product_data: {
              name: sanitizedTourName || "Mongolia Tour Booking",
              description: payAdvanceOnly
                ? `30% Advance Payment (${adults} adults${
                    children > 0 ? `, ${children} children` : ""
                  })`
                : `Full Payment (${adults} adults${
                    children > 0 ? `, ${children} children` : ""
                  })`,
              images: [
                "https://travel-9jis.vercel.app/images/mongolia-tour.jpg",
              ], // Optional tour image
            },
            unit_amount: amountInCents, // Amount in cents
          },
          quantity: 1,
        },
      ],

      // Payment mode: "payment" for one-time, "subscription" for recurring
      mode: "payment",

      // Where to redirect after successful payment
      success_url: `${baseUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}&request_id=${requestInfo.id}`,

      // Where to redirect if customer cancels
      cancel_url: `${baseUrl}/payment/cancel?request_id=${requestInfo.id}`,

      // Pre-fill customer email
      customer_email: email,

      // Metadata for webhook to identify the booking
      metadata: {
        requestId: requestInfo.id,
        tourName: tourName || "Custom Tour",
        fullName,
        email,
        totalPrice: totalPrice.toString(),
        amountToPay: amountToPay.toString(),
        paymentType: payAdvanceOnly ? "advance" : "full",
      },

      // Collect billing address
      billing_address_collection: "required",

      // Expire session after 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    console.log("✅ Created Stripe session:", session.id);

    // ==========================================
    // UPDATE DATABASE WITH STRIPE SESSION ID
    // ==========================================
    await prisma.requestInfo.update({
      where: { id: requestInfo.id },
      data: { stripeSessionId: session.id },
    });

    // ==========================================
    // SEND PAYMENT LINK EMAIL TO CUSTOMER
    // ==========================================
    try {
      await sendPaymentLinkEmail({
        to: email,
        customerName: fullName,
        tourName: tourName || "Mongolia Tour",
        totalPrice,
        amountToPay,
        paymentLink: session.url!,
        requestId: requestInfo.id,
        preferredStartDate: preferredStartDate || null,
      });
      console.log("✅ Payment link email sent to:", email);
    } catch (emailError) {
      console.error("⚠️ Failed to send email:", emailError);
      // Don't fail the request if email fails - customer can still use the link
    }

    // ==========================================
    // RETURN SUCCESS RESPONSE
    // ==========================================
    return NextResponse.json({
      success: true,
      message: "Payment link created and sent to email",
      data: {
        sessionId: session.id,
        paymentUrl: session.url, // Direct link to Stripe checkout
        requestId: requestInfo.id,
        amountToPay,
        currency: "USD",
      },
    });
  } catch (error: any) {
    console.error("❌ Error creating payment:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    console.error("Error type:", error.type);

    // Handle Stripe-specific errors
    if (error.type === "StripeCardError") {
      return NextResponse.json({ error: "Card was declined" }, { status: 400 });
    }

    // Handle Stripe API errors
    if (error.type === "StripeInvalidRequestError") {
      return NextResponse.json(
        { error: "Invalid payment request: " + error.message },
        { status: 400 }
      );
    }

    // Handle Prisma errors
    if (error.code?.startsWith("P")) {
      console.error("Prisma error code:", error.code);
      return NextResponse.json(
        { error: "Database error. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create payment" },
      { status: 500 }
    );
  }
}
