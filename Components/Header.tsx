"use client";

import Link from "next/link";
import Image from "next/image";
import { logo } from "@/lib/images";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/tours", label: t.common.tours },
    { href: "/aboutUs", label: t.common.aboutUs },
    { href: "/why-mongolia", label: t.common.whyMongolia },
    { href: "/blog", label: t.common.blog },
    { href: "/contact", label: t.common.contact },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-forest-900 shadow-lg"
          : "bg-forest-900/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Image
              className="w-12 h-12 rounded-full ring-2 ring-gold-500/30 group-hover:ring-gold-500/60 transition-all"
              src={logo.src}
              alt={logo.alt}
              width={48}
              height={48}
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-serif font-semibold !text-ivory">
              Maralgoo
            </h1>
            <span className="text-xs tracking-[0.15em] uppercase text-gold-500">
              Dreamland Travel
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-ivory/90 hover:text-gold-300 text-sm font-medium tracking-wide transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gold-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/request-info"
            className="px-6 py-2.5 bg-gold-500 text-forest-900 rounded-full font-semibold text-sm hover:bg-gold-300 transition-all duration-300 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/30"
          >
            {t.tours.requestInfo}
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 text-ivory hover:text-gold-300 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-forest-900 border-t border-forest-700">
          <nav className="flex flex-col px-6 py-4 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-ivory/90 hover:text-gold-300 text-base font-medium py-2 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/request-info"
              onClick={() => setIsMobileMenuOpen(false)}
              className="mt-2 px-6 py-3 bg-gold-500 text-forest-900 rounded-full font-semibold text-center hover:bg-gold-300 transition-all"
            >
              {t.tours.requestInfo}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
