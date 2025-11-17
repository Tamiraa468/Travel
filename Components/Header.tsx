import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-white shadow">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          UTravel
        </Link>
        <nav className="space-x-4">
          <Link href="/tours" className="text-sm">
            Tours
          </Link>
          <Link href="/aboutUs" className="text-sm">
            About
          </Link>
          <Link href="/contact" className="text-sm">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
