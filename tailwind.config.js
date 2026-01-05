/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./Components/**/*.{js,ts,jsx,tsx,mdx}", // capitalized folder on Linux/Vercel
  ],
  theme: {
extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'serif'],
      },
      colors: {
        forest: {
          500: '#3A6B52',
          700: '#2A5440',
          900: '#1D3D2F',
        },
        gold: {
          300: '#E5D4A1',
          500: '#C9A962',
          700: '#A68B4B',
        },
        navy: {
          600: '#4A5568',
          900: '#1A2B4A',
        },
        ivory: '#FAF9F6',
        sand: '#F5F1EA',
        charcoal: '#2D2D2D',
        stone: '#6B7280',
      },
    },  },
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
    // Brand colors - Forest Green & Gold
    'bg-forest-900',
    'bg-forest-700',
    'bg-forest-500',
    'bg-gold-500',
    'bg-gold-300',
    'bg-gold-700',
    'text-forest-900',
    'text-forest-700',
    'text-gold-500',
    'text-gold-300',
    'text-ivory',
    'bg-ivory',
    'bg-sand',
    'border-forest-500',
    'border-gold-500',
    'hover:bg-forest-700',
    'hover:bg-gold-300',
    'hover:text-gold-500',
  ],
  plugins: [],
};
