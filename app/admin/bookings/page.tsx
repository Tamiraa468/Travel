import { getAllBookings, confirmBooking, cancelBooking } from "@/lib/actions";
import AdminTable from "@/Components/AdminTable";
import StatusBadge from "@/Components/StatusBadge";

async function handleConfirm(bookingId: string) {
  "use server";
  await confirmBooking(bookingId);
}

async function handleCancel(bookingId: string) {
  "use server";
  await cancelBooking(bookingId);
}

export default async function BookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <AdminTable
          data={bookings}
          columns={[
            {
              key: "customer" as const,
              label: "Customer",
              render: (customer) =>
                `${customer.firstName} ${customer.lastName}`,
            },
            {
              key: "tour" as const,
              label: "Tour",
              render: (tour) => tour.title,
            },
            {
              key: "quantity" as const,
              label: "Persons",
            },
            {
              key: "totalPrice" as const,
              label: "Total",
              render: (price) => `$${price.toFixed(2)}`,
            },
            {
              key: "status" as const,
              label: "Booking Status",
              render: (status) => <StatusBadge status={status} />,
            },
            {
              key: "payment" as const,
              label: "Payment Status",
              render: (payment) =>
                payment ? (
                  <StatusBadge status={payment.status} />
                ) : (
                  <span className="text-gray-500">N/A</span>
                ),
            },
          ]}
          actions={(booking: any) => (
            <div className="flex gap-2">
              {booking.status === "PENDING" && (
                <>
                  <form action={handleConfirm.bind(null, booking.id)}>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                    >
                      Confirm
                    </button>
                  </form>
                  <form action={handleCancel.bind(null, booking.id)}>
                    <button
                      type="submit"
                      className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  </form>
                </>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
