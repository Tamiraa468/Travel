/**
 * Tour Edit Page
 * Admin page for editing tour information
 * Route: /admin/tours/[id]/edit
 */
import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import TourEditForm from "@/Components/TourEditForm";

// Dynamic metadata based on tour
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
    select: { title: true },
  });

  return {
    title: tour ? `Edit: ${tour.title} | Admin` : "Edit Tour | Admin",
  };
}

// Server component that validates the tour exists
export default async function EditTourPage({
  params,
}: {
  params: { id: string };
}) {
  // Verify tour exists before rendering form
  const tour = await prisma.tour.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!tour) {
    notFound();
  }

  return <TourEditForm tourId={params.id} />;
}
