import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function GET() {
  try {
    // Verify admin is logged in
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all booking requests with bank transfer payment method
    // or pending payments that might be bank transfers
    const bankTransfers = await prisma.requestInfo.findMany({
      where: {
        OR: [
          { paymentMethod: "bank_transfer" },
          { paymentMethod: "bank" },
          {
            AND: [
              { paymentMethod: null },
              { stripeSessionId: null },
              { paypalOrderId: null },
            ],
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: bankTransfers,
    });
  } catch (error) {
    console.error("Error fetching bank transfers:", error);
    return NextResponse.json(
      { error: "Failed to fetch bank transfers" },
      { status: 500 }
    );
  }
}
