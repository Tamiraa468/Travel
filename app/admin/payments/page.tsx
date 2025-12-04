import { getAllPayments } from "@/lib/actions";
import PaymentsTable from "@/Components/PaymentsTable";

export default async function PaymentsPage() {
  const payments = await getAllPayments();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Payments</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <PaymentsTable payments={payments} />
      </div>
    </div>
  );
}
