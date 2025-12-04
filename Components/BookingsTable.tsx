"use client";

import AdminTable from "@/Components/AdminTable";
import StatusBadge from "@/Components/StatusBadge";

type StatusType =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "UNPAID"
  | "PAID"
  | "REFUNDED";

type Booking = any;

export default function BookingsTable({ bookings }: { bookings: Booking[] }) {
  const confirmBooking = async (id: string) => {
    const res = await fetch("/api/admin/bookings/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Confirm failed");
    location.reload();
  };

  const cancelBooking = async (id: string) => {
    const res = await fetch("/api/admin/bookings/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error("Cancel failed");
    location.reload();
  };

  return (
    <AdminTable
      data={bookings}
      columns={[
        {
          key: "customer" as const,
          label: "Customer",
          render: (customer: any) =>
            `${customer.firstName} ${customer.lastName}`,
        },
        {
          key: "tour" as const,
          label: "Tour",
          render: (tour: any) => tour.title,
        },
        { key: "quantity" as const, label: "Persons" },
        {
          key: "totalPrice" as const,
          label: "Total",
          render: (price: number) => `$${price.toFixed(2)}`,
        },
        {
          key: "status" as const,
          label: "Booking Status",
          render: (status: StatusType) => <StatusBadge status={status} />,
        },
        {
          key: "payment" as const,
          label: "Payment Status",
          render: (payment: any) =>
            payment ? (
              <StatusBadge status={payment.status as StatusType} />
            ) : (
              <span className="text-gray-500">N/A</span>
            ),
        },
      ]}
      actions={(booking: any) => (
        <div className="flex gap-2">
          {booking.status === "PENDING" && (
            <>
              <button
                onClick={() => confirmBooking(booking.id)}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              >
                Confirm
              </button>
              <button
                onClick={() => cancelBooking(booking.id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      )}
    />
  );
}
