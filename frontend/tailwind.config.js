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
          // Canvas & Neutral Surfaces
          bg: '#0B0F17',          // Base deep canvas
          bgElevated: '#111827',  // Elevated section canvas
          surface: '#151F32',     // Slate surface
          card: '#111827',        // Solid/frosted clean card
          cardElevated: '#162238',
          cardHover: '#1B2A45',
          border: '#1F2E47',      // Crisp subtle border
          borderHover: '#334B73',

          // Primary Brand Accent (Electric Indigo / Blue)
          brand: '#3B82F6',
          brandHover: '#2563EB',
          brandDark: '#1D4ED8',
          brandMuted: 'rgba(59, 130, 246, 0.12)',
          brandBorder: 'rgba(59, 130, 246, 0.35)',

          // Disambiguation & Ambiguity Accent (Warm Amber)
          amber: '#F59E0B',
          amberHover: '#D97706',
          amberMuted: 'rgba(245, 158, 11, 0.12)',
          amberBorder: 'rgba(245, 158, 11, 0.35)',

          // AST Verified & Success Accent (Emerald)
          emerald: '#10B981',
          emeraldMuted: 'rgba(16, 185, 129, 0.12)',
          emeraldBorder: 'rgba(16, 185, 129, 0.35)',

          // Typography
          text: '#F8FAFC',        // Slate 50
          textMuted: '#94A3B8',   // Slate 400
          textSubtle: '#64748B',  // Slate 500
          
          // Functional status
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
      maxWidth: {
        'content': '1150px',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
        'card': '0 10px 30px -5px rgba(0, 0, 0, 0.6)',
        'brand': '0 0 20px -4px rgba(59, 130, 246, 0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out forwards',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
