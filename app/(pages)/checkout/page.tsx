"use client";

import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutButton() {
  const handleCheckout = async () => {
    const response = await fetch("http://localhost:5000/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: [{ name: "Premium Membership", price: 50, quantity: 1 }],
      }),
    });

    const { id } = await response.json();
    const stripe = await stripePromise;
    stripe?.redirectToCheckout({ sessionId: id });
  };

  return (
    <button onClick={handleCheckout} className="bg-blue-500 text-white px-4 py-2">
      Pay Now
    </button>
  );
}
