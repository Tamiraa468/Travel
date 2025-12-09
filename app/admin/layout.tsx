"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

async function logout() {
  await fetch("/api/admin/logout", { method: "POST" });
  window.location.href = "/admin/login";
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin" },
    { label: "Tours", href: "/admin/tours" },
    { label: "Bookings", href: "/admin/bookings" },
    { label: "Payments", href: "/admin/payments" },
    { label: "💰 Bank Transfers", href: "/admin/bank-transfers" },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:z-auto`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">UTravel Admin</h1>
        </div>

        <nav className="mt-8 space-y-2 px-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-lg hover:bg-gray-800 transition"
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={logout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
