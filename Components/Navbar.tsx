"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
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

        {/* Desktop Links + Auth */}
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

          {/* Auth Links */}
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonBox: "h-10 w-10",
                  userButtonTrigger: "h-10 w-10",
                  userButtonAvatarBox: "h-10 w-10",
                },
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>

          <SignedOut>
            <Link
              href="/auth/sign-in"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 transition"
            >
              Sign In
            </Link>
            <Link
              href="/auth/sign-up"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </SignedOut>
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

          {/* Auth Links for Mobile */}
          <SignedOut>
            <div className="px-6 py-3 border-t">
              <Link
                href="/auth/sign-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-center text-blue-600 hover:bg-blue-50 rounded transition"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 mt-2 text-center bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>
        </div>
      )}
    </header>
  );
};

export default Navbar;
