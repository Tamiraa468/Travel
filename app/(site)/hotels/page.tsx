import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import { BedDouble, Star, MapPin, ExternalLink, Award, Building2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mongolia Hotels — Top-Rated Stays | Maralgoo Dreamland",
  description:
    "Browse Mongolia's top-rated hotels: 5-star, 4-star and 3-star options across Ulaanbaatar and the provinces. Compiled from the official Tourist Information Center registry.",
  alternates: { canonical: "/hotels" },
  openGraph: {
    title: "Mongolia Hotels — Top-Rated Stays",
    description:
      "Top-rated hotels in Mongolia ranked by official star classification.",
    url: "/hotels",
  },
};

type Hotel = {
  mn: string;
  en: string;
  stars: number;
  city: string;
};

const mapsUrl = (h: Hotel) =>
  `https://www.google.com/maps/search/${encodeURIComponent(`${h.en} ${h.city} Mongolia`)}`;
const searchUrl = (h: Hotel) =>
  `https://www.google.com/search?q=${encodeURIComponent(`${h.en} ${h.city} Mongolia booking`)}`;

const hotels: Hotel[] = [
  // 5-star
  { mn: "Бест вестерн пример Туушин", en: "Best Western Premier Tuushin", stars: 5, city: "Ulaanbaatar" },
  { mn: "Блю скай", en: "Blue Sky Hotel", stars: 5, city: "Ulaanbaatar" },
  { mn: "Их Хорум", en: "Ikh Khorum", stars: 5, city: "Ulaanbaatar" },
  { mn: "Кемпинский", en: "Kempinski Hotel Khan Palace", stars: 5, city: "Ulaanbaatar" },
  { mn: "Корпорайт 2", en: "Corporate Hotel & Convention Center", stars: 5, city: "Ulaanbaatar" },
  { mn: "Тэрэлж", en: "Terelj Hotel", stars: 5, city: "Terelj"},
  { mn: "Улаанбаатар", en: "Ulaanbaatar Hotel", stars: 5, city: "Ulaanbaatar" },
  { mn: "Шангри-ла", en: "Shangri-La Hotel", stars: 5, city: "Ulaanbaatar" },
  // 4-star
  { mn: "Баянгол", en: "Bayangol Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "Золо стар", en: "Zolo Star Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "Кёкүшю зочид буудал", en: "Kyokushu Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "Корпорайт 1", en: "Corporate Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "Парк", en: "Park Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "Платинум", en: "Platinum Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "Рамада", en: "Ramada Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "Спрингс", en: "Springs Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "Сүнжингранд", en: "Sunjingrand Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "УБ сити", en: "UB City Hotel", stars: 4, city: "Ulaanbaatar" },
  { mn: "Чингис хаан", en: "Chinggis Khaan Hotel", stars: 4, city: "Ulaanbaatar" },
  // 3-star
  { mn: "Ангара", en: "Angara Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Атлас", en: "Atlas Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Бишрэлт", en: "Bishrelt Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Вайт хаус", en: "White House Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Вояж", en: "Voyage Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Декор", en: "Decor Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Дипломат", en: "Diplomat Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Залуучууд", en: "Zaluuchuud Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Континентал", en: "Continental Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Корпорайт 3", en: "Corporate Hotel & Nukht Resort", stars: 3, city: "Ulaanbaatar" },
  { mn: "Маргад", en: "Margad Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Миами", en: "Miami Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Мика", en: "Mika Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Мишээл", en: "Michelle Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Монголика", en: "Mongolica Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Чингис", en: "Chinggis Hotel", stars: 3, city: "Murun" },
  { mn: "Н9 Сэлэнгэ", en: "H9 Selenge", stars: 3, city: "Selenge" },
  { mn: "Н9 УБ", en: "H9 UB Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Намуун", en: "Namuun Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Нарантуул", en: "Narantuul Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Нью Вест", en: "New West Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Нью Ворлд", en: "New World Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Пийс Бриж", en: "Peace Bridge Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Пума Империал", en: "Puma Imperial Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Рояал Хаус", en: "Royal House Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Сэнтий", en: "Sentii Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Хүннү Палас", en: "Khunnu Palace Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Эзэнт Гүрэн", en: "Ezent Guren Hotel", stars: 3, city: "Khentii" },
  { mn: "Цэцэг", en: "Flower Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Эвергрийн", en: "Evergreen Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Эдельвайс", en: "Edelweiss Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Эпос", en: "Epos Hotel", stars: 3, city: "Ulaanbaatar" },
  { mn: "Эрдэнэт Инн", en: "Erdenet Inn Hotel", stars: 3, city: "Erdenet" },
];

const hotelsByStars = (n: number) => hotels.filter((h) => h.stars === n);

// Brand-recognizable hotels get a featured gradient/accent
const featuredAccent: Record<string, string> = {
  "Кемпинский": "from-amber-700 via-amber-600 to-yellow-500",
  "Шангри-ла": "from-rose-700 via-rose-600 to-amber-500",
  "Блю скай": "from-sky-700 via-sky-500 to-cyan-400",
  "Бест вестерн пример Туушин": "from-blue-800 via-indigo-700 to-blue-500",
  "Их Хорум": "from-emerald-700 via-emerald-600 to-teal-500",
  "Корпорайт 2": "from-slate-800 via-slate-700 to-slate-500",
  "Тэрэлж": "from-green-800 via-green-600 to-lime-500",
  "Улаанбаатар": "from-red-800 via-red-700 to-orange-500",
};

export default function HotelsPage() {
  const fiveStar = hotelsByStars(5);
  const fourStar = hotelsByStars(4);
  const threeStar = hotelsByStars(3);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-forest-900 to-forest-700 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center text-white">
            <BedDouble className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Top-Rated Hotels in Mongolia
            </h1>
            <p className="text-xl text-gold-300 max-w-3xl mx-auto">
              Officially star-classified hotels across Ulaanbaatar and the
              provinces — the most comfortable choices for your journey.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm">
              <Stat label="5-Star" value={fiveStar.length} />
              <Stat label="4-Star" value={fourStar.length} />
              <Stat label="3-Star" value={threeStar.length} />
              <Stat label="Total" value={hotels.length} />
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-lg text-charcoal leading-relaxed text-center">
            The hotels listed below are sourced from the official{" "}
            <a
              href="https://www.touristinfocenter.mn/cate21.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="text-forest-700 underline hover:text-forest-900"
            >
              Mongolia Tourist Information Center
            </a>
            {" "}registry and ranked by star classification. The highest-rated
            5-star properties appear first.
          </p>
        </section>

        {/* 5-star featured */}
        <section className="max-w-7xl mx-auto px-6 pb-16">
          <SectionHeader
            icon={<Award className="w-8 h-8 text-gold-500" />}
            title="5-Star Luxury Hotels"
            subtitle="International brands and Mongolia's highest-rated stays"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiveStar.map((h) => (
              <FeaturedHotelCard key={h.en} hotel={h} />
            ))}
          </div>
        </section>

        {/* 4-star */}
        <section className="bg-sand py-16">
          <div className="max-w-7xl mx-auto px-6">
            <SectionHeader
              icon={<Star className="w-8 h-8 text-gold-500 fill-gold-500" />}
              title="4-Star Hotels"
              subtitle="Quality service and excellent locations"
              dark
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {fourStar.map((h) => (
                <HotelCard key={h.en} hotel={h} />
              ))}
            </div>
          </div>
        </section>

        {/* 3-star */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <SectionHeader
            icon={<Building2 className="w-8 h-8 text-gold-500" />}
            title="3-Star Hotels"
            subtitle="Comfortable, mid-range stays"
          />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {threeStar.map((h) => (
              <CompactHotelCard key={h.en} hotel={h} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-gold-500 to-gold-600 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let&apos;s Plan Your Mongolia Trip Together
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Book your hotel, tour itinerary, and transport in one place — and
              enjoy the most comfortable journey across the Land of the Eternal
              Blue Sky.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/tours"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-forest-900 font-semibold rounded-lg hover:bg-sand transition-colors"
              >
                Browse Tours
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-forest-900 text-white font-semibold rounded-lg hover:bg-forest-700 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white/10 border border-white/20 rounded-lg px-5 py-3">
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-gold-200 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
  subtitle,
  dark = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  dark?: boolean;
}) {
  return (
    <div className="mb-10">
      <h2
        className={`text-3xl font-bold flex items-center gap-3 ${
          dark ? "text-forest-900" : "text-forest-900"
        }`}
      >
        {icon}
        {title}
      </h2>
      <p className="text-charcoal mt-2">{subtitle}</p>
    </div>
  );
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-gold-500 text-gold-500"
        />
      ))}
    </div>
  );
}

function FeaturedHotelCard({ hotel }: { hotel: Hotel }) {
  const accent =
    featuredAccent[hotel.mn] ?? "from-forest-900 via-forest-800 to-forest-600";
  return (
    <div className="group bg-white border border-stone/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      <a
        href={mapsUrl(hotel)}
        target="_blank"
        rel="noopener noreferrer"
        className={`relative h-44 bg-gradient-to-br ${accent} flex items-center justify-center`}
      >
        <BedDouble className="w-16 h-16 text-white/30" />
        <div className="absolute top-3 right-3 bg-gold-500 text-forest-900 rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
          <Star className="w-3 h-3 fill-forest-900" />
          {hotel.stars}.0
        </div>
        <div className="absolute bottom-3 left-3 bg-white/95 rounded-md px-2 py-1 text-xs font-medium text-forest-900 flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {hotel.city}
        </div>
      </a>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-forest-900">{hotel.en}</h3>
        <p className="text-sm text-stone mt-0.5">{hotel.mn}</p>
        <div className="mt-3">
          <StarRow count={hotel.stars} />
        </div>
        <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
          <a
            href={mapsUrl(hotel)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-forest-900 text-white text-xs font-semibold rounded-lg hover:bg-forest-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5" /> View on Map
          </a>
          <a
            href={searchUrl(hotel)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gold-500 text-forest-900 text-xs font-semibold rounded-lg hover:bg-gold-400 transition-colors"
          >
            Book Now <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}

function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <a
      href={mapsUrl(hotel)}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white border border-stone/20 rounded-xl overflow-hidden hover:border-gold-500 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div className="relative h-32 bg-gradient-to-br from-forest-700 via-forest-600 to-forest-500 flex items-center justify-center">
        <BedDouble className="w-10 h-10 text-white/40" />
        <div className="absolute top-2 right-2 bg-white/95 rounded-full px-2 py-0.5 text-xs font-bold text-forest-900 flex items-center gap-1">
          <Star className="w-3 h-3 fill-gold-500 text-gold-500" />
          {hotel.stars}.0
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-base font-bold text-forest-900 group-hover:text-gold-600 transition-colors line-clamp-1">
          {hotel.en}
        </h3>
        <p className="text-xs text-stone mt-0.5 line-clamp-1">{hotel.mn}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-stone">
          <MapPin className="w-3 h-3" />
          {hotel.city}
        </div>
        <div className="mt-3 pt-3 border-t border-stone/15 flex items-center justify-between">
          <StarRow count={hotel.stars} />
          <ExternalLink className="w-3.5 h-3.5 text-stone group-hover:text-gold-600 transition-colors" />
        </div>
      </div>
    </a>
  );
}

function CompactHotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <a
      href={mapsUrl(hotel)}
      target="_blank"
      rel="noopener noreferrer"
      className="group bg-white border border-stone/20 rounded-lg p-4 hover:border-forest-700 hover:shadow-sm transition-all duration-300 flex flex-col"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-forest-900 group-hover:text-gold-600 transition-colors line-clamp-1">
            {hotel.en}
          </h3>
          <p className="text-xs text-stone mt-0.5 line-clamp-1">{hotel.mn}</p>
        </div>
        <BedDouble className="w-5 h-5 text-forest-600 shrink-0" />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <StarRow count={hotel.stars} />
        <span className="text-xs text-stone inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {hotel.city}
        </span>
      </div>
    </a>
  );
}
