"use client";

import React, { useState } from "react";
import Navbar from "@/Components/Navbar";
import Footer from "@/Components/Footer";
import HeroSection from "@/Components/HeroSection";
import ToursSection from "@/Components/ToursSection";
import { useTravelAgencyContext } from "@/context/TravelAgencyContext";

const ToursPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-grow bg-sand">
        <ToursSection />
      </main>
      <Footer />
    </div>
  );
};

export default ToursPage;
