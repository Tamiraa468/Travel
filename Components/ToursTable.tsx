"use client";

import Link from "next/link";
import AdminTable from "@/Components/AdminTable";

interface Tour {
  id: string;
  title: string;
  slug: string;
  days: number;
  priceFrom: number;
}

interface Props {
  tours: Tour[];
  onDelete: (tourId: string) => Promise<void>;
}

export default function ToursTable({ tours, onDelete }: Props) {
  const handleDelete = async (tourId: string) => {
    if (confirm("Are you sure you want to delete this tour?")) {
      await onDelete(tourId);
    }
  };

  return (
    <AdminTable
      data={tours}
      columns={[
        { key: "title" as const, label: "Title" },
        { key: "slug" as const, label: "Slug" },
        { key: "days" as const, label: "Days" },
        {
          key: "priceFrom" as const,
          label: "Price From",
          render: (value) => `$${value?.toLocaleString() || "0"}`,
        },
      ]}
      actions={(tour: Tour) => (
        <div className="flex gap-2">
          <Link
            href={`/admin/tours/${tour.id}/edit`}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            Edit
          </Link>
          <button
            onClick={() => handleDelete(tour.id)}
            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}
    />
  );
}
