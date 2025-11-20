import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-600 border-t border-gray-300">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row items-start justify-between px-6 md:px-16 lg:px-32 gap-10 py-14">
        {/* Logo & About */}
        <div className="w-full md:w-1/3">
          <div className="flex items-center gap-2">
            <Image
              className="w-12 h-12 rounded-full"
              src={assets.logo}
              alt="Mongolia Travel Logo"
            />
            <h2 className="text-xl font-semibold text-blue-800">
              Mongolia Travel
            </h2>
          </div>
          <p className="mt-5 text-sm leading-6 text-gray-600">
            Discover the wild beauty of Mongolia — from vast steppes and ancient
            temples to the warmth of nomadic hospitality. Your unforgettable
            adventure begins here.
          </p>
          <div className="flex items-center gap-4 mt-5">
            <a
              href="#"
              className="hover:text-blue-800 transition"
              aria-label="Facebook"
            >
              <Facebook size={20} />
            </a>
            <a
              href="#"
              className="hover:text-blue-800 transition"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="mailto:info@mongoliatravel.com"
              className="hover:text-blue-800 transition"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="w-full md:w-1/3">
          <h2 className="font-semibold text-gray-800 mb-4">Quick Links</h2>
          <ul className="text-sm space-y-2">
            <li>
              <a className="hover:text-blue-800 transition" href="#">
                Home
              </a>
            </li>
            <li>
              <a className="hover:text-blue-800 transition" href="#">
                Tours
              </a>
            </li>
            <li>
              <a className="hover:text-blue-800 transition" href="#">
                About Us
              </a>
            </li>
            <li>
              <a className="hover:text-blue-800 transition" href="#">
                Contact
              </a>
            </li>
            <li>
              <a className="hover:text-blue-800 transition" href="#">
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="w-full md:w-1/3">
          <h2 className="font-semibold text-gray-800 mb-4">Get in Touch</h2>
          <ul className="text-sm space-y-3">
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-blue-800" />
              <span>+976-9999-8888</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-blue-800" />
              <span>info@mongoliatravel.mn</span>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-800" />
              <span>Ulaanbaatar, Mongolia</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <p className="py-4 text-center text-xs md:text-sm text-gray-500 border-t border-gray-200">
        © 2025 Mongolia Travel. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
