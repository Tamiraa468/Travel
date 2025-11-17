import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tourId, tourDateId, customer, quantity } = body;

    // upsert customer by email
    const cust = await prisma.customer.upsert({
      where: { email: customer.email },
      update: { ...customer },
      create: { ...customer },
    });

    // calculate total price from tour
    const tour = await prisma.tour.findUnique({ where: { id: tourId } });
    if (!tour)
      return NextResponse.json(
        { ok: false, error: "Tour not found" },
        { status: 404 }
      );

    const totalPrice = Number(tour.price) * Number(quantity);

    const booking = await prisma.booking.create({
      data: {
        tourId,
        tourDateId,
        customerId: cust.id,
        quantity: Number(quantity),
        totalPrice,
      },
    });

    return NextResponse.json({ ok: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error("POST /api/booking error", error);
    return NextResponse.json(
      { ok: false, error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
