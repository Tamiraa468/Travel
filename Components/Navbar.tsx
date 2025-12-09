"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTravelAgencyContext } from "../context/TravelAgencyContext";
import { assets } from "../assets/assets";
import { Menu, X, Phone, ChevronDown } from "lucide-react";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { bookingRequests } = useTravelAgencyContext();
  const bookingCount = bookingRequests.length;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tours", label: "Tours" },
    {
      href: "/about",
      label: "About",
      dropdown: [
        { href: "/about", label: "About Us" },
        { href: "/why-mongolia", label: "Why Mongolia" },
        { href: "/travel-guide", label: "Travel Guide" },
      ],
    },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg py-2"
          : "bg-transparent py-4"
      }`}
    >
      {/* Top Bar - Hidden on scroll */}
      <div
        className={`hidden lg:block border-b border-white/10 transition-all duration-300 ${
          isScrolled
            ? "h-0 opacity-0 overflow-hidden"
            : "h-auto opacity-100 pb-2 mb-2"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div
            className={`flex items-center gap-6 text-sm ${
              isScrolled ? "text-gray-600" : "text-white/80"
            }`}
          >
            <a
              href="tel:+97699998888"
              className="flex items-center gap-2 hover:text-amber-400 transition"
            >
              <Phone size={14} />
              +976 9999-8888
            </a>
            <span>|</span>
            <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
          </div>
          <div
            className={`flex items-center gap-4 text-sm ${
              isScrolled ? "text-gray-600" : "text-white/80"
            }`}
          >
            <Link href="/faq" className="hover:text-amber-400 transition">
              FAQ
            </Link>
            <span>|</span>
            <Link href="/wishlist" className="hover:text-amber-400 transition">
              Wishlist
            </Link>
          </div>
        </div>
      </div>

      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <Image
              src={assets.logo}
              alt="Mongolia Travel"
              width={50}
              height={50}
              className="rounded-full ring-2 ring-amber-500/30 group-hover:ring-amber-500 transition-all duration-300"
            />
            <div className="absolute -inset-1 bg-amber-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-serif text-xl font-semibold tracking-wide transition-colors duration-300 ${
                isScrolled ? "text-slate-800" : "text-white"
              }`}
            >
              Mongolia
            </span>
            <span
              className={`text-xs tracking-[0.2em] uppercase ${
                isScrolled ? "text-amber-600" : "text-amber-400"
              }`}
            >
              Travel
            </span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.href}
              className="relative"
              onMouseEnter={() =>
                link.dropdown && setActiveDropdown(link.label)
              }
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className={`relative px-5 py-2 text-sm font-medium tracking-wide transition-all duration-300 flex items-center gap-1 ${
                  isScrolled
                    ? "text-slate-700 hover:text-amber-600"
                    : "text-white/90 hover:text-amber-400"
                }`}
              >
                {link.label}
                {link.dropdown && (
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      activeDropdown === link.label ? "rotate-180" : ""
                    }`}
                  />
                )}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-amber-500 transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Dropdown */}
              {link.dropdown && activeDropdown === link.label && (
                <div className="absolute top-full left-0 pt-2 min-w-[200px]">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm text-slate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button & Mobile Toggle */}
        <div className="flex items-center gap-4">
          {bookingCount > 0 && (
            <Link
              href="/bookings"
              className={`hidden md:flex items-center gap-2 text-sm font-medium transition-colors ${
                isScrolled ? "text-slate-700" : "text-white"
              }`}
            >
              Bookings
              <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                {bookingCount}
              </span>
            </Link>
          )}

          <Link
            href="/request-info"
            className={`hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
              isScrolled
                ? "bg-amber-500 text-white hover:bg-amber-600 shadow-lg hover:shadow-amber-500/30"
                : "bg-white/10 backdrop-blur-sm text-white border border-white/30 hover:bg-white hover:text-slate-800"
            }`}
          >
            Request Info
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-slate-700 hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed inset-0 top-[72px] bg-white z-40 transition-all duration-500 ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6 px-6">
            {navLinks.map((link, index) => (
              <div key={link.href} className="border-b border-gray-100">
                <Link
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-4 text-lg font-medium text-slate-800 hover:text-amber-600 transition-colors"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.label}
                </Link>
                {link.dropdown && (
                  <div className="pb-4 pl-4 space-y-2">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block py-2 text-sm text-gray-600 hover:text-amber-600 transition-colors"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="mt-6 space-y-3">
              <Link
                href="/faq"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-center text-slate-600 hover:text-amber-600 transition-colors"
              >
                FAQ
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 text-center text-slate-600 hover:text-amber-600 transition-colors"
              >
                Wishlist
              </Link>
            </div>
          </div>

          <div className="p-6 border-t border-gray-100">
            <Link
              href="/request-info"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block w-full py-4 bg-amber-500 text-white text-center rounded-xl font-semibold hover:bg-amber-600 transition-colors"
            >
              Request Info
            </Link>
            <a
              href="tel:+97699998888"
              className="block mt-4 py-3 text-center text-slate-600 hover:text-amber-600 transition-colors"
            >
              <Phone size={16} className="inline mr-2" />
              +976 9999-8888
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
