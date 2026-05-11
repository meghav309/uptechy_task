/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#060d1f',
          900: '#0a1628',
          800: '#0f2044',
          700: '#162d5e',
          600: '#1e3a7a',
        },
        slate: {
          850: '#1a2540',
        },
        cyan: {
          electric: '#00e5ff',
          glow: '#06b6d4',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'slide-in': 'slideIn 0.35s ease-out forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.6s infinite',
        'card-enter': 'cardEnter 0.45s ease-out forwards',
        'slide-in-right': 'slideInRight 0.32s cubic-bezier(0.32,0.72,0,1) forwards',
        'slide-out-right': 'slideOutRight 0.28s cubic-bezier(0.32,0.72,0,1) forwards',
        'backdrop-in': 'backdropIn 0.25s ease-out forwards',
        'backdrop-out': 'backdropOut 0.25s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,229,255,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,229,255,0.7)' },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        cardEnter: {
          '0%': { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' },
        },
        backdropIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        backdropOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
