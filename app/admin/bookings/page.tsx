import { getAllBookings } from "@/lib/actions";
import BookingsTable from "@/Components/BookingsTable";

export default async function BookingsPage() {
  const bookings = await getAllBookings();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Bookings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <BookingsTable bookings={bookings} />
      </div>
    </div>
  );
}
