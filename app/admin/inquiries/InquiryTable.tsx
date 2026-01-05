"use client";

/**
 * InquiryTable Component
 *
 * Displays inquiries in a table format with actions.
 * Supports:
 * - Status updates
 * - Internal notes
 * - Send payment link
 * - Quick reply actions
 */

import { useState } from "react";
import {
  Mail,
  Phone,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Globe,
  Calendar,
  Users,
  Wallet,
  StickyNote,
  CreditCard,
  ExternalLink,
} from "lucide-react";

interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  country: string | null;
  travelMonth: string | null;
  groupSize: string | null;
  budgetRange: string | null;
  message: string | null;
  tourName: string | null;
  leadStatus: string;
  internalNotes: string | null;
  quotedPrice: number | null;
  createdAt: Date | string;
  firstContactAt: Date | string | null;
}

interface InquiryTableProps {
  inquiries: Inquiry[];
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-gold-500/10 text-gold-700 border-blue-200",
  CONTACTED: "bg-purple-100 text-purple-700 border-purple-200",
  QUOTED: "bg-amber-100 text-amber-700 border-amber-200",
  NEGOTIATING: "bg-orange-100 text-orange-700 border-orange-200",
  WON: "bg-green-100 text-green-700 border-green-200",
  LOST: "bg-red-100 text-red-700 border-red-200",
  ON_HOLD: "bg-slate-100 text-slate-700 border-slate-200",
};

const STATUS_OPTIONS = [
  "NEW",
  "CONTACTED",
  "QUOTED",
  "NEGOTIATING",
  "WON",
  "LOST",
  "ON_HOLD",
];

export default function InquiryTable({ inquiries }: InquiryTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleStatusChange = async (inquiryId: string, newStatus: string) => {
    setUpdating(inquiryId);
    try {
      const res = await fetch("/api/admin/inquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inquiryId, leadStatus: newStatus }),
      });
      if (res.ok) {
        // Refresh page to get updated data
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
    setUpdating(null);
  };

  const formatDate = (dateInput: Date | string) => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <p>No inquiries found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
              Contact
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
              Interest
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
              Status
            </th>
            <th className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
              Received
            </th>
            <th className="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => (
            <>
              <tr
                key={inquiry.id}
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                  inquiry.leadStatus === "NEW" ? "bg-gold-500/10/50" : ""
                }`}
              >
                {/* Contact */}
                <td className="py-4 px-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      {inquiry.fullName}
                    </p>
                    <p className="text-sm text-gray-500">{inquiry.email}</p>
                    {inquiry.country && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                        <Globe className="w-3 h-3" />
                        {inquiry.country}
                      </p>
                    )}
                  </div>
                </td>

                {/* Interest */}
                <td className="py-4 px-4">
                  <div className="max-w-xs">
                    {inquiry.tourName ? (
                      <p className="font-medium text-amber-700 truncate">
                        {inquiry.tourName}
                      </p>
                    ) : (
                      <p className="text-gray-400 italic">General inquiry</p>
                    )}
                    {inquiry.travelMonth && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {inquiry.travelMonth}
                      </p>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-4">
                  <select
                    value={inquiry.leadStatus}
                    onChange={(e) =>
                      handleStatusChange(inquiry.id, e.target.value)
                    }
                    disabled={updating === inquiry.id}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${
                      STATUS_COLORS[inquiry.leadStatus]
                    } cursor-pointer appearance-none pr-8 bg-no-repeat bg-right`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundSize: "16px",
                      backgroundPosition: "right 8px center",
                    }}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Received */}
                <td className="py-4 px-4">
                  <span className="text-sm text-gray-500">
                    {formatDate(inquiry.createdAt)}
                  </span>
                </td>

                {/* Actions */}
                <td className="py-4 px-4">
                  <div className="flex items-center justify-end gap-2">
                    {/* Quick Contact */}
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="p-2 hover:bg-gold-500/10 rounded-lg text-forest-700 transition-colors"
                      title="Send Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                    {inquiry.phone && (
                      <a
                        href={`https://wa.me/${inquiry.phone.replace(
                          /[^0-9]/g,
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-green-100 rounded-lg text-green-600 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}

                    {/* Expand Details */}
                    <button
                      onClick={() =>
                        setExpandedId(
                          expandedId === inquiry.id ? null : inquiry.id
                        )
                      }
                      className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                    >
                      {expandedId === inquiry.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>

              {/* Expanded Details Row */}
              {expandedId === inquiry.id && (
                <tr className="bg-slate-50">
                  <td colSpan={5} className="px-4 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Trip Details */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                          Trip Details
                        </h4>
                        <div className="space-y-2">
                          {inquiry.groupSize && (
                            <p className="text-sm flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4 text-gray-400" />
                              {inquiry.groupSize}
                            </p>
                          )}
                          {inquiry.budgetRange && (
                            <p className="text-sm flex items-center gap-2 text-gray-600">
                              <Wallet className="w-4 h-4 text-gray-400" />
                              {inquiry.budgetRange}
                            </p>
                          )}
                          {inquiry.quotedPrice && (
                            <p className="text-sm flex items-center gap-2 text-green-600 font-semibold">
                              <CreditCard className="w-4 h-4" />
                              Quoted: ${inquiry.quotedPrice.toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Customer Message */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                          Customer Message
                        </h4>
                        {inquiry.message ? (
                          <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border border-gray-200 whitespace-pre-wrap">
                            {inquiry.message}
                          </p>
                        ) : (
                          <p className="text-sm text-gray-400 italic">
                            No message provided
                          </p>
                        )}
                      </div>

                      {/* Actions & Notes */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                          Quick Actions
                        </h4>
                        <div className="flex flex-col gap-2">
                          <a
                            href={`mailto:${
                              inquiry.email
                            }?subject=Re: Your Mongolia Travel Inquiry&body=Hi ${
                              inquiry.fullName.split(" ")[0]
                            },%0D%0A%0D%0AThank you for your interest in ${
                              inquiry.tourName || "traveling to Mongolia"
                            }!`}
                            className="flex items-center gap-2 px-4 py-2 bg-gold-500/100 text-white rounded-lg hover:bg-forest-900 transition-colors text-sm font-medium"
                          >
                            <Mail className="w-4 h-4" />
                            Reply by Email
                          </a>
                          {["QUOTED", "NEGOTIATING", "WON"].includes(
                            inquiry.leadStatus
                          ) && (
                            <button
                              onClick={() => {
                                // TODO: Open send payment link modal
                                alert(
                                  "Payment link modal - implement with proper modal component"
                                );
                              }}
                              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                            >
                              <CreditCard className="w-4 h-4" />
                              Send Payment Link
                            </button>
                          )}
                        </div>

                        {/* Internal Notes */}
                        {inquiry.internalNotes && (
                          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <p className="text-xs font-semibold text-amber-700 flex items-center gap-1 mb-1">
                              <StickyNote className="w-3 h-3" />
                              Internal Notes
                            </p>
                            <p className="text-sm text-amber-900">
                              {inquiry.internalNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Reference ID */}
                    <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        ID: {inquiry.id} | Created:{" "}
                        {new Date(inquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
