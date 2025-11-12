"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

type Props = {
  publishableKey: string;
};

type CheckoutProps = {
  publishableKey: string;
  amount: number; // in cents
  receiptEmail?: string;
  onSuccess?: (paymentIntentId?: string) => void;
};

export default function StripeCheckout({
  publishableKey,
  amount,
  receiptEmail,
  onSuccess,
}: CheckoutProps) {
  // loadStripe returns a Promise<Stripe | null>. It's safe to call at module-level
  // but here we do it inside the component to accept the key as a prop.
  const stripePromise = loadStripe(publishableKey);

  // You can pass options to Elements if needed (appearance, fonts, etc.)
  const elementsOptions: StripeElementsOptions = {};

  return (
    <Elements stripe={stripePromise} options={elementsOptions}>
      <CheckoutForm
        amount={amount}
        receiptEmail={receiptEmail}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}
