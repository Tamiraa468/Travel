import Image from "next/image";
import { Facebook, Instagram, Youtube, ShieldCheck } from "lucide-react";

import registrationCertificate from "../assets/burtgel.jpeg";
import tourismCertificate from "../assets/gerchilge.jpeg";
import partnerOneLogo from "../assets/travelmongolia.png";
import partnerTwoLogo from "../assets/viator.png";

const PartnersSection = () => {
  return (
    <section className="relative overflow-hidden border-y border-neutral-200 bg-white py-10 md:py-14">
      <div className="absolute inset-x-0 top-0 h-[3px] bg-[#2d4a3e]" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-center gap-2 lg:justify-start">
          <ShieldCheck className="h-4 w-4 text-[#2d4a3e]" strokeWidth={2.5} />
          <p className="text-[11px] font-semibold tracking-[0.25em] text-[#2d4a3e] uppercase">
            Trust & Credentials
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_0.9fr] lg:items-start lg:gap-12">

          <div className="text-center lg:text-left lg:border-r lg:border-neutral-200 lg:pr-12">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-neutral-500 uppercase">
              Officially registered
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <button
                type="button"
                className="group relative overflow-hidden rounded-md border border-neutral-200 bg-white p-1.5 transition-all hover:border-[#2d4a3e] hover:shadow-md"
                aria-label="View business registration certificate"
              >
                <Image
                  src={registrationCertificate}
                  alt="Business registration certificate"
                  className="h-24 w-auto object-contain"
                  sizes="160px"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-[10px] font-medium uppercase tracking-wider text-white opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                  View
                </span>
              </button>
              <button
                type="button"
                className="group relative overflow-hidden rounded-md border border-neutral-200 bg-white p-1.5 transition-all hover:border-[#2d4a3e] hover:shadow-md"
                aria-label="View tourism association certificate"
              >
                <Image
                  src={tourismCertificate}
                  alt="Tourism association certificate"
                  className="h-24 w-auto object-contain"
                  sizes="160px"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-[10px] font-medium uppercase tracking-wider text-white opacity-0 transition-all group-hover:bg-black/50 group-hover:opacity-100">
                  View
                </span>
              </button>
            </div>
            <p className="mt-3 text-[12px] text-neutral-500 lg:max-w-[280px]">
              Verified Mongolian tour operator · Member of Mongolian Tourism Association
            </p>
          </div>

          <div className="text-center lg:text-left lg:border-r lg:border-neutral-200 lg:pr-12">
            <p className="text-[12px] font-semibold tracking-[0.24em] text-neutral-500 uppercase">
              Trusted partners
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-8">
              <Image
                src={partnerOneLogo}
                alt="Travel Mongolia"
                className="h-16 w-auto object-contain opacity-90 transition-opacity hover:opacity-100"
                sizes="176px"
              />
              <Image
                src={partnerTwoLogo}
                alt="Viator"
                className="h-16 w-auto object-contain opacity-90 transition-opacity hover:opacity-100"
                sizes="176px"
              />
            </div>
            <p className="mt-5 text-[13px] leading-relaxed text-neutral-500 lg:max-w-[300px]">
              Listed on global marketplaces with verified supplier status
            </p>
          </div>

          <div className="text-center lg:text-left">
            <p className="text-[11px] font-semibold tracking-[0.22em] text-neutral-500 uppercase">
              Follow our journey
            </p>
            <div className="mt-5 flex items-center justify-center lg:justify-start gap-3">
              {[
                { icon: Facebook, label: "Facebook", href: "#" },
                { icon: Instagram, label: "Instagram", href: "#" },
                { icon: Youtube, label: "YouTube", href: "#" },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition-all hover:border-[#2d4a3e] hover:bg-[#2d4a3e] hover:text-white"
                >
                  <item.icon size={18} strokeWidth={1.8} />
                </a>
              ))}
            </div>
            <p className="mt-4 text-[12px] text-neutral-500">
              Daily photos, traveler stories & tour updates
            </p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PartnersSection;