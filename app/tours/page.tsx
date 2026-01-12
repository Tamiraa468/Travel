import type { Metadata } from "next";
import ToursClient from "./ToursClient";

export const metadata: Metadata = {
  title: "Tours",
  description:
    "Explore our collection of authentic Mongolia tours. From Gobi Desert adventures to nomadic experiences, find your perfect journey.",
  alternates: {
    canonical: "/tours",
  },
  openGraph: {
    title: "Mongolia Tours - Maralgoo Dreamland",
    description:
      "Explore our collection of authentic Mongolia tours and adventures.",
    url: "/tours",
  },
};

export default function ToursPage() {
  return <ToursClient />;
}
