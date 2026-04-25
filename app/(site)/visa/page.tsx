import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import {
  FileText,
  AlertCircle,
  CheckCircle2,
  Globe2,
  Mail,
  Clock,
  RefreshCw,
  ExternalLink,
  Briefcase,
  GraduationCap,
  Users,
  Plane,
  Heart,
  Building2,
  Landmark,
} from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mongolia Visa Information for Travelers",
  description:
    "Complete 2026 guide to Mongolia visa requirements: visa-free countries, e-visa (evisa.mn), all visa types (A/B/C/E/F/G/H/J/K), validity, extension fees, and entry rules.",
  alternates: {
    canonical: "/visa",
  },
  openGraph: {
    title: "Mongolia Visa Information for Travelers - Maralgoo Dreamland",
    description:
      "Find out if you need a visa to visit Mongolia. Updated 2026 list of visa-free countries, e-visa info, all visa categories, and entry requirements.",
    url: "/visa",
  },
};

// ---------------------- Visa-Exempt Countries (source: consul.mn / immigration.gov.mn) ----------------------

const exempt30Europe = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Greece", "Hungary",
  "Iceland", "Ireland", "Italy", "Latvia", "Liechtenstein", "Lithuania",
  "Luxembourg", "Malta", "Monaco", "Netherlands", "Norway", "Poland",
  "Portugal", "Romania", "Slovakia", "Slovenia", "Spain", "Sweden",
  "Switzerland", "United Kingdom",
];

const exempt30Other = [
  "Canada", "China", "Hong Kong", "Israel", "Japan", "Laos",
  "Maldives", "Malaysia", "Philippines", "Russia", "Singapore",
  "Thailand", "Turkey", "UAE", "Uruguay", "Vietnam",
];

const exempt90 = [
  { country: "United States", note: "All passport types — up to 90 days" },
  { country: "South Korea", note: "Tourism only — extended through Dec 31, 2026 under \"Visit Mongolia Year\"" },
  { country: "Kazakhstan", note: "Up to 90 days" },
  { country: "Kyrgyzstan", note: "Up to 90 days" },
  { country: "Belarus", note: "Up to 90 days" },
  { country: "Uzbekistan", note: "Up to 90 days" },
  { country: "Ukraine", note: "With official invitation" },
  { country: "Macau", note: "Up to 90 days" },
  { country: "Argentina", note: "Up to 90 days" },
  { country: "Brazil", note: "Up to 90 days" },
  { country: "Chile", note: "Up to 90 days" },
  { country: "Colombia", note: "Ordinary passport only" },
  { country: "Ecuador", note: "Up to 90 days" },
  { country: "Peru", note: "Up to 90 days" },
];

// ---------------------- Visa Categories (source: immigration.gov.mn /en/visa-total/visa-type/) ----------------------

type VisaRow = { code: string; purpose: string; eligibility: string };
type VisaSeries = {
  series: string;
  title: string;
  blurb: string;
  rows: VisaRow[];
  icon: React.ComponentType<{ className?: string }>;
};

const visaSeries: VisaSeries[] = [
  {
    series: "A",
    title: "Diplomatic & Official",
    blurb: "For officials, diplomats, government representatives, and accredited foreign media.",
    icon: Landmark,
    rows: [
      { code: "A1", purpose: "Official business", eligibility: "Holders of diplomatic/official passports travelling on official duty" },
      { code: "A1-1", purpose: "Family of A1 holders", eligibility: "Accompanying family members" },
      { code: "A2", purpose: "Foreign media work", eligibility: "Foreign and international press / media staff" },
      { code: "A2-1", purpose: "Family of A2 holders", eligibility: "Accompanying family members" },
      { code: "A3", purpose: "Inter-governmental exchange", eligibility: "Government, municipal and international-organization representatives" },
      { code: "A3-1", purpose: "Family of A3 holders", eligibility: "Accompanying family members" },
    ],
  },
  {
    series: "B",
    title: "Investment & Business",
    blurb: "For foreign investors, executives, and representatives of foreign-invested entities.",
    icon: Briefcase,
    rows: [
      { code: "B1", purpose: "Investor", eligibility: "Investor in a foreign-invested company" },
      { code: "B1-1", purpose: "Family of B1", eligibility: "Accompanying family members" },
      { code: "B2", purpose: "Business representative", eligibility: "Executive / representative of a foreign-invested company" },
      { code: "B2-1", purpose: "Family of B2", eligibility: "Accompanying family members" },
      { code: "B3", purpose: "Foreign legal-entity representative", eligibility: "Representative of a foreign organization in Mongolia" },
      { code: "B3-1", purpose: "Family of B3", eligibility: "Accompanying family members" },
    ],
  },
  {
    series: "C",
    title: "Sector-Specific Employment",
    blurb: "Work visas issued by economic sector. An inviting institution must apply on the worker's behalf.",
    icon: Building2,
    rows: [
      { code: "C1", purpose: "Construction & infrastructure", eligibility: "Workers on construction, roads, bridges" },
      { code: "C2", purpose: "Science, education & IT", eligibility: "Science, education and technology professionals" },
      { code: "C3", purpose: "Geology, mining & energy", eligibility: "Geological survey, mining, oil and energy sector" },
      { code: "C4", purpose: "Finance, economics & law", eligibility: "Financial, economic and legal professionals" },
      { code: "C5", purpose: "Culture & sports", eligibility: "Workers in the culture, arts and sports sectors" },
      { code: "C6", purpose: "Manufacturing & services", eligibility: "Industrial and service-sector workers" },
      { code: "C7", purpose: "Agriculture", eligibility: "Agricultural and farming workers" },
      { code: "C8", purpose: "Healthcare", eligibility: "Medical professionals" },
      { code: "C9", purpose: "Humanitarian", eligibility: "Humanitarian-sector workers" },
      { code: "C10", purpose: "Domestic care services", eligibility: "Household and caregiving workers" },
      { code: "C11", purpose: "Transport & export cargo", eligibility: "Transport workers and export-cargo handlers" },
    ],
  },
  {
    series: "E",
    title: "Education & Research",
    blurb: "For students, researchers, interns and innovation programs.",
    icon: GraduationCap,
    rows: [
      { code: "E1", purpose: "Primary / secondary education", eligibility: "General-education students" },
      { code: "E2", purpose: "Higher education", eligibility: "University and college students" },
      { code: "E2-1", purpose: "Family of E2", eligibility: "Family members of higher-education students" },
      { code: "E3", purpose: "Vocational & language training", eligibility: "Mongolian language, history and culture programs" },
      { code: "E4", purpose: "Research / internship", eligibility: "Internships at state institutions and research bodies" },
      { code: "E5", purpose: "Innovation & research", eligibility: "Innovation projects and research activities" },
      { code: "E5-1", purpose: "Family of E5", eligibility: "Accompanying family members" },
    ],
  },
  {
    series: "F",
    title: "Family Reunification",
    blurb: "For spouses, children and relatives of Mongolian citizens or former Mongolian nationals.",
    icon: Heart,
    rows: [
      { code: "F1", purpose: "Spouse of Mongolian citizen", eligibility: "Registered marriage to a Mongolian citizen" },
      { code: "F1-1", purpose: "Relatives of F1", eligibility: "Parents, grandparents and children of an F1 holder" },
      { code: "F2", purpose: "Former Mongolian national", eligibility: "Person who renounced Mongolian citizenship" },
      { code: "F2-1", purpose: "Relatives of F2", eligibility: "Family members of an F2 holder" },
      { code: "F3", purpose: "Child of Mongolian citizen", eligibility: "Child born to a Mongolian parent" },
      { code: "F3-1", purpose: "Relatives of F3", eligibility: "Family members of an F3 holder" },
    ],
  },
  {
    series: "G",
    title: "Long-Term Migration",
    blurb: "For migrants and accompanying family members.",
    icon: Users,
    rows: [
      { code: "G", purpose: "Migration", eligibility: "Foreigners settling in Mongolia for long-term migration purposes" },
      { code: "G-1", purpose: "Family of G", eligibility: "Accompanying family members" },
    ],
  },
  {
    series: "H",
    title: "Personal & Special Cases",
    blurb: "For exceptional contributors, dual nationals and other personal grounds.",
    icon: Users,
    rows: [
      { code: "H1", purpose: "Special merit / exceptional service", eligibility: "Persons with outstanding contributions to Mongolia or specialized skills" },
      { code: "H1-1", purpose: "Family of H1", eligibility: "Accompanying family members" },
      { code: "H2", purpose: "Dual nationality background", eligibility: "Held Mongolian citizenship while acquiring foreign nationality" },
      { code: "H2-1", purpose: "Family of H2", eligibility: "Accompanying family members" },
      { code: "H3", purpose: "Other personal grounds", eligibility: "Other personal-purpose travel" },
    ],
  },
  {
    series: "J",
    title: "Religious Activity",
    blurb: "For clergy and religious workers invited by registered organizations.",
    icon: Landmark,
    rows: [
      { code: "J", purpose: "Religious work", eligibility: "Foreigners performing religious activity in Mongolia" },
      { code: "J-1", purpose: "Family of J", eligibility: "Accompanying family members" },
    ],
  },
  {
    series: "K",
    title: "Short Stay, Tourism & Transit",
    blurb: "Most travellers visiting Mongolia for tourism, short business trips or transit fall under this series.",
    icon: Plane,
    rows: [
      { code: "K1", purpose: "Short-term business / temporary work", eligibility: "Short business visits invited by a Mongolian entity" },
      { code: "K2", purpose: "Tourism", eligibility: "Leisure travel and sightseeing" },
      { code: "K3", purpose: "Border-zone tourism", eligibility: "Tourists visiting designated border regions" },
      { code: "K4", purpose: "Cultural & sports events", eligibility: "Athletes, performers, film crews, content creators" },
      { code: "K5", purpose: "Import cargo & passenger transport", eligibility: "Drivers/handlers of import cargo and passenger transport" },
      { code: "K6", purpose: "Transit", eligibility: "Foreigners transiting through Mongolia (up to 10 days)" },
      { code: "K7", purpose: "Working holiday", eligibility: "Short-term exchange programmes (currently Australia)" },
      { code: "K8", purpose: "Medical treatment", eligibility: "Patients receiving healthcare in Mongolia" },
    ],
  },
];

// ---------------------- Validity table ----------------------

const validityRows = [
  { type: "Single / double entry (visitor & work)", stay: "Up to 90 days", validity: "150 days" },
  { type: "Multiple entry (temporary resident)", stay: "Up to 30 days per entry", validity: "183 or 365 days" },
  { type: "All transit visas (K6)", stay: "Up to 10 days", validity: "150 days" },
  { type: "Border-zone tourist — daily (K3)", stay: "Up to 3 days", validity: "150 days" },
];

// ---------------------- Extension fees ----------------------

const extensionFees = [
  { duration: "1–7 days", fee: "40,000 ₮" },
  { duration: "10 days", fee: "56,800 ₮" },
  { duration: "20 days", fee: "112,800 ₮" },
  { duration: "30 days", fee: "168,800 ₮" },
];

export default function VisaPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero */}
        <section className="bg-gradient-to-br from-forest-900 to-forest-700 py-16">
          <div className="max-w-7xl mx-auto px-6 text-center text-white">
            <FileText className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Mongolia Visa Information for Travelers
            </h1>
            <p className="text-xl text-gold-300 max-w-3xl mx-auto">
              Your complete 2026 guide to Mongolia visa requirements, visa-free
              countries, e-visa applications, every visa category, and extension rules.
            </p>
            <p className="mt-6 text-sm text-gold-100">
              Sourced from the official Mongolia Immigration Agency —{" "}
              <a
                href="https://immigration.gov.mn/en/visa-total/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline inline-flex items-center gap-1 hover:text-white"
              >
                immigration.gov.mn <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </section>

        {/* Intro */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <p className="text-lg text-charcoal leading-relaxed">
            Planning your journey to the Land of the Eternal Blue Sky? Below
            you&apos;ll find the most up-to-date visa information for 2026 — visa-free
            access, the e-visa portal, every visa category Mongolia issues
            (Series A through K), validity periods, and what to do if you need to
            extend your stay.
          </p>
        </section>

        {/* Visa-Free Entry */}
        <section className="max-w-6xl mx-auto px-6 pb-12">
          <h2 className="text-3xl font-bold text-forest-900 mb-4 flex items-center gap-3">
            <Globe2 className="w-8 h-8 text-gold-500" />
            Visa-Free Entry to Mongolia
          </h2>
          <p className="text-charcoal mb-8">
            Mongolia offers visa-free entry to citizens of many countries under
            either <strong>temporary exemptions</strong> or{" "}
            <strong>permanent bilateral agreements</strong>. The lists below
            follow the official register published by the Consular Department.
          </p>

          {/* 30-day group */}
          <div className="bg-sand rounded-xl p-6 md:p-8 mb-10">
            <h3 className="text-2xl font-bold text-forest-900 mb-2">
              Visa-free up to 30 days
            </h3>
            <p className="text-charcoal mb-6">
              Citizens of these countries may enter Mongolia for up to{" "}
              <strong>30 days</strong> without a visa.
            </p>

            <h4 className="text-lg font-semibold text-forest-700 mb-3">Europe (32 countries)</h4>
            <CountryGrid countries={exempt30Europe} />

            <h4 className="text-lg font-semibold text-forest-700 mt-6 mb-3">
              Asia, Middle East, Americas & Pacific
            </h4>
            <CountryGrid countries={exempt30Other} />
          </div>

          {/* 90-day group */}
          <div className="bg-white border border-stone/20 rounded-xl p-6 md:p-8 mb-10">
            <h3 className="text-2xl font-bold text-forest-900 mb-2">
              Visa-free up to 90 days (extended stays)
            </h3>
            <p className="text-charcoal mb-6">
              Citizens of these countries enjoy longer visa-free stays under
              bilateral agreements or special programmes.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border border-stone/20 rounded-lg overflow-hidden">
                <thead className="bg-sand">
                  <tr>
                    <th className="text-left px-4 py-2 text-forest-900">Country</th>
                    <th className="text-left px-4 py-2 text-forest-900">Conditions</th>
                  </tr>
                </thead>
                <tbody>
                  {exempt90.map((r) => (
                    <tr key={r.country} className="border-t border-stone/20">
                      <td className="px-4 py-2 font-medium text-charcoal">{r.country}</td>
                      <td className="px-4 py-2 text-charcoal">{r.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-stone mt-4">
              Diplomatic and official passport holders from many additional
              countries enjoy separate visa-free arrangements — check with your
              Foreign Ministry or the Mongolian embassy.
            </p>
          </div>
        </section>

        {/* E-Visa */}
        <section className="bg-forest-900 text-white py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-4">Mongolia E-Visa (evisa.mn)</h2>
            <p className="text-gold-200 mb-8 text-lg">
              If your country is not on the visa-free lists, you may still qualify
              for Mongolia&apos;s electronic visa system — currently available to
              citizens of <strong>97 countries</strong>.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              <InfoCard label="Official Portal" value="evisa.mn" />
              <InfoCard label="Processing Time" value="Within 72 hours" />
              <InfoCard label="Application" value="Fully online" />
            </div>

            <a
              href="https://evisa.mn/en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-forest-900 font-semibold rounded-lg hover:bg-gold-400 transition-colors"
            >
              Apply on evisa.mn <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </section>

        {/* All Visa Categories */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-forest-900 mb-4 flex items-center gap-3">
            <FileText className="w-8 h-8 text-gold-500" />
            All Mongolia Visa Categories
          </h2>
          <p className="text-charcoal mb-10 max-w-3xl">
            Mongolia issues visas in nine letter-coded series, each covering a
            specific purpose of travel. Codes ending in <code>-1</code> are issued
            to accompanying family members of the primary visa holder.
          </p>

          <div className="space-y-8">
            {visaSeries.map((s) => (
              <SeriesCard key={s.series} series={s} />
            ))}
          </div>
        </section>

        {/* Validity & Duration */}
        <section className="bg-sand py-16">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-forest-900 mb-4 flex items-center gap-3">
              <Clock className="w-8 h-8 text-gold-500" />
              Visa Validity &amp; Duration
            </h2>
            <p className="text-charcoal mb-8">
              How long your visa is valid (the window in which you must enter
              Mongolia) and how long you may stay per entry.
            </p>
            <div className="overflow-x-auto bg-white rounded-xl border border-stone/20">
              <table className="w-full">
                <thead className="bg-forest-900 text-white">
                  <tr>
                    <th className="text-left px-4 py-3">Visa Type</th>
                    <th className="text-left px-4 py-3">Maximum Stay</th>
                    <th className="text-left px-4 py-3">Visa Validity</th>
                  </tr>
                </thead>
                <tbody>
                  {validityRows.map((r) => (
                    <tr key={r.type} className="border-t border-stone/20">
                      <td className="px-4 py-3 font-medium text-charcoal">{r.type}</td>
                      <td className="px-4 py-3 text-charcoal">{r.stay}</td>
                      <td className="px-4 py-3 text-charcoal">{r.validity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Visa Extension */}
        <section className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-forest-900 mb-4 flex items-center gap-3">
            <RefreshCw className="w-8 h-8 text-gold-500" />
            Extending Your Visa
          </h2>
          <p className="text-charcoal mb-8">
            Temporary visitors may extend their stay <strong>once</strong> for up
            to 30 days under Article 19.2 of the Law on the Legal Status of
            Foreign Nationals.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-10">
            <div className="bg-white border border-stone/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-forest-900 mb-3">Key rules</h3>
              <ul className="space-y-2 text-charcoal text-sm">
                <li>• Apply at least <strong>5 working days</strong> before your visa expires.</li>
                <li>• Only <strong>one extension</strong> is allowed per visit (max 30 days).</li>
                <li>• A new extension cannot be requested until <strong>90 days</strong> after the previous one expires.</li>
                <li>• Extensions are denied if you have violated immigration laws or have unpaid penalties.</li>
                <li>• Submit your application online via <strong>e-visa.mn</strong>.</li>
              </ul>
            </div>

            <div className="bg-white border border-stone/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-forest-900 mb-3">Required documents</h3>
              <ul className="space-y-2 text-charcoal text-sm">
                <li>• Invitation letter from your inviter explaining the grounds (or personal application)</li>
                <li>• Passport biographical page</li>
                <li>• Current Mongolian visa</li>
                <li>• Entry-stamp documentation</li>
                <li>• Proof of state-fee payment</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-bold text-forest-900 mb-3">State fees</h3>
          <div className="overflow-x-auto bg-white rounded-xl border border-stone/20">
            <table className="w-full">
              <thead className="bg-sand">
                <tr>
                  <th className="text-left px-4 py-3 text-forest-900">Extension duration</th>
                  <th className="text-left px-4 py-3 text-forest-900">State fee (MNT)</th>
                </tr>
              </thead>
              <tbody>
                {extensionFees.map((r) => (
                  <tr key={r.duration} className="border-t border-stone/20">
                    <td className="px-4 py-3 text-charcoal">{r.duration}</td>
                    <td className="px-4 py-3 font-medium text-charcoal">{r.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-stone mt-3">
            Fees are indicative and tiered by duration; the immigration agency
            publishes the full schedule on its portal.
          </p>
        </section>

        {/* Important Rules */}
        <section className="max-w-5xl mx-auto px-6 pb-16">
          <h2 className="text-3xl font-bold text-forest-900 mb-8 flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-gold-500" />
            Important Entry Rules &amp; Regulations
          </h2>

          <div className="space-y-6">
            <RuleCard
              title="Passport Validity"
              body="Your passport must be valid for at least 6 months from your date of entry into Mongolia."
            />
            <RuleCard
              title="Registration for Stays Over 30 Days"
              body="If you plan to stay in Mongolia for more than 30 days, you must register with the Mongolia Immigration Agency within 7 days of arrival."
            />
            <RuleCard
              title="Inviter Required for Most Long-Term Visas"
              body="Most visa categories outside tourism (K2/K3), transit (K6) and certain working-holiday programmes require a Mongolian inviting institution or citizen to apply on the applicant's behalf."
            />
            <RuleCard
              title="Consequences of Non-Registration"
              body="Failure to register for stays over 30 days will result in denial of exit at the border and fines imposed at departure."
              warning
            />
          </div>

          <div className="mt-10 bg-gold-50 border-l-4 border-gold-500 p-6 rounded-r-lg">
            <p className="text-charcoal">
              <strong>Please Note:</strong> Visa policies and bilateral agreements
              are subject to change. We strongly recommend verifying current
              requirements with the official portal{" "}
              <a
                href="https://immigration.gov.mn/en/visa-total/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-forest-700 hover:text-forest-900"
              >
                immigration.gov.mn
              </a>{" "}
              or your nearest Mongolian embassy before booking international flights.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-br from-gold-500 to-gold-600 py-16">
          <div className="max-w-4xl mx-auto px-6 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Explore Mongolia?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              With easier-than-ever entry requirements, there has never been a
              better time to discover Mongolia&apos;s vast steppes, the majestic
              Gobi Desert, nomadic culture, and ancient Silk Road heritage. Our
              experienced team is here to craft an unforgettable journey tailored
              just for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/tours"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-forest-900 font-semibold rounded-lg hover:bg-sand transition-colors"
              >
                Browse Our Tours
              </a>
              <a
                href="mailto:info@maralgoodreamland.com"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-forest-900 text-white font-semibold rounded-lg hover:bg-forest-700 transition-colors"
              >
                <Mail className="w-5 h-5" />
                info@maralgoodreamland.com
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

function CountryGrid({ countries }: { countries: string[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
      {countries.map((c) => (
        <div
          key={c}
          className="bg-white rounded-lg px-3 py-2 text-sm text-charcoal flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0" />
          {c}
        </div>
      ))}
    </div>
  );
}

function SeriesCard({ series }: { series: VisaSeries }) {
  const Icon = series.icon;
  return (
    <div className="bg-white border border-stone/20 rounded-xl overflow-hidden">
      <div className="flex items-start gap-4 p-6 bg-sand border-b border-stone/20">
        <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-forest-900 text-white text-2xl font-bold shrink-0">
          {series.series}
        </div>
        <div className="flex-1">
          <h3 className="text-xl md:text-2xl font-bold text-forest-900 flex items-center gap-2">
            <Icon className="w-5 h-5 text-gold-500" />
            Series {series.series} — {series.title}
          </h3>
          <p className="text-charcoal text-sm mt-1">{series.blurb}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white">
            <tr className="border-b border-stone/20">
              <th className="text-left px-4 py-2 text-forest-900 w-20">Code</th>
              <th className="text-left px-4 py-2 text-forest-900">Purpose</th>
              <th className="text-left px-4 py-2 text-forest-900">Eligibility</th>
            </tr>
          </thead>
          <tbody>
            {series.rows.map((r) => (
              <tr key={r.code} className="border-t border-stone/10">
                <td className="px-4 py-2 font-bold text-gold-600 align-top">{r.code}</td>
                <td className="px-4 py-2 font-medium text-charcoal align-top">{r.purpose}</td>
                <td className="px-4 py-2 text-charcoal align-top">{r.eligibility}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/10 rounded-lg p-5 border border-white/20">
      <div className="text-sm text-gold-200 mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function RuleCard({
  title,
  body,
  warning = false,
}: {
  title: string;
  body: string;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-xl p-6 border-l-4 ${
        warning
          ? "bg-red-50 border-red-500"
          : "bg-sand border-forest-700"
      }`}
    >
      <h3 className="text-xl font-bold text-forest-900 mb-2">{title}</h3>
      <p className="text-charcoal">{body}</p>
    </div>
  );
}
