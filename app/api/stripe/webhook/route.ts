/**
 * ==========================================
 * STRIPE WEBHOOK HANDLER
 * ==========================================
 *
 * This endpoint receives events from Stripe when payments are made.
 * Stripe sends events like:
 * - checkout.session.completed (customer finished checkout)
 * - payment_intent.succeeded (payment was successful)
 * - payment_intent.payment_failed (payment failed)
 *
 * Flow:
 * 1. Customer pays via Stripe Checkout
 * 2. Stripe sends webhook event to this endpoint
 * 3. We verify the webhook signature (security)
 * 4. We update the database to mark booking as paid
 * 5. We send confirmation email to customer
 *
 * Endpoint: POST /api/stripe/webhook
 *
 * IMPORTANT: Add this URL to Stripe Dashboard → Webhooks:
 * https://travel-9jis.vercel.app/api/stripe/webhook
 */

import { NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { sendPaymentConfirmationEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

// ==========================================
// STRIPE CONFIGURATION
// ==========================================
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Webhook secret for verifying Stripe signatures
// IMPORTANT: This must match the secret from Stripe Dashboard → Webhooks
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!webhookSecret) {
  console.error("❌ STRIPE_WEBHOOK_SECRET is not set!");
}

// ==========================================
// WEBHOOK HANDLER
// ==========================================
export async function POST(request: Request) {
  console.log("🔔 Webhook endpoint hit!");
  console.log("📅 Time:", new Date().toISOString());

  // Step 1: Get the raw body and signature
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  console.log("📝 Body length:", body.length);
  console.log("🔐 Signature present:", !!signature);
  console.log("🔑 Webhook secret set:", !!webhookSecret);

  // Step 2: Validate webhook secret is configured
  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET environment variable is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  // Step 3: Validate signature exists
  if (!signature) {
    console.error("❌ No stripe-signature header");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Step 4: Verify webhook signature
  let event: Stripe.Event;
  try {
    // This ensures the webhook came from Stripe, not a hacker
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log("✅ Signature verified successfully");
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    console.error("   Signature:", signature.substring(0, 50) + "...");
    console.error(
      "   Secret starts with:",
      webhookSecret.substring(0, 10) + "...",
    );
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 },
    );
  }

  console.log("✅ Webhook received:", event.type);

  // ==========================================
  // HANDLE DIFFERENT EVENT TYPES
  // ==========================================
  switch (event.type) {
    // ----------------------------------------
    // CHECKOUT SESSION COMPLETED
    // ----------------------------------------
    // This fires when customer completes Stripe Checkout
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("💳 Checkout session completed:", session.id);

      // Get metadata we stored when creating the session
      const metadata = session.metadata || {};
      const requestId = metadata.requestId;
      const amountPaid = (session.amount_total || 0) / 100; // Convert cents to dollars

      if (!requestId) {
        console.error("❌ No requestId in metadata");
        break;
      }

      try {
        // Find the booking request in database
        const requestInfo = await prisma.requestInfo.findUnique({
          where: { id: requestId },
        });

        if (!requestInfo) {
          console.error("❌ Booking request not found:", requestId);
          break;
        }

        // Calculate new total paid
        const newTotalPaid = requestInfo.amountPaid + amountPaid;
        const tourPrice = requestInfo.tourPrice || 0;

        // Determine payment status
        let paymentStatus: "PENDING" | "PARTIAL" | "PAID" = "PARTIAL";
        if (newTotalPaid >= tourPrice) {
          paymentStatus = "PAID";
        }

        // Update database with payment info
        await prisma.requestInfo.update({
          where: { id: requestId },
          data: {
            amountPaid: newTotalPaid,
            paymentStatus,
            bookingStatus: "CONFIRMED", // Booking is now confirmed!
            stripeSessionId: session.id,
          },
        });

        console.log("✅ Database updated for booking:", requestId);
        console.log(`   Amount paid: $${amountPaid}`);
        console.log(`   Total paid: $${newTotalPaid}`);
        console.log(`   Status: ${paymentStatus}`);

        // Send confirmation email to customer
        try {
          await sendPaymentConfirmationEmail({
            to: requestInfo.email,
            customerName: requestInfo.fullName,
            tourName: requestInfo.tourName || "Mongolia Tour",
            amountPaid: newTotalPaid,
            totalPrice: tourPrice,
            requestId,
            preferredStartDate:
              requestInfo.preferredStartDate?.toISOString() || null,
          });
          console.log("✅ Confirmation email sent to:", requestInfo.email);
        } catch (emailError) {
          console.error("⚠️ Failed to send confirmation email:", emailError);
          // Don't fail webhook if email fails
        }
      } catch (dbError) {
        console.error("❌ Database update error:", dbError);
      }
      break;
    }

    // ----------------------------------------
    // PAYMENT INTENT SUCCEEDED
    // ----------------------------------------
    // This fires when payment is successful (can be used for additional tracking)
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("✅ Payment intent succeeded:", paymentIntent.id);
      console.log(`   Amount: $${paymentIntent.amount / 100}`);
      console.log(`   Customer: ${paymentIntent.receipt_email || "N/A"}`);
      break;
    }

    // ----------------------------------------
    // PAYMENT INTENT FAILED
    // ----------------------------------------
    // This fires when payment fails
    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("❌ Payment failed:", paymentIntent.id);
      console.log(
        `   Error: ${paymentIntent.last_payment_error?.message || "Unknown"}`,
      );

      // Optionally update database to track failed payment
      // await prisma.requestInfo.update({ ... status: "PAYMENT_FAILED" })
      break;
    }

    // ----------------------------------------
    // CHECKOUT SESSION EXPIRED
    // ----------------------------------------
    // This fires when checkout link expires without payment
    case "checkout.session.expired": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("⏰ Checkout session expired:", session.id);
      // Customer didn't complete payment in time
      // You could send a reminder email here
      break;
    }

    // ----------------------------------------
    // UNHANDLED EVENTS
    // ----------------------------------------
    default:
      console.log(`ℹ️ Unhandled event type: ${event.type}`);
  }

  // Always return 200 to acknowledge receipt
  // If you return an error, Stripe will retry the webhook
  return NextResponse.json({ received: true });
}

// ==========================================
// GET HANDLER - For testing if endpoint is reachable
// ==========================================
export async function GET() {
  return NextResponse.json({
    status: "ok",
    message: "Stripe webhook endpoint is active",
    timestamp: new Date().toISOString(),
    webhookSecretConfigured: !!process.env.STRIPE_WEBHOOK_SECRET,
  });
}
