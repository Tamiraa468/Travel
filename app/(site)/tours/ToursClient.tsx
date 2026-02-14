"use client";

import React from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import ToursSection from "@/Components/ToursSection";

export default function ToursClient() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow bg-sand">
        <ToursSection />
      </main>
      <Footer />
    </div>
  );
}
