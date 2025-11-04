/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}", // capitalized folder on Linux/Vercel
  ],
  theme: {
    extend: {},
  },
  // Safelist classes that are toggled dynamically in the source via
  // template literals / ternaries so Tailwind always includes them in
  // the production build (avoids purge/JIT misses on Vercel).
  safelist: [
    // exact classes used in conditionals
    'opacity-100',
    'opacity-0',
    'z-10',
    'z-0',
    'bg-orange-600',
    'bg-white/50',
    'bg-blue-600',
    'bg-gray-400/40',
    'bg-gray-50',
    'text-white',
    'text-gray-600',
    // contact form status
    'bg-red-100',
    'text-red-700',
    'bg-green-100',
    'text-green-700',
    // hover variants used in conditionals
    'hover:bg-gray-50',
  ],
  plugins: [],
};
