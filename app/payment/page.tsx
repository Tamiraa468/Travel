import StripeCheckout from "@/Components/StripeCheckout";

// This is a server component (app router). We read the publishable key from
// NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY. Only variables prefixed with NEXT_PUBLIC_
// are safe to expose to the browser.
export default function PaymentPage() {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";

  if (!publishableKey) {
    // If the publishable key is not set, show an informative message.
    return (
      <main className="container mx-auto p-8">
        <h1 className="text-2xl font-bold mb-4">Payment</h1>
        <p className="text-red-600">
          Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable.
        </p>
      </main>
    );
  }

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Complete payment</h1>
      <p className="mb-4">
        This example charges a fixed amount of $10.00 using Stripe Elements.
      </p>
      {/* Pass the publishable key to the client component */}
      {/* The client component will call loadStripe(publishableKey) */}
      <StripeCheckout publishableKey={publishableKey} />
    </main>
  );
}
