import Image from "next/image";
import { partnerLogos } from "@/lib/images";

const PartnersSection = () => {
  return (
    <section className="relative py-20 bg-sand/60 border-y border-sand overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="inline-flex items-center px-4 py-2 bg-gold-500/10 text-gold-700 text-xs md:text-sm font-medium rounded-full tracking-wide uppercase">
            Trusted Network
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 mt-5 mb-4">
            Our Partner Brands
          </h2>
          <p className="max-w-2xl mx-auto text-stone leading-relaxed">
            Example partner logos you can replace later with your real
            collaborators.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {partnerLogos.map((partner) => (
            <div
              key={partner.alt}
              className="group bg-white border border-sand rounded-2xl min-h-[148px] px-5 py-6 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-300"
            >
              <Image
                src={partner.src}
                alt={partner.alt}
                width={partner.width}
                height={partner.height}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="h-16 w-auto opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
