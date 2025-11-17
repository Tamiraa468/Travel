import React from "react";
import prisma from "@/lib/prisma";

type Props = { params: { slug: string } };

export default async function TourPage({ params }: Props) {
  const { slug } = params;

  const tour = await prisma.tour.findUnique({
    where: { slug },
    include: { dates: true },
  });

  if (!tour) {
    return (
      <main className="max-w-4xl mx-auto py-20">
        <h1 className="text-2xl font-semibold">Tour not found</h1>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">{tour.title}</h1>
      <p className="text-gray-600 mb-6">{tour.description}</p>
      <div className="mb-6">
        <strong>Price:</strong> ${tour.price.toFixed(2)} —{" "}
        <strong>Duration:</strong> {tour.duration} days
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-3">Available Dates</h2>
        <ul className="space-y-3">
          {tour.dates.map((d) => (
            <li key={d.id} className="p-3 border rounded">
              <div>
                <strong>{new Date(d.startDate).toLocaleDateString()}</strong> —{" "}
                {new Date(d.endDate).toLocaleDateString()}
              </div>
              <div>Capacity: {d.capacity}</div>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
