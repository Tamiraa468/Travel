"use client";

import AdminTable from "@/Components/AdminTable";
import StatusBadge from "@/Components/StatusBadge";

export default function PaymentsTable({ payments }: { payments: any[] }) {
  return (
    <AdminTable
      data={payments}
      columns={[
        {
          key: "id" as const,
          label: "Payment ID",
          render: (id: string) => id.substring(0, 8).toUpperCase(),
        },
        {
          key: "booking" as const,
          label: "Customer",
          render: (booking: any) =>
            `${booking.customer.firstName} ${booking.customer.lastName}`,
        },
        {
          key: "booking" as const,
          label: "Tour",
          render: (booking: any) => booking.tour.title,
        },
        {
          key: "amount" as const,
          label: "Amount",
          render: (amount: number) => `$${amount.toFixed(2)}`,
        },
        { key: "provider" as const, label: "Provider" },
        {
          key: "status" as const,
          label: "Status",
          render: (status: any) => <StatusBadge status={status} />,
        },
        {
          key: "createdAt" as const,
          label: "Date",
          render: (date: string) => new Date(date).toLocaleDateString(),
        },
      ]}
    />
  );
}
