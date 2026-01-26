/**
 * API Route: /api/admin/inquiries
 *
 * Admin endpoints for managing inquiries (CRM functionality)
 * - GET: List all inquiries with filtering
 * - PATCH: Update inquiry status, notes, assignment
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { updateInquiryStatusSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET: List inquiries with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const assignedTo = searchParams.get("assignedTo");
    const search = searchParams.get("search");
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Build where clause
    const where: any = {};

    if (status && status !== "ALL") {
      where.leadStatus = status;
    }

    if (assignedTo) {
      where.assignedTo = assignedTo;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { tourName: { contains: search, mode: "insensitive" } },
      ];
    }

    // Fetch inquiries
    const [inquiries, total] = await Promise.all([
      prisma.inquiry.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.inquiry.count({ where }),
    ]);

    // Get stats by status
    const stats = await prisma.inquiry.groupBy({
      by: ["leadStatus"],
      _count: { id: true },
    });

    const statusCounts = stats.reduce((acc: Record<string, number>, item) => {
      acc[item.leadStatus] = item._count.id;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: inquiries,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      stats: {
        total,
        byStatus: statusCounts,
      },
    });
  } catch (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inquiries" },
      { status: 500 },
    );
  }
}

// PATCH: Update inquiry
export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { inquiryId, ...updateData } = body;

    if (!inquiryId) {
      return NextResponse.json(
        { success: false, error: "Inquiry ID is required" },
        { status: 400 },
      );
    }

    // Prepare update data
    const dataToUpdate: any = {
      updatedAt: new Date(),
    };

    if (updateData.leadStatus) {
      dataToUpdate.leadStatus = updateData.leadStatus;

      // Track first contact
      if (updateData.leadStatus === "CONTACTED" && !updateData.firstContactAt) {
        dataToUpdate.firstContactAt = new Date();
      }
    }

    if (updateData.internalNotes !== undefined) {
      dataToUpdate.internalNotes = updateData.internalNotes;
    }

    if (updateData.assignedTo !== undefined) {
      dataToUpdate.assignedTo = updateData.assignedTo;
    }

    if (updateData.quotedPrice !== undefined) {
      dataToUpdate.quotedPrice = updateData.quotedPrice;
    }

    if (updateData.quoteValidUntil !== undefined) {
      dataToUpdate.quoteValidUntil = new Date(updateData.quoteValidUntil);
    }

    // Update the inquiry
    const updated = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: dataToUpdate,
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Failed to update inquiry:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update inquiry" },
      { status: 500 },
    );
  }
}
