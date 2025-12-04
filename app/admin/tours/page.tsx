import { getAllTours, deleteTour } from "@/lib/actions";
import ToursTable from "@/Components/ToursTable";
import Link from "next/link";

export default async function ToursPage() {
  const tours = await getAllTours();
  console.log("Tours fetched in page:", tours.length, tours);

  const handleDelete = async (tourId: string) => {
    "use server";
    try {
      await deleteTour(tourId);
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Tours</h1>
        <Link
          href="/admin/tours/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Create Tour
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <ToursTable tours={tours} onDelete={handleDelete} />
      </div>
    </div>
  );
}
