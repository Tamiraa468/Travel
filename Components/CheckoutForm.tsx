"use client";

import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

type Props = {
  // amount to charge in the smallest currency unit (e.g. cents)
  amount: number;
  // optional email for the receipt
  receiptEmail?: string;
  // called when payment succeeds with the paymentIntent id
  onSuccess?: (paymentIntentId?: string) => void;
};

// A small style object for the CardElement
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "Arial, sans-serif",
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": { color: "#a0aec0" },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

export default function CheckoutForm({
  amount,
  receiptEmail,
  onSuccess,
}: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // On form submit we request a PaymentIntent from our server, then confirm it
  // client-side with the CardElement. Card details never touch our server.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!stripe || !elements) {
      setMessage("Stripe has not loaded yet.");
      return;
    }

    setLoading(true);

    try {
      // amount is provided by the parent component (in cents). The server
      // validates it again to avoid client-side manipulation.
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency: "usd",
          receipt_email: receiptEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data?.error || "Failed to create payment intent");
        setLoading(false);
        return;
      }

      const clientSecret = data.clientSecret;

      // Confirm the PaymentIntent using the CardElement
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setMessage("Card Element not found");
        setLoading(false);
        return;
      }

      const confirmResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (confirmResult.error) {
        // Show error to your customer (e.g., insufficient funds)
        setMessage(confirmResult.error.message || "Payment failed");
      } else {
        // The payment has been processed!
        if (
          confirmResult.paymentIntent &&
          confirmResult.paymentIntent.status === "succeeded"
        ) {
          setMessage("Payment succeeded! Thank you.");
          if (onSuccess) onSuccess(confirmResult.paymentIntent.id);
        } else {
          setMessage(`Payment status: ${confirmResult.paymentIntent?.status}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 bg-white rounded shadow"
    >
      <label className="block mb-2 font-medium">Card details</label>
      <div className="border p-3 rounded mb-4">
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing…" : `Pay $${(amount / 100).toFixed(2)}`}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </form>
  );
}
