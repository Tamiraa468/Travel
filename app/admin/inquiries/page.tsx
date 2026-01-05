/**
 * Admin Inquiries CRM Page
 *
 * ============================================
 * INQUIRY-FIRST SALES MODEL - ADMIN CRM
 * ============================================
 *
 * This page provides a CRM-style interface for managing inquiries.
 * Key features:
 * - Pipeline view (Kanban-style or table)
 * - Status management (new → contacted → quoted → won/lost)
 * - Internal notes
 * - Send payment link action
 * - Conversion metrics
 */

import { Suspense } from "react";
import Link from "next/link";
import prisma from "@/lib/prisma";
import AdminCard from "@/Components/AdminCard";
import InquiryTable from "./InquiryTable";
import InquiryStats from "./InquiryStats";

export const dynamic = "force-dynamic";

async function getInquiryStats() {
  const stats = await prisma.inquiry.groupBy({
    by: ["leadStatus"],
    _count: { id: true },
  });

  const total = await prisma.inquiry.count();

  const statusCounts = stats.reduce((acc: Record<string, number>, item) => {
    acc[item.leadStatus] = item._count.id;
    return acc;
  }, {});

  return {
    total,
    new: statusCounts["NEW"] || 0,
    contacted: statusCounts["CONTACTED"] || 0,
    quoted: statusCounts["QUOTED"] || 0,
    negotiating: statusCounts["NEGOTIATING"] || 0,
    won: statusCounts["WON"] || 0,
    lost: statusCounts["LOST"] || 0,
    onHold: statusCounts["ON_HOLD"] || 0,
  };
}

async function getInquiries(status?: string) {
  const where = status && status !== "ALL" ? { leadStatus: status as any } : {};

  return prisma.inquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const status = searchParams.status || "ALL";
  const [stats, inquiries] = await Promise.all([
    getInquiryStats(),
    getInquiries(status),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Inquiry CRM</h1>
          <p className="text-gray-500 mt-1">
            Manage leads and convert conversations to bookings
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ← Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <InquiryStats stats={stats} currentStatus={status} />

      {/* Pipeline Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { key: "ALL", label: "All Inquiries", color: "bg-gray-500" },
          { key: "NEW", label: "New", color: "bg-gold-500/100" },
          { key: "CONTACTED", label: "Contacted", color: "bg-purple-500" },
          { key: "QUOTED", label: "Quoted", color: "bg-amber-500" },
          { key: "NEGOTIATING", label: "Negotiating", color: "bg-orange-500" },
          { key: "WON", label: "Won", color: "bg-green-500" },
          { key: "LOST", label: "Lost", color: "bg-red-500" },
          { key: "ON_HOLD", label: "On Hold", color: "bg-slate-400" },
        ].map((item) => (
          <Link
            key={item.key}
            href={`/admin/inquiries?status=${item.key}`}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              status === item.key
                ? `${item.color} text-white shadow-lg`
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {item.label}
            {item.key !== "ALL" && (
              <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                {stats[
                  item.key.toLowerCase().replace("_", "") as keyof typeof stats
                ] || 0}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Inquiries Table */}
      <AdminCard
        title={`${status === "ALL" ? "All" : status} Inquiries (${
          inquiries.length
        })`}
      >
        <Suspense
          fallback={
            <div className="p-8 text-center text-gray-400">Loading...</div>
          }
        >
          <InquiryTable inquiries={inquiries} />
        </Suspense>
      </AdminCard>
    </div>
  );
}
