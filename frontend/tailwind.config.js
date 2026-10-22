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
          bg: '#080B14',
          surface: '#101827',
          card: '#151E30',
          hover: '#1B263D',
          border: '#1E293B',
          borderHover: '#334155',
          violet: '#8B5CF6',
          violetLight: '#A78BFA',
          cyan: '#22D3EE',
          cyanGlow: '#06B6D4',
          text: '#F8FAFC',
          muted: '#94A3B8',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'neon-violet': '0 0 25px -5px rgba(139, 92, 246, 0.4)',
        'neon-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.4)',
        'glow-subtle': '0 4px 20px -2px rgba(139, 92, 246, 0.15)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.5)' },
        }
      }
    },
  },
  plugins: [],
}
