"use client";

type Props = {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "UNPAID"
    | "PAID"
    | "REFUNDED";
};

export default function StatusBadge({ status }: Props) {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    UNPAID: "bg-orange-100 text-orange-800",
    PAID: "bg-green-100 text-green-800",
    REFUNDED: "bg-forest-500/20 text-forest-700",
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}
