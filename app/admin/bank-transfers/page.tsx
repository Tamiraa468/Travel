"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  Mail,
  Phone,
  Calendar,
  Users,
} from "lucide-react";

interface BankTransfer {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  tourName: string | null;
  tourPrice: number | null;
  advanceRequired: number | null;
  amountPaid: number;
  paymentStatus: "PENDING" | "PARTIAL" | "PAID" | "REFUNDED";
  bookingStatus: "UNCONFIRMED" | "CONFIRMED" | "CANCELLED";
  preferredStartDate: string | null;
  adults: number;
  children: number;
  message: string | null;
  paymentMethod: string | null;
  createdAt: string;
}

export default function BankTransfersPage() {
  const [transfers, setTransfers] = useState<BankTransfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchTransfers();
  }, []);

  async function fetchTransfers() {
    try {
      const res = await fetch("/api/admin/bank-transfer");
      const data = await res.json();
      if (data.success) {
        setTransfers(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to load bank transfers");
    } finally {
      setLoading(false);
    }
  }

  async function confirmPayment(requestId: string, amountPaid: number) {
    if (
      !confirm(
        "Are you sure you want to confirm this bank transfer payment? This will send a confirmation email to the customer."
      )
    ) {
      return;
    }

    setConfirming(requestId);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/admin/bank-transfer/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, amountPaid }),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(`Payment confirmed! Confirmation email sent to customer.`);
        fetchTransfers(); // Refresh list
      } else {
        setError(data.error || "Failed to confirm payment");
      }
    } catch (err) {
      setError("Failed to confirm payment");
    } finally {
      setConfirming(null);
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </span>
        );
      case "PARTIAL":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Partial
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const getBookingBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Confirmed
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unconfirmed
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Bank Transfers</h1>
        <button
          onClick={fetchTransfers}
          className="px-4 py-2 bg-forest-900 text-white rounded-lg hover:bg-forest-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* Bank Account Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-semibold mb-4">
          Your Bank Account Details (for customers)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-80">Bank Name</p>
            <p className="font-semibold">Khan Bank</p>
          </div>
          <div>
            <p className="opacity-80">Account Holder</p>
            <p className="font-semibold">Maralgoo Dreamland LLC</p>
          </div>
          <div>
            <p className="opacity-80">Account Number</p>
            <p className="font-semibold font-mono">5012XXXXXXXX</p>
          </div>
          <div>
            <p className="opacity-80">SWIFT Code</p>
            <p className="font-semibold font-mono">KHANMNUB</p>
          </div>
        </div>
        <p className="mt-4 text-xs opacity-70">
          * Update these details in the payment page component
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Transfers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800">
            Pending & Completed Bank Transfers ({transfers.length})
          </h2>
        </div>

        {transfers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <DollarSign className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No bank transfer requests yet</p>
          </div>
        ) : (
          <div className="divide-y">
            {transfers.map((transfer) => (
              <div
                key={transfer.id}
                className="p-6 hover:bg-gray-50 transition"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Customer Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">
                        {transfer.fullName}
                      </h3>
                      {getPaymentBadge(transfer.paymentStatus)}
                      {getBookingBadge(transfer.bookingStatus)}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {transfer.email}
                      </div>
                      {transfer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {transfer.phone}
                        </div>
                      )}
                      {transfer.preferredStartDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(
                            transfer.preferredStartDate
                          ).toLocaleDateString()}
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {transfer.adults} adults, {transfer.children} children
                      </div>
                    </div>

                    {transfer.tourName && (
                      <p className="mt-2 text-forest-700 font-medium">
                        🏔 {transfer.tourName}
                      </p>
                    )}

                    {transfer.message && (
                      <p className="mt-2 text-gray-500 text-sm italic">
                        "{transfer.message}"
                      </p>
                    )}
                  </div>

                  {/* Payment Info & Actions */}
                  <div className="lg:text-right space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Tour Price</p>
                      <p className="text-xl font-bold text-gray-900">
                        ${transfer.tourPrice?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">
                        Advance Required (30%)
                      </p>
                      <p className="font-semibold text-orange-600">
                        ${transfer.advanceRequired?.toFixed(2) || "0.00"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount Paid</p>
                      <p className="font-semibold text-green-600">
                        ${transfer.amountPaid.toFixed(2)}
                      </p>
                    </div>

                    {/* Confirm Button */}
                    {transfer.paymentStatus !== "PAID" &&
                      transfer.bookingStatus !== "CONFIRMED" && (
                        <button
                          onClick={() =>
                            confirmPayment(
                              transfer.id,
                              transfer.advanceRequired || 0
                            )
                          }
                          disabled={confirming === transfer.id}
                          className="w-full lg:w-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
                        >
                          {confirming === transfer.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              Confirming...
                            </>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Confirm Payment
                            </>
                          )}
                        </button>
                      )}

                    <p className="text-xs text-gray-400">
                      Created: {new Date(transfer.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function getPaymentBadge(status: string) {
  switch (status) {
    case "PAID":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Paid
        </span>
      );
    case "PARTIAL":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-3 h-3 mr-1" />
          Partial
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>
      );
  }
}
