import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-50 border-t mt-12">
      <div className="max-w-6xl mx-auto px-4 py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} UTravel — Built with Next.js
      </div>
    </footer>
  );
}
