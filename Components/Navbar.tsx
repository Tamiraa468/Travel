"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTravelAgencyContext } from "../context/TravelAgencyContext";
import { useLanguage } from "@/context/LanguageContext";
import { logo } from "@/lib/images";
import { Menu, X, Phone, ChevronDown } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const Navbar: React.FC = () => {
  const router = useRouter();
  const { bookingRequests } = useTravelAgencyContext();
  const { t } = useLanguage();
  const bookingCount = bookingRequests.length;

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const getFocusableDrawerElements = useCallback((): HTMLElement[] => {
    if (!mobileDrawerRef.current) return [];
    const selector =
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
    return Array.from(
      mobileDrawerRef.current.querySelectorAll<HTMLElement>(selector),
    ).filter((el) => !el.hasAttribute("disabled") && el.tabIndex !== -1);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const html = document.documentElement;
    const body = document.body;
    const previousStyles = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      bodyOverscrollBehavior: body.style.overscrollBehavior,
      bodyTouchAction: body.style.touchAction,
    };

    const scrollbarWidth = window.innerWidth - html.clientWidth;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    body.style.touchAction = "none";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    const rafId = window.requestAnimationFrame(() => {
      const focusable = getFocusableDrawerElements();
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        mobileDrawerRef.current?.focus();
      }
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMobileMenu();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableDrawerElements();
      if (focusable.length === 0) {
        event.preventDefault();
        mobileDrawerRef.current?.focus();
        return;
      }

      const firstElement = focusable[0];
      const lastElement = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (
          !activeElement ||
          activeElement === firstElement ||
          !mobileDrawerRef.current?.contains(activeElement)
        ) {
          event.preventDefault();
          lastElement.focus();
        }
        return;
      }

      if (activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(rafId);
      document.removeEventListener("keydown", handleKeyDown);

      html.style.overflow = previousStyles.htmlOverflow;
      body.style.overflow = previousStyles.bodyOverflow;
      body.style.paddingRight = previousStyles.bodyPaddingRight;
      html.style.overscrollBehavior = previousStyles.htmlOverscrollBehavior;
      body.style.overscrollBehavior = previousStyles.bodyOverscrollBehavior;
      body.style.touchAction = previousStyles.bodyTouchAction;

      mobileMenuButtonRef.current?.focus();
    };
  }, [closeMobileMenu, getFocusableDrawerElements, isMobileMenuOpen]);

  const navLinks = [
    { href: "/", label: t.common.home },
    { href: "/tours", label: t.common.tours },
    {
      href: "/about",
      label: t.common.about,
      dropdown: [
        { href: "/about", label: t.common.aboutUs },
        { href: "/why-mongolia", label: t.common.whyMongolia },
        { href: "/travel-guide", label: t.common.travelGuide },
      ],
    },
    { href: "/blog", label: t.common.blog },
    { href: "/contact", label: t.common.contact },
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
              isScrolled ? "text-stone" : "text-ivory/80"
            }`}
          >
            <a
              href="tel:+97689475188"
              className="flex items-center gap-2 hover:text-gold-300 transition"
            >
              <Phone size={14} />
              +976 8947-5188
            </a>
            <span>|</span>
            <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
          </div>
          <div
            className={`flex items-center gap-4 text-sm ${
              isScrolled ? "text-stone" : "text-ivory/80"
            }`}
          >
            <Link href="/faq" className="hover:text-gold-300 transition">
              {t.common.faq}
            </Link>
            <span>|</span>
            <Link href="/wishlist" className="hover:text-gold-300 transition">
              {t.common.wishlist}
            </Link>
            <span>|</span>
            <LanguageSwitcher variant="compact" isScrolled={isScrolled} />
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
              src={logo.src}
              alt={logo.alt}
              width={50}
              height={50}
              className="rounded-full ring-2 ring-gold-500/30 group-hover:ring-gold-500 transition-all duration-300"
            />
            <div className="absolute -inset-1 bg-gold-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="flex flex-col">
            <span
              className={`font-playfair text-xl font-semibold tracking-wide transition-colors duration-300 ${
                isScrolled ? "text-forest-900" : "text-ivory"
              }`}
            >
              Maralgoo Dreamland
            </span>
            <span
              className={`text-xs tracking-[0.2em] uppercase ${
                isScrolled ? "text-gold-500" : "text-gold-300"
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
                    ? "text-forest-700 hover:text-gold-500"
                    : "text-ivory/90 hover:text-gold-300"
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
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold-500 transition-all duration-300 group-hover:w-full" />
              </Link>

              {/* Dropdown */}
              {link.dropdown && activeDropdown === link.label && (
                <div className="absolute top-full left-0 pt-2 min-w-[200px]">
                  <div className="bg-white rounded-xl shadow-xl border border-sand overflow-hidden">
                    {link.dropdown.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-5 py-3 text-sm text-charcoal hover:bg-gold-500/10 hover:text-gold-700 transition-colors"
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
                isScrolled ? "text-forest-700" : "text-ivory"
              }`}
            >
              Bookings
              <span className="bg-gold-500 text-forest-900 text-xs px-2 py-0.5 rounded-full">
                {bookingCount}
              </span>
            </Link>
          )}

          <Link
            href="/request-info"
            className={`hidden md:inline-flex items-center px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
              isScrolled
                ? "bg-gold-500 text-forest-900 hover:bg-gold-300 shadow-lg hover:shadow-gold-500/30"
                : "bg-ivory/10 backdrop-blur-sm text-ivory border border-ivory/30 hover:bg-ivory hover:text-forest-900"
            }`}
          >
            {t.tours.requestInfo}
          </Link>

          {/* Language Switcher - always visible on desktop */}
          <div className="hidden lg:block">
            <LanguageSwitcher variant="compact" isScrolled={isScrolled} />
          </div>

          {/* Mobile Menu Toggle */}
          <button
            ref={mobileMenuButtonRef}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? "text-forest-700 hover:bg-sand"
                : "text-ivory hover:bg-ivory/10"
            }`}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu-drawer"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-[70] lg:hidden"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />

          <div
            id="mobile-menu-drawer"
            ref={mobileDrawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            tabIndex={-1}
            className="fixed top-0 right-0 h-dvh w-[85%] max-w-sm bg-white z-[80] lg:hidden overflow-y-auto overscroll-contain touch-pan-y overflow-x-hidden shadow-2xl"
          >
            <div className="flex min-h-full flex-col">
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-sand bg-white px-5 py-4">
                <p className="text-sm font-semibold tracking-[0.14em] uppercase text-forest-900">
                  Menu
                </p>
                <button
                  onClick={closeMobileMenu}
                  className="rounded-lg p-2 text-forest-700 hover:bg-sand transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="flex-1 px-5 py-4">
                {navLinks.map((link, index) => (
                  <div key={link.href} className="border-b border-sand/80">
                    <Link
                      href={link.href}
                      onClick={closeMobileMenu}
                      className="block py-4 text-lg font-medium text-forest-900 hover:text-gold-500 transition-colors"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {link.label}
                    </Link>
                    {link.dropdown && (
                      <div className="space-y-2 pb-4 pl-4">
                        {link.dropdown.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={closeMobileMenu}
                            className="block py-2 text-sm text-stone hover:text-gold-500 transition-colors"
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
                    onClick={closeMobileMenu}
                    className="block py-3 text-center text-forest-700 hover:text-gold-500 transition-colors"
                  >
                    {t.common.faq}
                  </Link>
                  <Link
                    href="/wishlist"
                    onClick={closeMobileMenu}
                    className="block py-3 text-center text-forest-700 hover:text-gold-500 transition-colors"
                  >
                    {t.common.wishlist}
                  </Link>
                  <div className="flex justify-center border-t border-sand pt-4">
                    <LanguageSwitcher variant="default" isScrolled={true} />
                  </div>
                </div>
              </div>

              <div className="border-t border-sand p-5">
                <Link
                  href="/request-info"
                  onClick={closeMobileMenu}
                  className="block w-full rounded-xl bg-gold-500 py-4 text-center font-semibold text-forest-900 hover:bg-gold-300 transition-colors"
                >
                  {t.tours.requestInfo}
                </Link>
                <a
                  href="tel:+97689475188"
                  className="mt-4 block py-3 text-center text-forest-700 hover:text-gold-500 transition-colors"
                >
                  <Phone size={16} className="mr-2 inline" />
                  +976 8947-5188
                </a>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Navbar;
