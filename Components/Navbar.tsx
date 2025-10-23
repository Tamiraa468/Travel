"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTravelAgencyContext } from "../context/TravelAgencyContext";
import { assets } from "../assets/assets";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { travelers, bookingRequests } = useTravelAgencyContext();
  const bookingCount = bookingRequests.length;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Image
            src={assets.logo}
            alt="Mongolia Travel"
            width={50}
            height={50}
            className="rounded-full"
          />
          <span className="font-semibold text-lg md:text-xl text-blue-800">
            Mongolia Travel
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {/* Main Nav Links */}
          <Link href="/" className="hover:text-blue-700 transition">
            Home
          </Link>
          <Link href="/tours" className="hover:text-blue-700 transition">
            Tours
          </Link>
          <Link href="/aboutUs" className="hover:text-blue-700 transition">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-blue-700 transition">
            Contact
          </Link>

          {/* Bookings */}
          {bookingCount > 0 && (
            <Link
              href="/bookings"
              className="relative text-sm hover:text-blue-700 transition"
            >
              Bookings
              <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-xs rounded-full px-1.5">
                {bookingCount}
              </span>
            </Link>
          )}

          {/* No auth: removed Clerk buttons and links */}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="px-2 py-1 border rounded"
          >
            {isMobileMenuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-6 py-2 hover:bg-gray-100 transition"
          >
            Home
          </Link>
          <Link
            href="/tours"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-6 py-2 hover:bg-gray-100 transition"
          >
            Tours
          </Link>
          <Link
            href="/aboutUs"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-6 py-2 hover:bg-gray-100 transition"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-6 py-2 hover:bg-gray-100 transition"
          >
            Contact
          </Link>
          {bookingCount > 0 && (
            <Link
              href="/bookings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-6 py-2 hover:bg-gray-100 transition relative"
            >
              Bookings
              <span className="absolute -top-1 -right-3 bg-blue-600 text-white text-xs rounded-full px-1.5">
                {bookingCount}
              </span>
            </Link>
          )}

          {/* No auth on mobile */}
        </div>
      )}
    </header>
  );
};

export default Navbar;
