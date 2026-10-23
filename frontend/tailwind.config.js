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
          bg: '#06080D',          // Deep obsidian black
          bgElevated: '#0A0E17',  // Elevated section background
          surface: '#0F1523',     // Clean dark panel surface
          card: '#131B2A',        // Card container
          cardHover: '#182338',   // Card hover state
          border: '#1C2638',      // Subtle titanium border
          borderHover: '#2A3A54', // Hover border
          
          // Signature Brand Color: Intelligent Electric Mint
          brand: '#00F5A0',
          brandHover: '#00DF89',
          brandDim: '#00B86F',
          brandMuted: 'rgba(0, 245, 160, 0.12)',
          brandBorder: 'rgba(0, 245, 160, 0.35)',
          
          // Typography neutrals
          text: '#F8FAFC',
          textMuted: '#94A3B8',
          textSubtle: '#64748B',
          
          // Functional status colors
          success: '#00F5A0',
          warning: '#F59E0B',
          error: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'brand-glow': '0 0 25px -4px rgba(0, 245, 160, 0.35)',
        'brand-subtle': '0 0 15px -2px rgba(0, 245, 160, 0.18)',
        'card-elevated': '0 12px 36px -8px rgba(0, 0, 0, 0.8)',
        'command-ring': '0 0 0 2px rgba(0, 245, 160, 0.25), 0 8px 32px -4px rgba(0, 0, 0, 0.7)',
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
