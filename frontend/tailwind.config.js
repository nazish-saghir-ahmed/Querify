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
          // Royal Navy & Slate Base (from image palette #0D1B2A, #1B263B, #415A77)
          bg: '#0D1B2A',          // Deep royal navy dark canvas
          bgElevated: '#112236',  // Elevated section base
          surface: '#1B263B',     // Royal slate surface
          card: 'rgba(13, 27, 42, 0.60)',     // Transparent frosted card
          cardElevated: 'rgba(27, 38, 59, 0.70)',
          cardHover: 'rgba(27, 38, 59, 0.85)',
          border: 'rgba(65, 90, 119, 0.35)',  // Steel blue titanium border (#415A77)
          borderHover: 'rgba(65, 90, 119, 0.65)',
          
          // Royal Blue Signature Brand Color
          brand: '#2563EB',        // Royal Blue
          brandLight: '#3B82F6',   // Electric Royal Blue
          brandHover: '#1D4ED8',   // Deep Royal Blue
          brandDim: '#1E40AF',
          brandMuted: 'rgba(37, 99, 235, 0.15)',
          brandBorder: 'rgba(59, 130, 246, 0.45)',
          
          // Royal Gold Prestigious Accent (#D4AF37)
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
        'brand-glow': '0 0 25px -4px rgba(37, 99, 235, 0.40)',
        'brand-subtle': '0 0 15px -2px rgba(37, 99, 235, 0.22)',
        'gold-glow': '0 0 25px -4px rgba(212, 175, 55, 0.35)',
        'gold-subtle': '0 0 15px -2px rgba(212, 175, 55, 0.20)',
        'card-elevated': '0 16px 40px -12px rgba(5, 10, 20, 0.75)',
        'glass-transparent': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'command-ring': '0 0 0 2px rgba(59, 130, 246, 0.35), 0 12px 36px -4px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'trace-flow': 'traceFlow 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        traceFlow: {
          '0%': { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
