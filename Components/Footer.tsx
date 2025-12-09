"use client";

import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
  return (
    <footer className="relative bg-slate-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/pattern.svg')] bg-repeat" />
      </div>

      {/* Gold Accent Line */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Image
                  className="w-14 h-14 rounded-full ring-2 ring-amber-500/30"
                  src={assets.logo}
                  alt="Mongolia Travel Logo"
                  width={56}
                  height={56}
                />
              </div>
              <div>
                <h2 className="text-xl font-serif font-semibold text-white">
                  Mongolia
                </h2>
                <span className="text-xs tracking-[0.2em] uppercase text-amber-400">
                  Travel
                </span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed mb-6">
              Discover the wild beauty of Mongolia — from vast steppes and
              ancient temples to the warmth of nomadic hospitality. Your
              unforgettable adventure begins here.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-amber-500 hover:text-white transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-amber-500" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/", label: "Home" },
                { href: "/tours", label: "Tours" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
                { href: "/blog", label: "Blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
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
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-8 h-0.5 bg-amber-500" />
              Explore
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/why-mongolia", label: "Why Mongolia" },
                { href: "/travel-guide", label: "Travel Guide" },
                { href: "/faq", label: "FAQ" },
                { href: "/wishlist", label: "My Wishlist" },
                { href: "/request-info", label: "Request Info" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors"
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
              <span className="w-8 h-0.5 bg-amber-500" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-amber-200">
                Get in Touch
              </span>
            </h3>

            <ul className="space-y-4 mb-8">
              <li>
                <a
                  href="tel:+97699998888"
                  className="flex items-center gap-3 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <Phone size={16} className="text-amber-500" />
                  </div>
                  +976 9999-8888
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@mongoliatravel.mn"
                  className="flex items-center gap-3 text-slate-400 hover:text-amber-400 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                    <Mail size={16} className="text-amber-500" />
                  </div>
                  info@mongoliatravel.mn
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-400">
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
                  <MapPin size={16} className="text-amber-500" />
                </div>
                Ulaanbaatar, Mongolia
              </li>
            </ul>

            {/* Newsletter */}
            <div>
              <h4 className="text-sm font-medium text-white mb-3">
                Subscribe to Newsletter
              </h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-3 bg-slate-800 text-white text-sm rounded-l-lg border border-slate-700 focus:outline-none focus:border-amber-500 placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-amber-500 text-white rounded-r-lg hover:bg-amber-600 transition-colors"
                >
                  <Send size={18} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">
              © 2025 Mongolia Travel. All Rights Reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
              <Link href="#" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-amber-400 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
