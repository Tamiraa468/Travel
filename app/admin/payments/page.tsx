import { getAllPayments } from "@/lib/actions";
import AdminTable from "@/Components/AdminTable";
import StatusBadge from "@/Components/StatusBadge";

export default async function PaymentsPage() {
  const payments = await getAllPayments();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Payments</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <AdminTable
          data={payments}
          columns={[
            {
              key: "id" as const,
              label: "Payment ID",
              render: (id) => id.substring(0, 8).toUpperCase(),
            },
            {
              key: "booking" as const,
              label: "Customer",
              render: (booking) =>
                `${booking.customer.firstName} ${booking.customer.lastName}`,
            },
            {
              key: "booking" as const,
              label: "Tour",
              render: (booking) => booking.tour.title,
            },
            {
              key: "amount" as const,
              label: "Amount",
              render: (amount) => `$${amount.toFixed(2)}`,
            },
            {
              key: "provider" as const,
              label: "Provider",
            },
            {
              key: "status" as const,
              label: "Status",
              render: (status) => <StatusBadge status={status} />,
            },
            {
              key: "createdAt" as const,
              label: "Date",
              render: (date) => new Date(date).toLocaleDateString(),
            },
          ]}
        />
      </div>
    </div>
  );
}
