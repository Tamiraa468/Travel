"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  MessageCircle,
  Twitter,
  Youtube,
} from "lucide-react";

type SocialLinks = {
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  whatsappNumber?: string | null;
  twitterUrl?: string | null;
  youtubeUrl?: string | null;
};

type Props = {
  links: SocialLinks;
  size?: "sm" | "md" | "lg";
  showLabels?: boolean;
  className?: string;
};

export default function SocialMediaLinks({
  links,
  size = "md",
  showLabels = false,
  className = "",
}: Props) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const socialLinks = [
    {
      name: "Facebook",
      url: links.facebookUrl,
      icon: Facebook,
      color: "hover:bg-blue-600",
      hoverColor: "group-hover:text-blue-600",
    },
    {
      name: "Instagram",
      url: links.instagramUrl,
      icon: Instagram,
      color:
        "hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-600 hover:to-orange-500",
      hoverColor: "group-hover:text-pink-600",
    },
    {
      name: "WhatsApp",
      url: links.whatsappNumber
        ? `https://wa.me/${links.whatsappNumber.replace(/[^0-9]/g, "")}`
        : null,
      icon: MessageCircle,
      color: "hover:bg-green-500",
      hoverColor: "group-hover:text-green-500",
    },
    {
      name: "Twitter",
      url: links.twitterUrl,
      icon: Twitter,
      color: "hover:bg-sky-500",
      hoverColor: "group-hover:text-sky-500",
    },
    {
      name: "YouTube",
      url: links.youtubeUrl,
      icon: Youtube,
      color: "hover:bg-red-600",
      hoverColor: "group-hover:text-red-600",
    },
  ].filter((link) => link.url);

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url!}
          target="_blank"
          rel="noopener noreferrer"
          className={`group ${sizeClasses[size]} rounded-full bg-gray-100 flex items-center justify-center transition-all duration-300 ${social.color} hover:text-white`}
          aria-label={social.name}
        >
          <social.icon
            className={`${iconSizes[size]} text-gray-600 group-hover:text-white transition-colors`}
          />
        </a>
      ))}
    </div>
  );
}
