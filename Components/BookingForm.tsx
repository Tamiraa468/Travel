"use client";
import { useState } from "react";

type Props = { tourId: string; tourDateId: string; price: number };

export default function BookingForm({ tourId, tourDateId, price }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId,
          tourDateId,
          quantity,
          customer: { firstName, lastName, email },
        }),
      });
      const data = await res.json();
      if (data.ok) setMessage("Booking created — proceed to payment.");
      else setMessage("Failed to create booking");
    } catch (err) {
      console.error(err);
      setMessage("Error creating booking");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <input
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="First name"
          className="p-2 border rounded"
        />
        <input
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="Last name"
          className="p-2 border rounded"
        />
      </div>
      <input
        required
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="p-2 w-full border rounded"
      />
      <div className="flex items-center gap-3">
        <label className="text-sm">Quantity</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="p-2 w-20 border rounded"
        />
        <div className="ml-auto">
          Total: <strong>${(price * quantity).toFixed(2)}</strong>
        </div>
      </div>
      <div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Booking..." : "Book Now"}
        </button>
      </div>
      {message && <div className="text-sm text-gray-700">{message}</div>}
    </form>
  );
}
