import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sanitizeEmail, sanitizeString, sanitizePhone } from "@/lib/security";

// Rate limiting for booking endpoint
const bookingRequests = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 5; // Max 5 booking attempts per minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  let requests = bookingRequests.get(ip) || [];
  requests = requests.filter((t) => t > now - RATE_LIMIT_WINDOW);
  if (requests.length >= RATE_LIMIT_MAX) return true;
  requests.push(now);
  bookingRequests.set(ip, requests);
  return false;
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          ok: false,
          error: "Too many requests. Please try again in a minute.",
        },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { tourId, tourDateId, customer, quantity } = body;

    // Sanitize customer data
    const sanitizedCustomer = {
      name: sanitizeString(customer?.name || "").slice(0, 100),
      email: sanitizeEmail(customer?.email || ""),
      phone: sanitizePhone(customer?.phone || ""),
    };

    // Validate required fields
    if (!sanitizedCustomer.email || !tourId) {
      return NextResponse.json(
        { ok: false, error: "Email and tour are required" },
        { status: 400 }
      );
    }

    // upsert customer by email using sanitized data
    const cust = await prisma.customer.upsert({
      where: { email: sanitizedCustomer.email },
      update: sanitizedCustomer,
      create: sanitizedCustomer,
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
