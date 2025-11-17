import { getAllTours, deleteTour } from "@/lib/actions";
import AdminTable from "@/Components/AdminTable";
import AdminButton from "@/Components/AdminButton";
import Link from "next/link";
import { redirect } from "next/navigation";

async function handleDeleteTour(tourId: string) {
  "use server";
  try {
    await deleteTour(tourId);
    redirect("/admin/tours");
  } catch (error) {
    console.error("Delete error:", error);
  }
}

export default async function ToursPage() {
  const tours = await getAllTours();

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
        <AdminTable
          data={tours}
          columns={[
            { key: "title" as const, label: "Title" },
            { key: "slug" as const, label: "Slug" },
            { key: "days" as const, label: "Days" },
            {
              key: "priceFrom" as const,
              label: "Price From",
              render: (value) => `$${value}`,
            },
          ]}
          actions={(tour: any) => (
            <div className="flex gap-2">
              <Link
                href={`/admin/tours/${tour.id}/edit`}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
              >
                Edit
              </Link>
              <form action={handleDeleteTour.bind(null, tour.id)}>
                <button
                  type="submit"
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                  onClick={(e) => {
                    if (!confirm("Are you sure?")) e.preventDefault();
                  }}
                >
                  Delete
                </button>
              </form>
            </div>
          )}
        />
      </div>
    </div>
  );
}
