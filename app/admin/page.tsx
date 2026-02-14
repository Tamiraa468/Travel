import { getDashboardStats } from "@/lib/actions";
import AdminCard from "@/Components/AdminCard";
import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  MessageCircle,
  Users,
  CreditCard,
  Map,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

async function getInquiryStats() {
  const [total, newCount, wonCount] = await Promise.all([
    prisma.inquiry.count(),
    prisma.inquiry.count({ where: { leadStatus: "NEW" } }),
    prisma.inquiry.count({ where: { leadStatus: "WON" } }),
  ]);
  return { total, new: newCount, won: wonCount };
}

export default async function AdminDashboard() {
  const [stats, inquiryStats] = await Promise.all([
    getDashboardStats(),
    getInquiryStats().catch(() => ({ total: 0, new: 0, won: 0 })),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* New Inquiries Alert - Inquiry-First Model */}
      {inquiryStats.new > 0 && (
        <Link href="/admin/inquiries?status=NEW">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl transition-shadow cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-gold-300 text-sm font-medium">
                    Action Required
                  </p>
                  <p className="text-2xl font-bold">
                    {inquiryStats.new} New Inquiries
                  </p>
                  <p className="text-blue-200 text-sm">
                    Respond within 24 hours for best conversion
                  </p>
                </div>
              </div>
              <ArrowRight className="w-6 h-6" />
            </div>
          </div>
        </Link>
      )}

      {/* Stats Grid - Updated for Inquiry-First */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Link href="/admin/inquiries">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border-l-4 border-amber-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Total Inquiries
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {inquiryStats.total}
                </p>
              </div>
              <MessageCircle className="w-8 h-8 text-amber-500" />
            </div>
          </div>
        </Link>

        <Link href="/admin/inquiries?status=WON">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Won Deals</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {inquiryStats.won}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </Link>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">
                Total Bookings
              </p>
              <p className="text-3xl font-bold text-gray-800 mt-2">
                {stats.totalBookings}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <Link href="/admin/tours">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  Active Tours
                </p>
                <p className="text-3xl font-bold text-gray-800 mt-2">
                  {stats.totalTours}
                </p>
              </div>
              <Map className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions - Updated for Inquiry-First */}
      <AdminCard title="Quick Actions">
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/inquiries?status=NEW"
            className="px-4 py-2 bg-forest-900 text-white rounded-lg hover:bg-forest-700 flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Review New Inquiries
          </Link>
          <Link
            href="/admin/inquiries"
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            Inquiry CRM
          </Link>
          <Link
            href="/admin/tours/new"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Create Tour
          </Link>
          <Link
            href="/admin/blog/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create News Post
          </Link>
          <Link
            href="/admin/bookings"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            View Bookings
          </Link>
        </div>
      </AdminCard>

      {/* Recent Bookings */}
      <AdminCard title="Recent Bookings">
        <div className="space-y-3">
          {stats.recentBookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet</p>
          ) : (
            <ul>
              {stats.recentBookings.map((booking) => (
                <li
                  key={booking.id}
                  className="flex justify-between items-center pb-3 border-b"
                >
                  <div>
                    <p className="font-medium">
                      {booking.customer.firstName} {booking.customer.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {booking.tour.title}
                    </p>
                  </div>
                  <p className="font-semibold">
                    ${booking.totalPrice.toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </AdminCard>

      {/* Sales Model Reminder */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white">
        <h3 className="font-semibold text-lg mb-2">
          💡 Inquiry-First Sales Model
        </h3>
        <p className="text-stone text-sm">
          Remember: This platform sells <strong>conversations</strong>, not
          instant bookings. Every inquiry is a potential high-value customer.
          Respond personally, customize their experience, and send payment links
          only after agreeing on the itinerary.
        </p>
      </div>
    </div>
  );
}
