import { getDashboardStats } from "@/lib/actions";
import AdminCard from "@/Components/AdminCard";
import Link from "next/link";

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  const StatCard = ({ title, value }: { title: string; value: number }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-600 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-2">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value={stats.totalBookings} />
        <StatCard title="Paid Payments" value={stats.totalPayments} />
        <StatCard title="Total Tours" value={stats.totalTours} />
        <StatCard title="Total Customers" value={stats.totalCustomers} />
      </div>

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

      {/* Quick Actions */}
      <AdminCard title="Quick Actions">
        <div className="flex gap-3">
          <Link
            href="/admin/tours/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Tour
          </Link>
          <Link
            href="/admin/bookings"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
          >
            View Bookings
          </Link>
        </div>
      </AdminCard>
    </div>
  );
}
