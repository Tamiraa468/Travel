"use client";

import React from "react";
import { logo } from "@/lib/images";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
  Facebook,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Youtube,
  Send,
  ArrowRight,
} from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer className="relative bg-forest-900 text-ivory overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute top-0 left-0 w-full h-full bg-repeat"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='10' cy='10' r='1.5' fill='%23D4A853'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      {/* Gold Accent Line */}
      <div className="h-1 bg-gradient-to-r from-gold-700 via-gold-500 to-gold-700" />

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Image
                  className="w-14 h-14 rounded-full ring-2 ring-gold-500/30"
                  src={logo.src}
                  alt={logo.alt}
                  width={56}
                  height={56}
                />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold !text-ivory">
                  Maralgoo
                </h2>
                <span className="text-xs tracking-[0.2em] uppercase text-gold-500">
                  Dreamland Travel
                </span>
              </div>
            </div>

            <p className="text-ivory/70 leading-relaxed mb-6">
              {t.footer.description}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center text-ivory/70 hover:bg-gold-500 hover:text-forest-900 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center text-ivory/70 hover:bg-gold-500 hover:text-forest-900 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center text-ivory/70 hover:bg-gold-500 hover:text-forest-900 transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold !text-ivory mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold-500" />
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: t.common.home },
                { href: "/tours", label: t.common.tours },
                { href: "/about", label: t.common.aboutUs },
                { href: "/contact", label: t.common.contact },
                { href: "/blog", label: t.common.blog },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-ivory/70 hover:text-gold-500 transition-colors"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="text-lg font-semibold !text-ivory mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold-500" />
              {t.footer.explore}
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/why-mongolia", label: t.common.whyMongolia },
                { href: "/travel-guide", label: t.common.travelGuide },
                { href: "/faq", label: t.common.faq },
                { href: "/wishlist", label: t.common.wishlist },
                { href: "/request-info", label: t.tours.requestInfo },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-ivory/70 hover:text-gold-500 transition-colors"
                  >
                    <ArrowRight
                      size={14}
                      className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-gold-500" />
              <span className="!text-ivory">{t.footer.getInTouch}</span>
            </h3>

            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href="tel:+97689475188"
                  className="flex items-center gap-3 text-ivory/70 hover:text-gold-500 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center">
                    <Phone size={16} className="text-gold-500" />
                  </div>
                  +976 8947-5188
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@maralgoodreamland.com"
                  className="flex items-center gap-3 text-ivory/70 hover:text-gold-500 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center">
                    <Mail size={16} className="text-gold-500" />
                  </div>
                  info@maralgoodreamland.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-ivory/70">
                <div className="w-10 h-10 rounded-full bg-forest-700 flex items-center justify-center">
                  <MapPin size={16} className="text-gold-500" />
                </div>
                Ulaanbaatar, Mongolia
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-medium !text-ivory mb-3">
                {t.footer.newsletter}
              </h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder={t.footer.newsletterPlaceholder}
                  className="flex-1 px-4 py-3 bg-forest-700 text-ivory text-sm rounded-l-lg border border-forest-500 focus:outline-none focus:border-gold-500 placeholder-ivory/50"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-gold-500 text-forest-900 rounded-r-lg hover:bg-gold-300 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-forest-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-ivory/50">
              © 2025 Maralgoo Dreamland Travel. {t.footer.allRightsReserved}
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-ivory/50">
              <Link href="#" className="hover:text-gold-500 transition-colors">
                {t.footer.privacyPolicy}
              </Link>
              <Link href="#" className="hover:text-gold-500 transition-colors">
                {t.footer.termsOfService}
              </Link>
              <Link href="#" className="hover:text-gold-500 transition-colors">
                {t.footer.cookiePolicy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
