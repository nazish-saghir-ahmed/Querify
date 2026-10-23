/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        querify: {
          // Dark Navy Blue Base & Canvas
          bg: '#0D1B2A',          // Deep Obsidian Navy Dark Canvas
          bgElevated: '#112236',  // Elevated Section Canvas
          surface: '#1B263B',     // Royal Slate Navy Surface
          card: 'rgba(13, 27, 42, 0.65)',     // Transparent Frosted Glass Card
          cardElevated: 'rgba(27, 38, 59, 0.75)',
          cardHover: 'rgba(27, 38, 59, 0.90)',
          border: 'rgba(65, 90, 119, 0.35)',  // Steel Blue Border (#415A77)
          borderHover: 'rgba(65, 90, 119, 0.65)',
          
          // Signature Dark Navy Blue Accent
          brand: '#1D3557',        // Rich Dark Navy Blue
          brandLight: '#2B4C7E',   // Elevated Dark Navy Slate
          brandHover: '#14253D',   // Deep Midnight Navy
          brandDim: '#0F1D30',
          brandMuted: 'rgba(29, 53, 87, 0.25)',
          brandBorder: 'rgba(58, 80, 107, 0.55)',

          // Secondary Dark Navy Accents
          navy: '#1D3557',
          navyDeep: '#14253D',
          navySlate: '#2B4C7E',
          navyBorder: '#3A506B',
          
          // Royal Gold Prestigious Status Accent (#D4AF37)
          gold: '#D4AF37',         // Royal Gold
          goldLight: '#E5C158',
          goldMuted: 'rgba(212, 175, 55, 0.15)',
          goldBorder: 'rgba(212, 175, 55, 0.40)',

          // Steel Blue Accent (#415A77)
          steel: '#415A77',
          steelLight: '#627D98',
          
          // Royal Champagne Ivory Typography (#F7F3E9)
          text: '#F7F3E9',         // Warm champagne ivory
          textMuted: '#94A3B8',    // Muted technical slate
          textSubtle: '#415A77',   // Subtle steel blue
          
          // Functional status colors
          success: '#10B981',
          warning: '#D4AF37',      // Royal Gold for ambiguity & warnings
          error: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'brand-glow': '0 0 25px -4px rgba(29, 53, 87, 0.50)',
        'brand-subtle': '0 0 15px -2px rgba(29, 53, 87, 0.30)',
        'gold-glow': '0 0 25px -4px rgba(212, 175, 55, 0.35)',
        'gold-subtle': '0 0 15px -2px rgba(212, 175, 55, 0.20)',
        'card-elevated': '0 16px 40px -12px rgba(5, 10, 20, 0.75)',
        'glass-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'shimmer': 'shimmer 2.5s infinite linear',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
}
