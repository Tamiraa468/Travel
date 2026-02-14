import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with Maralgoo Dreamland. Contact us for tour inquiries, bookings, or any questions about traveling in Mongolia.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    title: "Contact Us - Maralgoo Dreamland",
    description:
      "Contact us for tour inquiries and questions about Mongolia travel.",
    url: "/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
