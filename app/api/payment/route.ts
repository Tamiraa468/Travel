import { NextResponse } from "next/server";
import Stripe from "stripe";

// Read the Stripe secret key from environment variables.
// Make sure STRIPE_SECRET_KEY is set in your deployment environment (Vercel env vars).
const stripeSecret = process.env.STRIPE_SECRET_KEY;

if (!stripeSecret) {
  // We throw at module init so build fails early if the secret is missing.
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-10-29",
});

// This route handles POST /api/payment
// Expects a JSON body: { amount: number, currency?: string, receipt_email?: string }
// `amount` must be an integer in the smallest currency unit (e.g., cents for USD).
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency = "usd", receipt_email, tourId } = body || {};

    // Basic validation
    if (
      !amount ||
      typeof amount !== "number" ||
      !Number.isInteger(amount) ||
      amount <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid amount. Use an integer in the smallest currency unit (e.g., cents).",
        },
        { status: 400 }
      );
    }

    // If a tourId is provided, verify the amount matches the canonical tour price.
    if (tourId) {
      try {
        // Import shared tour list (synchronous import is fine on the server)
        const { TOURS } = await import("@/data/tours");
        const tour = TOURS.find((t: any) => t.id === tourId);
        if (!tour) {
          return NextResponse.json(
            { error: "Invalid tourId" },
            { status: 400 }
          );
        }
        const expected = Math.round(Number(tour.price) * 100);
        if (expected !== amount) {
          return NextResponse.json(
            {
              error: `Amount mismatch for tour ${tourId}. Expected ${expected}`,
            },
            { status: 400 }
          );
        }
      } catch (e) {
        console.error("Could not verify tour price", e);
      }
    }

    // Create a PaymentIntent with automatic payment methods enabled.
    // We return the client_secret to the frontend which will confirm the payment securely
    // using Stripe.js and Elements (card details never touch your server).
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // automatic_payment_methods lets Stripe decide between card networks (Visa, Mastercard, etc.)
      automatic_payment_methods: { enabled: true },
      receipt_email,
    });

    // Return useful info to the frontend. The frontend will use clientSecret to
    // confirm the payment with Stripe.js. We also return the PaymentIntent id
    // and status for logging/verification on the client if needed.
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    });
  } catch (err: any) {
    console.error("Error creating payment intent", err);
    return NextResponse.json(
      { error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}
