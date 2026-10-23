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
          // Midnight Blue Canvas & Glass Surfaces
          bg: '#080D1A',          // Deepest Midnight Blue canvas
          bgElevated: '#0C152B',  // Elevated midnight section
          surface: '#101B37',     // Midnight blue surface
          card: '#0D172E',        // Frosted midnight blue card
          cardElevated: '#122042',
          cardHover: '#172852',
          border: '#1B2C55',      // Midnight blue crisp border
          borderHover: '#2A437E',

          // Midnight Blue Core Brand Colors
          brand: '#2563EB',       // Core midnight royal blue
          brandHover: '#1D4ED8',
          brandDark: '#1E3A8A',   // Rich Midnight Blue
          brandMuted: 'rgba(37, 99, 235, 0.14)',
          brandBorder: 'rgba(37, 99, 235, 0.4)',

          // Pure White & Light Tint Accents (Strict Blue & White Palette)
          white: '#FFFFFF',
          text: '#FFFFFF',        // Pure Crisp White
          textMuted: '#94A3B8',   // Light slate
          textSubtle: '#64748B',  // Darker slate
          
          // Midnight Blue Status Tokens (Replacing multi-colors)
          success: '#3B82F6',
          warning: '#60A5FA',
          error: '#93C5FD',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      maxWidth: {
        'content': '1150px',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.6)',
        'card': '0 10px 30px -5px rgba(2, 6, 23, 0.7)',
        'midnight': '0 0 25px -4px rgba(29, 78, 216, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
